/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cdn.shopify.com', 'cdn.sanity.io'],
  },
  env: {
    SHOPIFY_STORE_FRONT_ACCESS_TOKEN: process.env.SHOPIFY_STORE_FRONT_ACCESS_TOKEN,
    SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN
  }
}


module.exports = nextConfig




/* module.exports = {
  env: {
    SHOPIFY_STORE_FRONT_ACCESS_TOKEN: process.env.SHOPIFY_STORE_FRONT_ACCESS_TOKEN,
    SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN
  }
}
 */
