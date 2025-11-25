import { defineSchema, defineTable } from "convex/server";
import {v} from "convex/values";

export const schema = defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    clerkId: v.string(),
  }).index("byClerkId", ["clerkId"]),

});
    