import Stripe from 'https://esm.sh/stripe@18.1.1?target=deno&deno-std=0.132.0&no-check';
import type { Stripe as StripeType } from "https://esm.sh/stripe@18.1.1";
import createOrRetrieveProfile from '../_utils/supabase.ts';

const secretKey = Deno.env.get('STRIPE_SECRET_KEY');
if (!secretKey) throw new Error("Missing STRIPE_SECRET_KEY");

export const stripe = new Stripe(secretKey, {
  httpClient: Stripe.createFetchHttpClient(),
}) as StripeType;

Deno.serve(async (req: Request) => {
  console.log("STRIPE_SECRET_KEY loaded:", !!secretKey);

  try {
    const { amount } = await req.json();
    const customer = await createOrRetrieveProfile(req);

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer },
      { apiVersion: "2020-08-27" }
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      customer: customer,
      // ephemeralKey: ephemeralKey.secret,
    });

    return new Response(JSON.stringify({
        paymentIntent: paymentIntent.client_secret,
        publishableKey: Deno.env.get('EXPO_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
        ephemeralKey: ephemeralKey.secret,
        customer: customer,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  // deno-lint-ignore no-explicit-any
  } catch (error:any) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
