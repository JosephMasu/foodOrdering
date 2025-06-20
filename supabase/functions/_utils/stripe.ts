import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno&deno-std=0.132.0&no-check';

export const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-08-16',
}) as any;
