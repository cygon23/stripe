import { defineSchema, defineTable } from "convex/server";
import {v} from "convex/values";
import { title } from "process";

export  default  defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    clerkId: v.string(),
  }).index("byClerkId", ["clerkId"]),

  courses: defineTable({
    title: v.string(),
    description: v.string(),
    imageUrl: v.string(),
    price: v.number(),
  })

});
    