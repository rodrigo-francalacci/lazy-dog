import Client from 'shopify-buy';
export const shopifyClient = Client.buildClient({
/*   storefrontAccessToken: process.env.SHOPIFY_STORE_FRONT_ACCESS_TOKEN!,
  domain: process.env.SHOPIFY_STORE_DOMAIN!, */
  storefrontAccessToken: process.env.SHOPIFY_STORE_FRONT_ACCESS_TOKEN!,
  domain: process.env.SHOPIFY_STORE_DOMAIN!,
});
export const parseShopifyResponse = (response: any) =>
  JSON.parse(JSON.stringify(response));