import { internal } from "./_generated/api";
import { v } from "convex/values";

// Scheduled function to clean up expired links
export const cleanupExpiredLinks = internal.scheduled.cleanupExpiredLinks;

// This function runs daily
export async function handleExpiredLinksCleanup(ctx: any) {
  const now = Date.now();

  // Find all expired links
  const expiredLinks = await ctx.db
    .query("links")
    .filter((q) => {
      return q.and(
        q.lt(q.field("expiresAt"), now),
        q.eq(q.field("isExpired"), false)
      );
    })
    .collect();

  // Mark them as expired
  for (const link of expiredLinks) {
    await ctx.db.patch(link._id, {
      isExpired: true,
    });
  }

  console.log(`Marked ${expiredLinks.length} links as expired`);
}

// Cron job configuration
// Every day at 2 AM UTC
// 0 2 * * *
export const expiredLinksCleanup = {
  schedule: "0 2 * * *",
  handler: handleExpiredLinksCleanup,
};
