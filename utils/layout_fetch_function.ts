import { storefront } from "./shopify_fetch_function";
import { collectionsListQuery, formatCollectionsListResponse } from "./shopify_colllection_query";
import { categoriesListQuery, formatCategoriesListResponse } from "./sanity_queries";
import { layoutQuery } from "./sanity_queries";
import { mySanityClient } from "../lib/sanityClient";

//Types
import { collectionsListProps } from "./shopify_colllection_query";

export async function getLayoutProps() {

  //Get the site settings (footer, etc...) and banners from sanity
  const sanityLayoutItems = await mySanityClient.fetch(layoutQuery);
  
  //Get the collections/categories to fill the navbar
  let collectionsResponse: collectionsListProps[]; //collections to populate the navbar can come from Sanity or Shopify

    //If products data are comming from sanity
    if (sanityLayoutItems.sitesettings.productsSource === 'Sanity'){
      const sanityCollectionsResponse = await mySanityClient.fetch(categoriesListQuery);
      
      collectionsResponse = formatCategoriesListResponse(sanityCollectionsResponse)

    }
    //if products data are comming from shopify
    else
    {
      /* Get the response of the query from our storefront() fetching function 
      We are getting a list o collections to populate the navbar 
      as well as the products that will be displayed in the home page*/
      const shopifyCollectionsResponse = await storefront(collectionsListQuery);
      collectionsResponse = formatCollectionsListResponse(shopifyCollectionsResponse)
    }
  
  
  return {
    collectionsResponse: collectionsResponse, 
    sanityLayoutItems: sanityLayoutItems
  }
};