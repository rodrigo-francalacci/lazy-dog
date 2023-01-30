import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);
//in nextJS each file jas to have it's own handler
export default async function handler(req, res) {
  
    console.log(req)
    if (req.method === 'POST') {
    try {

      //Parameters to create a session
      const params = {
        submit_type: 'pay',
        mode: 'payment',
        payment_method_types : ['card'],
        billing_address_collection: 'auto',
        shipping_options:[
            {shipping_rate: 'shr_1MTmTJIzzlSWeJzZNkyjEJrf'},
            {shipping_rate: 'shr_1MTmUoIzzlSWeJzZnV88pAzP'},
        ],


        //Mapping the items in the cart
        line_items: req.body.map((item) => {
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
        }),

        //What opens after finishing the purchase
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
      }

      // Create Checkout Sessions from body params defined before.
      const session = await stripe.checkout.sessions.create(params);
      res.redirect(200, session.url);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}