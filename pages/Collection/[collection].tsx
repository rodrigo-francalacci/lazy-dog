/* React */
import * as React from 'react';
import type { NextPage } from 'next'

/* Components */
import ProductCard from '../../components/ProductCard/ProductCard'
import Carousel from '../../components/Carousel/Carousel'
import ArticleCard from '../../components/ArticleCard/ArticleCard'
import SEO from '../../components/SEO/SEO';

/* Style */
import styles from './Collection.module.scss'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';

/* Sanity Formating */
import { PortableText } from '@portabletext/react'

/* API */
import { storefront } from '../../utils/shopify_fetch_function'
import { mySanityClient } from '../../lib/sanityClient';

/* Queries */
import {collectionPageQuery, formatCollectionPageQueryResponse} from '../../utils/shopify_colllection_query' // collection query to fill the navbar
import {collectionsListQuery, formatCollectionsListResponse} from '../../utils/shopify_colllection_query' // collection query to fill the navbar
import {categoriesListQuery, formatCategoriesListResponse } from '../../utils/sanity_queries';
import {categoryPageQuery, formatCategoryPageQueryResponse } from '../../utils/sanity_queries';
import {productsInCategoryQuery, format_productsInCategory } from '../../utils/sanity_queries';
import {list_of_postsQuery, format_List_of_posts} from '../../utils/sanity_queries' 

/* Types */
import {thisCollectionProps, productProps} from '../../utils/shopify_colllection_query' //queries Types
import {list_of_postsProps} from '../../utils/sanity_queries'

type PageProps = {
  thisCollection: thisCollectionProps;
  products: productProps[];
  sanityPostsList: any;
  source: string
}

/* 
PAGE COMPONENT
==============================================*/
const Collection: NextPage<PageProps> = ({products, thisCollection, sanityPostsList, source}: PageProps) => {

    //Format the list of posts
    const blogPosts: list_of_postsProps[] = format_List_of_posts(sanityPostsList);

/* JSX RETURN
==============================================*/

      return (
        <div className={styles.container}>
          {/* Head and metatags generator */}
          <SEO
            title={thisCollection.title}
            description={thisCollection.SEO_description}
          />

          <h2 className={`worksans-h2  ${styles.h2_title}`}>
            {thisCollection.title}
          </h2>

          {/* If Sanity is the source we return a portable text, if is Shopify, we return a simple paragraph */}
          {source === "Sanity" ? (
            <PortableText value={thisCollection.descriptionPage} />
          ) : (
            <p className={`worksans-paragraph`}>
              {thisCollection.descriptionPage}
            </p>
          )}

          {/* Mapping the products */}
          <div className={styles.products_container}>
            {products?.length > 0 &&
              products.map((item, index) => {
                return (
                  <div key={`${item.handle}${index}`}>
                    <ProductCard
                      name={item.title}
                      price={item.price}
                      imgUrl={item.thumbnail_URL}
                      collectionID={item.collectionID}
                      productHandle={item.handle}
                    />
                  </div>
                );
              })}
          </div>

          {/* Articles secction title */}
          <h2 className={`worksans-h2  ${styles.h2_article}`}>Articles</h2>

          <div className={styles.articles_wrapper}>
            <div className={`article-arrow-div-height ${styles.left_arrow}`}>
              <div>
                <AiOutlineArrowLeft />
              </div>
            </div>
            <div className={styles.carousel_container}>
              <Carousel>
                {/* mapping articles */}
                {blogPosts?.length > 0 &&
                  blogPosts.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={`article-card-width ${styles.slider_item}`}
                      >
                        <ArticleCard
                          thumbnail_URL={item.thumbnail_url}
                          title={item.title}
                          slug={item.slug}
                        />
                      </div>
                    );
                  })}
              </Carousel>
            </div>
            <div className={`article-arrow-div-height ${styles.right_arrow}`}>
              <div>
                <AiOutlineArrowRight />
              </div>
            </div>
          </div>
        </div>
      );
    }

    export default Collection


