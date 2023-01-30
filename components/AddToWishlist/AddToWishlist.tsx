/* React/Next */
import React from "react";
import { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";

/* Styles */
import styles from "./AddToWishlist.module.scss";
import { BsHeartFill, BsHeart } from "react-icons/bs";

/* Context Custom Hooks  */
import { useProfile } from "../../context/profile-context";

/* 
===================================
COMPONENT
==================================*/
const AddToWishlist = ({sanitySlug, className = ""}: { sanitySlug: string; className?: string}) => {
  
  //States and Refs
  const [Icon, setIcon] = useState<JSX.Element>(
    <BsHeart className={styles.empty} size={30} />
  ); //Icon selector state
  const router = useRouter();

  //Context and Hooks
  const UpdateWishlist = useProfile().UpdateWishlist;
  const wishlist = useProfile().userData?.wishlist;
  const mode = useProfile().mode;

  //UseEffect
  useEffect(() => {
    if (mode === "EDIT") {
      if (wishlist?.includes(sanitySlug)) {
        setIcon(<BsHeartFill className={styles.fill} size={30} />);
      } else {
        setIcon(<BsHeart className={styles.empty} size={30} />);
      }
    }
  }, [wishlist]);

  //Function Toggle wishlist
  const handleAddClick = () => {
    //If the wishlist is not undefined or null
    if (wishlist) {
      //if this item is on the wishlist we remove it from there
      if (wishlist.includes(sanitySlug)) {
        let newlist = wishlist.filter((item) => item !== sanitySlug);
        UpdateWishlist?.(newlist);
      }
      //If the item is not in the list we add it to the list
      else {
        //...(wishlist || [])  to avoid problems if wishlist is undefined
        let newlist = [...(wishlist || []), sanitySlug];
        UpdateWishlist?.(newlist);
      }
    } else {
      router.push("/Profile/Profile");
    }
  };

  //JSX Return
  return (
    <div
      className={`${styles.container} ${className}`}
      onClick={handleAddClick}
    >
      {Icon}
    </div>
  );
};

export default AddToWishlist;
