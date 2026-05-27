import { httpRouter } from "convex/server";
import { query } from "./_generated/server";

const http = httpRouter();

// Redirect endpoint: GET /:slug
http.route({
  path: "/:slug",
  method: "GET",
  handler: async (ctx, request) => {
    const slug = request.url.split("/").pop();

    if (!slug) {
      return new Response("Not found", { status: 404 });
    }

    const db = ctx.db;

    // Find link by slug
    const link = await db
      .query("links")
      .withIndex("by_slug")
      .filter((q) => q.eq(q.field("slug"), slug))
      .first();

    if (!link) {
      return new Response("Short link not found", { status: 404 });
    }

    // Check if expired
    if (link.isExpired || (link.expiresAt && link.expiresAt < Date.now())) {
      return new Response("This link has expired", { status: 410 });
    }

    // Record click (async - fire and forget)
    const referrer = request.headers.get("referer") || undefined;
    const userAgent = request.headers.get("user-agent") || undefined;
    const ipAddress = request.headers.get("x-forwarded-for") || "unknown";
    const country = request.headers.get("cf-ipcountry") || undefined;

    // Schedule click recording (non-blocking)
    ctx.scheduler.runAfter(0, async () => {
      try {
        await db.insert("clicks", {
          linkId: link._id,
          timestamp: Date.now(),
          referrer,
          country,
          deviceType: parseDeviceType(userAgent || ""),
          userAgent,
          ipAddress,
        });

        // Update click count
        const updated = await db.get(link._id);
        if (updated) {
          await db.patch(link._id, {
            clicks: updated.clicks + 1,
          });
        }
      } catch (err) {
        console.error("Failed to record click:", err);
      }
    });

    // Return 302 redirect for analytics accuracy (avoids browser caching)
    return new Response(null, {
      status: 302,
      headers: {
        Location: link.originalUrl,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  },
});

// Health check endpoint
http.route({
  path: "/health",
  method: "GET",
  handler: async () => {
    return new Response(JSON.stringify({ status: "ok" }), {
      headers: { "Content-Type": "application/json" },
    });
  },
});

function parseDeviceType(userAgent: string): string {
  if (/mobile|android|iphone|ipad|windows phone/i.test(userAgent)) {
    return "mobile";
  }
  if (/tablet|ipad/i.test(userAgent)) {
    return "tablet";
  }
  return "desktop";
}

export default http;
