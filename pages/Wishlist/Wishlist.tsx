/* React */
import React from "react";
import { useState, useEffect } from "react";

/* Components */
import ProductCard from "../../components/ProductCard/ProductCard";
import SEO from "../../components/SEO/SEO";

/* Style */
import styles from "./Wishlist.module.scss";
import { motion } from "framer-motion";

/* Context and Custom Hooks */
import { useProfile } from "../../context/profile-context";

/* Amplify */
import { Authenticator, withAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";

/* Amplify Configure */
/* import awsmobile from "../../aws-exports";
Amplify.configure(awsmobile); */
Amplify.configure(JSON.parse(process.env.NEXT_PUBLIC_AMPLIFY_EXPORTS!));

/* 
PAGE COMPONENT
==============================================*/
const Wishlist = () => {
  //States from profile context
  const firstName = useProfile().userData?.firstName;
  const lastName = useProfile().userData?.lastName;
  const wishlist = useProfile().wishlist;

  /* JSX RETURN
==============================================*/

  return (
    <div className={styles.container}>
      {/* Head and metatags generator */}
      <SEO
        title={`${firstName} ${lastName} 'Wish list'`}
        description={`Wish list of ${firstName} ${lastName}`}
      />

      <h2 className={`worksans-h2  ${styles.h2_title}`}>Wishlist</h2>

      {/* User list title*/}
      <p className={`worksans-paragraph`}>{`${firstName} ${lastName}`}</p>

      {/* Mapping the products */}
      <div className={styles.products_container}>
        {wishlist!?.length > 0 &&
          wishlist!.map((item, index) => {
            return (
              <motion.div
                key={`${item.handle}${index}`}
                onClick={() => {}}
                initial={{ opacity: 0, y: -70 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
              >
                <ProductCard
                  name={item.title}
                  price={item.price}
                  imgUrl={item.thumbnail_URL}
                  collectionID={item.collectionID}
                  productHandle={item.handle}
                />
              </motion.div>
            );
          })}
      </div>
    </div>
  );
};

export default withAuthenticator(Wishlist);
