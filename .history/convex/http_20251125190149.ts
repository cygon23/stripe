import { httpRouter, HttpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import path from "path";

const http = httpRouter();

const clerkWebhook = httpAction(async(req, ctx) => {
  const webhokSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhokSecret) {
    throw new Error("CLERK_WEBHOOK_SECRET is not set");
  }

  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return   new Response("Missing Svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  try{
    evt = wh.verify(
        body,{
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature
        }) as WebhookEvent;

  }catch(e){
   console.error("Failed to verify webhook:", e);
   return new Response("Invalid webhook signature", { status: 400 });
  }

  try{

  }catch(e){
});

http.route(
    path:"/clerk-webhook",
    method:"POST",
    handler: clerkWebhook
)

export default http