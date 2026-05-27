import { Auth } from "convex/server";

export const auth = {
  async getUserIdentity(ctx: any) {
    const identity = await ctx.auth.getUserIdentity();
    return identity;
  },
};
