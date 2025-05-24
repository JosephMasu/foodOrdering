// Setup type definitions for built-in Supabase Runtime APIs
import { stripe } from "../_utils/stripe.ts"

Deno.serve(async (req) => {
  try {
    const { amount } = await req.json()

    // Create a PaymentIntent with the amount from the request
    const paymentIntent = await stripe.paymentIntents.create({
      amount:1099,
      currency: "usd",
    })

    // Prepare the response data
    const res = {
      paymentIntent: paymentIntent.client_secret,
      publishableKey: Deno.env.get('EXPO_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
    }

    return new Response(JSON.stringify(res), {
      headers: { "Content-Type": "application/json" },
    })
}catch(error){
  return new Response(JSON.stringify(error), {
  headers: { 'Content-Type': 'application/json' },
  status: 400,

});
}
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/payment-sheet' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"amount":"1150"}'

*/
