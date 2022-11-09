import { default as fetch } from 'node-fetch'; 


/* export const postToShopify = async ({ query, variables = {} }) => {
  try {
    const result = await fetch(process.env.NEXT_PUBLIC_SHOPIFY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token':
        'd255195f8609fc16fef6a8292f7b63a7',
        
      },
      body: JSON.stringify({ query, variables }),
    }).then((res) => res.json());

    if (result.errors) {
      console.log({ errors: result.errors });
    } else if (!result || !result.data) {
      console.log({ result });
      return 'No results found.';
    }

    return result.data;
  } catch (error) {
    console.log(error);
  }
}; */


/* 
Check the endpoint URL here
https://shopify.dev/api/admin-graphql#endpoints
*/
export async function storefront(query: string, variables = {}){

  
  const response = await fetch(process.env.NEXT_PUBLIC_SHOPIFY_API_ENDPOINT!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN!
    },
    body: JSON.stringify({query, variables}),
  })

  return response.json()
}