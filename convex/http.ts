import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";

const http = httpRouter();

const clerkWebhook = httpAction(async (ctx, req) => {  
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    throw new Error("CLERK_WEBHOOK_SECRET is not set");
  }

  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(webhookSecret);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature
    }) as WebhookEvent;
  } catch (e) {
    console.error("Failed to verify webhook:", e);
    return new Response("Invalid webhook signature", { status: 400 });
  }

  try {
    const eventType = evt.type;
    
    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name } = evt.data;
      const email = email_addresses?.[0]?.email_address || null;
      const name = `${first_name ?? ""} ${last_name ?? ""}`.trim();

      try {
        await ctx.runMutation(api.users.createUser, {
          email,
          name,
          clerkId: id,
        });
      } catch (e) {
        console.error("Error creating user in Convex:", e);
        return new Response("Error creating user", { status: 500 });
      }

      return new Response("User created", { status: 200 });
    }

    return new Response("Event received", { status: 200 });
  } catch (e) {
    console.error("Webhook handler error:", e);
    return new Response("Internal error", { status: 500 });
  }
});

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: clerkWebhook,
});

export default http;