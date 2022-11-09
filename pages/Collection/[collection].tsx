/* React */
import * as React from 'react';
import type { NextPage } from 'next'

/* Components */
import ProductCard from '../../components/ProductCard/ProductCard'
import Carousel from '../../styles/Carousel/Carousel'
import ArticleCard from '../../components/ArticleCard/ArticleCard'
import SEO from '../../components/SEO/SEO';

/* Style */
import styles from './Collection.module.scss'
import { motion } from 'framer-motion';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';

/* API */
import { storefront } from '../../utils/shopify_fetch_function'
import { mySanityClient } from '../../lib/sanityClient';

/* Queries */
import {collectionPageQuery, formatCollectionPageQueryResponse} from '../../utils/shopify_colllection_query' // collection query to fill the navbar
import {collectionsListQuery, formatCollectionsListResponse} from '../../utils/shopify_colllection_query' // collection query to fill the navbar
import {list_of_postsQuery, format_List_of_posts} from '../../utils/sanity_queries' 

/* Types */
import {thisCollectionProps, productProps} from '../../utils/shopify_colllection_query' //queries Types
import {list_of_postsProps} from '../../utils/sanity_queries'

type ShopifyFormated = {
  thisCollection: thisCollectionProps;
  products: productProps[];
}

/* 
PAGE COMPONENT
==============================================*/
const Collection: NextPage<any> = ({shopifyResponse, sanityPostsList}: any) => {

    //Format the shopify response using the function in "/utils/queries.ts"
    const {thisCollection, products}: ShopifyFormated = formatCollectionPageQueryResponse(shopifyResponse);

    //Format the list of posts
    const blogPosts: list_of_postsProps[] = format_List_of_posts(sanityPostsList);

/* JSX RETURN
==============================================*/

      return ( 
       
      <div className={styles.container}>

          {/* Head and metatags generator */}
        <SEO title={thisCollection.title} description={thisCollection.SEO_description} /> 

          <h2 className={`worksans-h2  ${styles.h2_title}`}>{thisCollection.title}</h2>
          <p className={`worksans-paragraph`}>{thisCollection.descriptionPage}</p>

          {/* Mapping the products */}
          <div className={styles.products_container}>
                {products.map((item, index)=>{
                return(
                    <motion.div key={`${item.shopifyHandle}${index}`} onClick={()=>{}}
                        initial={{opacity: 0, y: -70}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.20 * index}}
                        >
                          <ProductCard 
                              name={item.title}
                              price={item.price}
                              imgUrl={item.thumbnail_URL}
                              collectionID={item.collectionID}
                              productHandle={item.shopifyHandle}
                              />
                </motion.div>
                )
                })}    
          </div>

          {/* Articles secction title */}
          <h2 className={`worksans-h2  ${styles.h2_article}`}>Articles</h2>

          <div className={styles.articles_wrapper}>
          
          <div className={`article-arrow-div-height ${styles.left_arrow}`}><div><AiOutlineArrowLeft/></div></div>
              <div className={styles.carousel_container}>
                <Carousel>

                  {/* mapping articles */}
                    {blogPosts?.length > 0 && blogPosts.map((item, index)=>{
                      return(
                        <div key={index} className={styles.slider_item}>
                          <ArticleCard thumbnail_URL={item.thumbnail_url} title={item.title} slug={item.slug}/>
                        </div>
                      )
                    })}

                </Carousel>
              </div>
              <div className={`article-arrow-div-height ${styles.right_arrow}`}><div><AiOutlineArrowRight/></div></div>

          </div>

      </div> )
    }

    export default Collection


/* 
==================================================================================
DATA FETCHING
==================================================================================
*/


    //GETTING THE PATHS
    export async function getStaticPaths() {
        /* (1) Get the response of the query from our storefront() fetching function */
        const collectionsListQueryResponse = await storefront(collectionsListQuery);

        /* (2) Prepare/format the response (typing and removing unnecessary objects and arrays and some other things) */
        const collectionsList = formatCollectionsListResponse(collectionsListQueryResponse.data.collections);

        const paths = collectionsList.map((item =>{
            return {
                params: {
                    //this variable has to match [collection].tsx file fo the dynamic routes
                    collection: item.handle
                }
            }
        }))

        return{
            paths,
            fallback: false,
        }
        // Nice tutorial on how to use geStaticPaths https://www.youtube.com/watch?v=NaYs1Gdg4AE   
    }

    //GETTING THE PROPS
    export const getStaticProps = async (context: any) => {
    const {params} = context;
   
      //FROM SHOPIFY
      //Get the products that will be displayed in the home page
      const shopifyResponse = await storefront(collectionPageQuery(params.collection));
      
      //FROM SANITY
      //Get the list of posts from sanity
      const sanityPostsList = await mySanityClient.fetch(list_of_postsQuery);
        
      return {
      props: {
        shopifyResponse: shopifyResponse, 
        sanityPostsList: sanityPostsList,
      }
    };
    }






