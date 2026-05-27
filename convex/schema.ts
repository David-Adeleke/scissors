import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  links: defineTable({
    userId: v.string(),
    originalUrl: v.string(),
    slug: v.string(),
    customSlug: v.optional(v.string()),
    clicks: v.number(),
    createdAt: v.number(),
    expiresAt: v.optional(v.number()),
    isExpired: v.boolean(),
    qrColor: v.optional(v.string()),
    qrBackgroundColor: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_userId", ["userId"])
    .index("by_expiresAt", ["expiresAt"])
    .index("by_createdAt", ["userId", "createdAt"]),

  clicks: defineTable({
    linkId: v.id("links"),
    timestamp: v.number(),
    referrer: v.optional(v.string()),
    country: v.optional(v.string()),
    deviceType: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
  })
    .index("by_linkId_timestamp", ["linkId", "timestamp"])
    .index("by_linkId", ["linkId"]),

  rateLimitBuckets: defineTable({
    ipAddress: v.string(),
    count: v.number(),
    resetAt: v.number(),
  })
    .index("by_ipAddress", ["ipAddress"]),

  reservedSlugs: defineTable({
    slug: v.string(),
  })
    .index("by_slug", ["slug"]),
});
