import { NextApiRequest, NextApiResponse } from 'next'

/*
 * Product data can be loaded from anywhere. In this case, we’re loading it from
 * a local JSON file, but this could also come from an async call to your
 * inventory management service, a database query, or some other API call.
 *
 * The important thing is that the product info is loaded from somewhere trusted
 * so you know the pricing information is accurate.
 */

import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2022-11-15',
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
        //Mapping the items in the cart
        const line_items = req.body.cart.map((item: any) => {
            return {
                price_data:{
                    currency: 'gbp',
                    product_data: {
                        name: item.title,
                        images: [item.imageURL],
                    },
                    unit_amount: item.price * 100 /* The unit amount is pences */
                },
                adjustable_quantity:{
                    enabled: false,
                },
                quantity: item.quantity
            }
        })

      // Create Checkout Sessions from body params.
      const params: Stripe.Checkout.SessionCreateParams = {
        submit_type: 'pay',
        shipping_options: [{shipping_rate: "shr_1MVnZJIzzlSWeJzZlptEVQjr"}],
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        customer: req.body.customer_id,
        shipping_address_collection:{
          allowed_countries: ['GB']
        },
        payment_intent_data:{
          setup_future_usage: 'on_session'
        },
        line_items,
        mode: 'payment',
        /* success_url: `${req.headers.origin}/?success=true` */ //https://stripe.com/docs/payments/checkout/custom-success-page
        success_url: `${req.headers.origin}/Success/Success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/Success/Success?session_id=canceled`,
        /* cancel_url: `${req.headers.origin}/?canceled=true`,  */
        
      }

      const checkoutSession: Stripe.Checkout.Session =
        await stripe.checkout.sessions.create(params)

      res.status(200).json(checkoutSession)

    } catch (err) {
      console.log(err)
      const errorMessage =
        err instanceof Error ? err.message : 'Internal server error'
      res.status(500).json({ statusCode: 500, message: errorMessage })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}