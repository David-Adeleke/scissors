import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";
import {
  generateSlug,
  isValidUrl,
  isPhishingUrl,
  isValidCustomSlug,
  isReservedSlug,
  parseDeviceType,
} from "./utils";

// Create a new shortened link
export const createLink = mutation({
  args: {
    originalUrl: v.string(),
    customSlug: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
    qrColor: v.optional(v.string()),
    qrBackgroundColor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Authenticate user
    const identity = await auth.getUserIdentity(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.subject;

    // Validate original URL
    if (!isValidUrl(args.originalUrl)) {
      throw new Error("Invalid URL format");
    }

    if (isPhishingUrl(args.originalUrl)) {
      throw new Error("URL blocked - suspected phishing domain");
    }

    // Rate limiting for anonymous users
    const rateLimitCheck = await ctx.db
      .query("rateLimitBuckets")
      .withIndex("by_ipAddress")
      .filter((q) => q.eq(q.field("ipAddress"), identity.tokenIdentifier))
      .first();

    if (
      rateLimitCheck &&
      rateLimitCheck.count >= 5 &&
      rateLimitCheck.resetAt > Date.now()
    ) {
      throw new Error("Rate limit exceeded. Try again later.");
    }

    let slug: string;

    // Handle custom slug or generate one
    if (args.customSlug) {
      if (!isValidCustomSlug(args.customSlug)) {
        throw new Error("Invalid slug format (3-50 chars, alphanumeric + hyphens)");
      }

      if (isReservedSlug(args.customSlug)) {
        throw new Error("This slug is reserved");
      }

      // Check uniqueness
      const existing = await ctx.db
        .query("links")
        .withIndex("by_slug")
        .filter((q) => q.eq(q.field("slug"), args.customSlug!.toLowerCase()))
        .first();

      if (existing) {
        throw new Error("Slug already taken");
      }

      slug = args.customSlug.toLowerCase();
    } else {
      // Generate unique slug
      slug = generateSlug();
      let attempts = 0;

      while (attempts < 10) {
        const existing = await ctx.db
          .query("links")
          .withIndex("by_slug")
          .filter((q) => q.eq(q.field("slug"), slug))
          .first();

        if (!existing) break;
        slug = generateSlug();
        attempts++;
      }

      if (attempts === 10) {
        throw new Error("Failed to generate unique slug");
      }
    }

    // Create link document
    const linkId = await ctx.db.insert("links", {
      userId,
      originalUrl: args.originalUrl,
      slug,
      customSlug: args.customSlug?.toLowerCase(),
      clicks: 0,
      createdAt: Date.now(),
      expiresAt: args.expiresAt,
      isExpired: false,
      qrColor: args.qrColor || "#000000",
      qrBackgroundColor: args.qrBackgroundColor || "#FFFFFF",
    });

    return { linkId, slug };
  },
});

// Record a click on a link
export const recordClick = mutation({
  args: {
    slug: v.string(),
    referrer: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    country: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db
      .query("links")
      .withIndex("by_slug")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .first();

    if (!link) {
      throw new Error("Link not found");
    }

    if (link.isExpired || (link.expiresAt && link.expiresAt < Date.now())) {
      throw new Error("Link expired");
    }

    // Record click
    await ctx.db.insert("clicks", {
      linkId: link._id,
      timestamp: Date.now(),
      referrer: args.referrer,
      country: args.country,
      deviceType: args.userAgent ? parseDeviceType(args.userAgent) : "unknown",
      userAgent: args.userAgent,
      ipAddress: args.ipAddress,
    });

    // Increment click count
    await ctx.db.patch(link._id, {
      clicks: link.clicks + 1,
    });

    return { originalUrl: link.originalUrl };
  },
});

// Delete a link
export const deleteLink = mutation({
  args: {
    linkId: v.id("links"),
  },
  handler: async (ctx, args) => {
    const identity = await auth.getUserIdentity(ctx);
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const link = await ctx.db.get(args.linkId);
    if (!link || link.userId !== identity.subject) {
      throw new Error("Not found or unauthorized");
    }

    // Delete all associated clicks
    const clicks = await ctx.db
      .query("clicks")
      .withIndex("by_linkId")
      .filter((q) => q.eq(q.field("linkId"), args.linkId))
      .collect();

    for (const click of clicks) {
      await ctx.db.delete(click._id);
    }

    // Delete the link
    await ctx.db.delete(args.linkId);
  },
});

// Get user's links
export const getUserLinks = query({
  handler: async (ctx) => {
    const identity = await auth.getUserIdentity(ctx);
    if (!identity) {
      return [];
    }

    const links = await ctx.db
      .query("links")
      .withIndex("by_userId")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .collect();

    return links.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get link details with analytics
export const getLinkAnalytics = query({
  args: {
    linkId: v.id("links"),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db.get(args.linkId);
    if (!link) return null;

    const clicks = await ctx.db
      .query("clicks")
      .withIndex("by_linkId")
      .filter((q) => q.eq(q.field("linkId"), args.linkId))
      .collect();

    return {
      link,
      clicks,
      clicksByCountry: aggregateByCountry(clicks),
      clicksByDevice: aggregateByDevice(clicks),
      clicksByReferrer: aggregateByReferrer(clicks),
      clicksOverTime: aggregateByTime(clicks),
    };
  },
});

// Check slug availability
export const checkSlugAvailable = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    if (isReservedSlug(args.slug)) {
      return { available: false, reason: "reserved" };
    }

    const existing = await ctx.db
      .query("links")
      .withIndex("by_slug")
      .filter((q) => q.eq(q.field("slug"), args.slug.toLowerCase()))
      .first();

    return {
      available: !existing,
      reason: existing ? "taken" : null,
    };
  },
});

// Helper: Aggregate clicks by country
function aggregateByCountry(clicks: any[]) {
  const map: Record<string, number> = {};
  clicks.forEach((c) => {
    const country = c.country || "Unknown";
    map[country] = (map[country] || 0) + 1;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

// Helper: Aggregate clicks by device type
function aggregateByDevice(clicks: any[]) {
  const map: Record<string, number> = {};
  clicks.forEach((c) => {
    const device = c.deviceType || "Unknown";
    map[device] = (map[device] || 0) + 1;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

// Helper: Aggregate clicks by referrer
function aggregateByReferrer(clicks: any[]) {
  const map: Record<string, number> = {};
  clicks.forEach((c) => {
    const referrer = c.referrer || "Direct";
    const domain = extractDomain(referrer);
    map[domain] = (map[domain] || 0) + 1;
  });
  return Object.entries(map)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, value]) => ({ name, value }));
}

// Helper: Aggregate clicks over time (hourly)
function aggregateByTime(clicks: any[]) {
  const map: Record<number, number> = {};
  clicks.forEach((c) => {
    const hour = Math.floor(c.timestamp / (1000 * 60 * 60)) * (1000 * 60 * 60);
    map[hour] = (map[hour] || 0) + 1;
  });
  return Object.entries(map)
    .map(([time, value]) => ({
      time: new Date(parseInt(time)).toISOString(),
      value,
    }))
    .sort((a, b) => a.time.localeCompare(b.time));
}

// Helper: Extract domain from referrer URL
function extractDomain(referrer: string): string {
  if (!referrer) return "Direct";
  try {
    const url = new URL(referrer);
    return url.hostname;
  } catch {
    return referrer;
  }
}
