/* React/Next */
import * as React from "react";
import type { NextPage } from "next";
import Link from "next/link";

/* Components */
import ProductCard from "../components/ProductCard/ProductCard";
import Carousel from "../components/Carousel/Carousel";
import ArticleCard from "../components/ArticleCard/ArticleCard";
import SEO from "../components/SEO/SEO";
import Hero from "../components/Hero/Hero";

/* Style */
import styles from "./Home.module.scss";
import { motion } from "framer-motion";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";

/* Queries */
import {
  collectionPageQuery,
  formatCollectionPageQueryResponse,
} from "../utils/shopify_colllection_query"; // collections query to fill the page
import {
  productsShowcaseQuery,
  format_productsInCategory,
} from "../utils/sanity_queries";
import {
  list_of_postsQuery,
  format_List_of_posts,
} from "../utils/sanity_queries";
import { homeHero_Query, format_homeHero } from "../utils/sanity_queries";

/* Types */
import { productProps } from "../utils/shopify_colllection_query"; //queries Types
import { list_of_postsProps, homeHeroProps } from "../utils/sanity_queries";

type Props = {
  products: productProps[];
  sanityHero: any;
  sanityPostsList: any;
};

/* 
PAGE COMPONENT
+++++++++++++++++++++++++++++++++++++++*/
const Home: NextPage<Props> = ({
  products,
  sanityHero,
  sanityPostsList,
}: Props) => {
  //Format the list of posts
  const blogPosts: list_of_postsProps[] = format_List_of_posts(sanityPostsList);

  //Format Sanity Hero and showcase Products
  const hero: homeHeroProps = format_homeHero(sanityHero);

  /* JSX Return 
+++++++++++++++++++++++++++++++++++++++++++++++*/
  return (
    <div className={styles.container}>
      {/* Head and metatags generator */}
      <SEO title={"Home"} description={hero.homeDescription} />

      {hero.heroTitle ? (
        <div className={styles.hero}>
          <Hero
            imgUrl={hero.heroImageURL}
            title={hero.heroTitle}
            description={hero.heroDescription}
          />
        </div>
      ) : (
        <h2 className={`worksans-h2  ${styles.h2_title}`}>Home</h2>
      )}

      <p className={`worksans-paragraph`}>{hero.homeDescription}</p>

      <div className={styles.products_container}>
        {/* Mapping the products */}
        {products.map((item, index) => {
          return (
            <motion.div
              key={`${item.handle}${index}`}
              initial={{ opacity: 0, y: -70 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index }}
              viewport={{ once: true }}
            >
              <ProductCard
                name={item.title}
                price={item.price}
                imgUrl={item.thumbnail_URL}
                productHandle={item.handle}
                collectionID={item.collectionID}
              />
            </motion.div>
          );
        })}
      </div>

      <Link href="/Blog/Blog">
        <h2 className={`worksans-h2  ${styles.h2_article}`}>
          <a>Articles</a>
        </h2>
      </Link>

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
};

export default Home;

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
import { storefront } from "../utils/shopify_fetch_function";
import { mySanityClient } from "../lib/sanityClient";

export async function getStaticProps() {
  var products: productProps[] = null!;

  //Check if we are gonna take the PRODUCTS data from Sanity or from Shopofy
  const source = await mySanityClient.fetch(
    `*[_type == 'siteSettings'][0]{productsSource}`
  );

  // IF FROM SANITY
  if (source.productsSource === "Sanity") {
    //Get the products from the showcase in sanity
    const sanityProducts = await mySanityClient.fetch(productsShowcaseQuery);

    //Format the products
    products = format_productsInCategory(sanityProducts);
  }

  // IF FROM SHOPIFY
  else {
    //Get the products that will be displayed in the home page
    const shopifyResponse = await storefront(collectionPageQuery("frontpage"));

    /*Prepare/format the response (typing and removing unnecessary objects and arrays and some other things)
          The metatags informations we should fetch everytime we load a dynamic page (product, collections)
          to ensure a good SEO, check this link (https://www.techomoro.com/render-dynamic-title-and-meta-tags-in-a-next-js-app/) */
    const shopifyFormated = formatCollectionPageQueryResponse(shopifyResponse);
    products = shopifyFormated.products;
  }

  //LIST OF POSTS FROM SANITY
  //Get the list of posts from sanity
  const sanityPostsList = await mySanityClient.fetch(list_of_postsQuery);

  //GET HERO FROM SANITY
  const sanityHero = await mySanityClient.fetch(homeHero_Query);

  return {
    props: {
      products: products,
      sanityHero: sanityHero,
      sanityPostsList: sanityPostsList,
    },
  };
}
