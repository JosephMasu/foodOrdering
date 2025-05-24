// esm.sh is used to compile stripe-node to be compatible with ES modules.
import Stripe from 'https://esm.sh/stripe@18.1.1 ?target=deno&deno-std=0.132.0&no-check';

export const stripe = Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  httpClient: Stripe.createFetchHttpClient(),
});