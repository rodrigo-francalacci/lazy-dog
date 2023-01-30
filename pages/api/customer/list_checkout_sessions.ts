import { NextApiRequest, NextApiResponse } from 'next'

import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2022-11-15',
})

export default async function handler( req: NextApiRequest, res: NextApiResponse) {

  const id: string = req.query.costumer_id as string
  
  try {

    const sessions = await stripe.checkout.sessions.list({
      customer: id,
    });

    res.status(200).json(sessions)
    return sessions
    
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Internal server error'
    res.status(500).json({ statusCode: 500, message: errorMessage })
  }
}