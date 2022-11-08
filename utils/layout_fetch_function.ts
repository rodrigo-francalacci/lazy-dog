import { storefront } from "./shopify_fetch_function";
import { collectionsListQuery } from "./shopify_colllection_query";
import { layoutQuery } from "./sanity_queries";
import { mySanityClient } from "../lib/sanityClient";

export async function getLayoutProps() {

    /* Get the response of the query from our storefront() fetching function 
       We are getting a list o collections to populate the navbar 
       as well as the products that will be displayed in the home page*/
    const shopifyCollectionsResponse = await storefront(collectionsListQuery);

    //Get the site settings (footer, etc...) and banners from sanity
    const sanityLayoutItems = await mySanityClient.fetch(layoutQuery);

  return {
    shopifyCollectionsResponse: shopifyCollectionsResponse, 
    sanityLayoutItems: sanityLayoutItems
  }
};