/* 
==================================================================================
DATA FETCHING
==================================================================================
*/


  //GETTING THE PATHS ---------------------------------
  export async function getStaticPaths() {

   //Set the variable paths
   var paths: {params: {collection: string}}[] = []

   //CHECK IF WE WILL TAKE THE PATHS FROM SANITY OR FROM SHOPIFY
   const source = await mySanityClient.fetch(`*[_type == 'siteSettings'][0]{productsSource}`);

      //IF FROM SANITY
      if(source.productsSource === 'Sanity'){
        /* (1) Get the response of the query from sanity */
        const sanityCollectionsResponse = await mySanityClient.fetch(categoriesListQuery);
        
        /* (2) Prepare/format the response (typing and removing unnecessary objects and arrays and some other things) */
        const collectionsResponse = formatCategoriesListResponse(sanityCollectionsResponse)

        paths = collectionsResponse.map((item =>{
          return {
              params: {
                  //this variable has to match [collection].tsx file fo the dynamic routes
                  collection: item.handle,
              }
          }
      }))
      
      }
      
      //IF FROM SHOPIFY
      else{

          /* (1) Get the response of the query from our storefront() fetching function */
          const collectionsListQueryResponse = await storefront(collectionsListQuery);

          /* (2) Prepare/format the response (typing and removing unnecessary objects and arrays and some other things) */
          const collectionsList = formatCollectionsListResponse(collectionsListQueryResponse.data.collections);

          paths = collectionsList.map((item =>{
              return {
                  params: {
                      //this variable has to match [collection].tsx file fo the dynamic routes
                      collection: item.handle,
                  }
              }
          }))
      }

        
        //RETURN THE PATHS 
        return{
            paths,
            //https://spacejelly.dev/posts/how-to-update-static-content-in-next-js-automatically-with-incremental-static-regeneration-isr/
            fallback: false 
        }
        // Nice tutorial on how to use geStaticPaths https://www.youtube.com/watch?v=NaYs1Gdg4AE   
    }


    //GETTING THE PROPS ---------------------------------
    export const getStaticProps = async (context: any) => {
    const {params} = context;
    var products: productProps[] = null!;
    var thisCollection: thisCollectionProps;


      //FETCH PRODUCTS
      //CHECK IF WE WILL FETCH THE PRODUCT FROM SANITY OR FROM SHOPIFY
      const source = await mySanityClient.fetch(`*[_type == 'siteSettings'][0]{productsSource}`);
      
          // IF FROM SANITY
          if(source.productsSource  === 'Sanity'){
            
            let sanityResponse = {
              category: await mySanityClient.fetch(categoryPageQuery(params.collection)),
              products: await mySanityClient.fetch(productsInCategoryQuery(params.collection))
            }

            thisCollection = formatCategoryPageQueryResponse(sanityResponse.category);
            products = format_productsInCategory(sanityResponse);
          
          }
          // IF FROM SHOPIFY
          else{
            const shopifyResponse = await storefront(collectionPageQuery(params.collection));
            const shopifyFormated = formatCollectionPageQueryResponse(shopifyResponse);
            products = shopifyFormated.products;
            thisCollection = shopifyFormated.thisCollection;
          }
      
      
      //FROM SANITY
      //Get the list of posts from sanity
      const sanityPostsList = await mySanityClient.fetch(list_of_postsQuery);
        
      return {
      props: {
        products: products,
        thisCollection: thisCollection,
        sanityPostsList: sanityPostsList,
        source: source.productsSource 
      },
      // Next.js will attempt to re-generate the page:
      // - When a request comes in
      // - At most once every 10 seconds
      // https://spacejelly.dev/posts/how-to-update-static-content-in-next-js-automatically-with-incremental-static-regeneration-isr/
      /* revalidate: 10,  */
      
    };
    }






