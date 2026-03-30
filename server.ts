import express from "express";
import path from "path";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();



const app = express();

// Stripe setup
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

// Stripe Webhook Endpoint
app.post("/api/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET || "whsec_placeholder"
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log(`Payment successful for session ${session.id}`);
  }
  res.json({ received: true });
});

app.use(express.json());

// API to create a Stripe Subscription Checkout Session
app.post("/api/create-checkout-session", async (req, res) => {
  const { userId, email, isYearly } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: "Big Cat Graphics Pro Subscription",
            description: "Unlock 4K, Ultrawide, and Live Wallpapers",
          },
          unit_amount: isYearly ? 4800 : 500,
          recurring: { interval: isYearly ? "year" : "month" },
        },
        quantity: 1,
      }],
      mode: "subscription",
      subscription_data: { trial_period_days: 7 },
      success_url: `${req.headers.origin}/?session_id={CHECKOUT_SESSION_ID}&status=success`,
      cancel_url: `${req.headers.origin}/?status=cancel`,
      client_reference_id: userId,
    });
    res.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Session Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// For local development with Vite
async function configureVite(app: express.Express) {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

// Export the app for Vercel
export default app;

// Listen only if running directly
if (import.meta.url === `file://${process.argv[1]}` || process.env.NODE_ENV !== 'production') {
  const PORT = parseInt(process.env.PORT || "3008");
  configureVite(app).then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}
