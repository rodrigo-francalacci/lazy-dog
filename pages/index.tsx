/* React/Next */
import * as React from 'react';
import type { NextPage } from 'next'
import Link from 'next/link';

/* Components */
import ProductCard from '../components/ProductCard/ProductCard'
import Carousel from '../styles/Carousel/Carousel'
import ArticleCard from '../components/ArticleCard/ArticleCard'
import SEO from '../components/SEO/SEO';
import Hero from '../components/Hero/Hero';

/* Style */
import styles from './Home.module.scss'
import { motion } from 'framer-motion';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';

/* Queries */
import {collectionPageQuery, formatCollectionPageQueryResponse} from '../utils/shopify_colllection_query' // collections query to fill the page
import {list_of_postsQuery, format_List_of_posts} from '../utils/sanity_queries' 
import {homeHero_and_showcase_Query, format_homeHero_and_showcase } from '../utils/sanity_queries';

/* Types */
import {thisCollectionProps, productProps} from '../utils/shopify_colllection_query' //queries Types
import {list_of_postsProps, homeHero_and_showcaseProps} from '../utils/sanity_queries'

type ShopifyFormated = {
  thisCollection: thisCollectionProps;
  products: productProps[];
}

/* 
PAGE COMPONENT
+++++++++++++++++++++++++++++++++++++++*/
const Home: NextPage<any> = ({shopifyResponse, sanityPostsList, sanityHeroAndProducts}: any) => {
       
      /*Prepare/format the response (typing and removing unnecessary objects and arrays and some other things)
      The metatags informations we should fetch everytime we load a dynamic page (product, collections)
      to ensure a good SEO, check this link (https://www.techomoro.com/render-dynamic-title-and-meta-tags-in-a-next-js-app/) */
      const {thisCollection, products}: ShopifyFormated = formatCollectionPageQueryResponse(shopifyResponse);

      //Format the list of posts
      const blogPosts: list_of_postsProps[] = format_List_of_posts(sanityPostsList);

      //Format Sanity Hero and showcase Products
      const hero: homeHero_and_showcaseProps = format_homeHero_and_showcase(sanityHeroAndProducts)
      
/* JSX Return 
+++++++++++++++++++++++++++++++++++++++++++++++*/
      return (
        
        <div className={styles.container}>

            {/* Head and metatags generator */}
            <SEO title={"Home"} description={thisCollection.SEO_description} /> 
            
            {hero.heroTitle ? 
              <div className={styles.hero}>
                <Hero imgUrl={hero.heroImageURL} title={hero.heroTitle} description={hero.heroDescription}/> 
              </div>
              :
              <h2 className={`worksans-h2  ${styles.h2_title}`}>{thisCollection.title}</h2>
            }

            <p className={`worksans-paragraph`}>{thisCollection.descriptionPage}</p>

            

            <div className={styles.products_container}>

                {/* Mapping the products */}
                {products.map((item, index)=>{
                  return(
                    <motion.div 
                        key={`${item.shopifyHandle}${index}`}
                        initial={{opacity: 0, y: -70}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.20 * index}}
                        viewport={{ once: true }}>

                          <ProductCard
                              name={item.title} 
                              price={item.price} 
                              imgUrl={item.thumbnail_URL}
                              productHandle={item.shopifyHandle}
                              collectionID={item.collectionID}/>

                  </motion.div>
                  )
                })}

            </div>

            <Link href="/Blog/Blog">
              <h2 className={`worksans-h2  ${styles.h2_article}`}><a>Articles</a></h2>
            </Link>

            <div className={styles.articles_wrapper}>
            
              <div className={`article-arrow-div-height ${styles.left_arrow}`}><div><AiOutlineArrowLeft/></div></div>
                <div className={styles.carousel_container}>
                  <Carousel>

                    {/* mapping articles */}
                      {blogPosts?.length > 0 && blogPosts.map((item, index)=>{
                        return(
                          <div key={index} className={`article-card-width ${styles.slider_item}`}>
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

      export default Home

/* 
==================================================================================
DATA FETCHING
==================================================================================
*/


/*GETTING DATA FROM SHOPIFY

*First aproach

  We could use the "Shopify JavaScript Buy SDK"  as this tutorial (https://blog.logrocket.com/build-ecommerce-app-nextjs-shopify/)
  suggests.
  1) Instal npm install shopify-buy
  2) const products = await shopifyClient.product.fetchAll();
     or something like 
     const prod = await shopifyClient.product.fetchQuery({first: 1, sortKey: 'ID', reverse: true, query: 'title:*Ada - Duvet Set*'});

  However this approach don't allow us to fetch the metafields,
  and also we might end up fetching a lot of unecessary information

* Second approach

  1) We create a storefront() function inside the file "/utils/shopify.ts" and fetch the data using
     the nomal javscript fetch function with the method POST and a GraphQL query.*/

/* API */
import { storefront } from '../utils/shopify_fetch_function'
import { mySanityClient } from '../lib/sanityClient';


export async function getStaticProps() {

    //FROM SHOPIFY
    //Get the products that will be displayed in the home page
    const shopifyResponse = await storefront(collectionPageQuery("frontpage"));

    //FROM SANITY
    //Get the list of posts from sanity
    const sanityPostsList = await mySanityClient.fetch(list_of_postsQuery);
    
    //Get hero and showcase products from sanity (we are not using the showcase products because we are getting them from shopify)
    //However the environment for getting this products from sanity is already working
    const sanityHeroAndProducts = await mySanityClient.fetch(homeHero_and_showcase_Query);
    
  
  return {
   props: {
    shopifyResponse: shopifyResponse, 
    sanityPostsList: sanityPostsList,
    sanityHeroAndProducts: sanityHeroAndProducts
  }

 }
};



