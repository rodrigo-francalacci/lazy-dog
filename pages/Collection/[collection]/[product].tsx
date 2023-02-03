/* React */
import React from "react";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";

/* Redux */
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { addToCart } from "../../../slices/cartSlice";

/* Style */
import styles from "./Product.module.scss";

/* Components */
import QuantityBox from "../../../components/QuantityBox/QuantityBox";
import Buttom from "../../../components/Buttom/Buttom";
import SEO from "../../../components/SEO/SEO";
import toast, { Toaster } from "react-hot-toast";
import ShareBot from "../../../components/ShareBot/ShareBot";
import { DragSlider } from "../../../styles/DragSlider/DragSlider";
import AddToWishlist from "../../../components/AddToWishlist/AddToWishlist";

/* API */
import { storefront } from "../../../utils/shopify_fetch_function";
import { mySanityClient } from "../../../lib/sanityClient";

/* Queries */
import {
  collectionsListQuery,
  formatCollectionsListResponse,
} from "../../../utils/shopify_colllection_query"; //to fill the navbar
import { productsListQuery } from "../../../utils/shopify_colllection_query"; //list of products
import {
  productPageQuery,
  formatProductPageQuery,
} from "../../../utils/shopify_product_query";
import {
  singleProductQuery,
  formatSanitySingleProduct,
} from "../../../utils/sanity_queries";

/* Types */
import { collectionsListProps } from "../../../utils/shopify_colllection_query";
import { singleProductProps } from "../../../utils/shopify_product_query"; //Type for each indivdual product
type WeightProps = { value: number; unit: string };

/* 
===================================
PAGE COMPONENT
==================================*/
const Product = ({ product }: { product: singleProductProps }) => {
  //We can't declare the dispatch variable inside a function or hook
  //Otherwise we can get "Error: Invalid hook call. Hooks can only be called inside of the body of a function component.""
  const dispatch = useAppDispatch();

  //States and Refs
  const ref_personalised = useRef<HTMLDivElement>(null!);
  const ref_dogsName = useRef<HTMLInputElement>(null!);
  const ref_variants = useRef<HTMLDivElement[][]>(new Array());
  const variants = useRef<number[]>(new Array());

  const [price, setPrice] = useState<Number>(
    Number(product.priceRange.normalPrice.amount)
  );
  const [weight, setWeight] = useState<WeightProps>(product.weight[0]);
  const [count, setCount] = useState(1); // quantity selector

  /* USE EFFECTS
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

  useEffect(() => {
    //Enables to type the dog's name if there is the 'Personalized' option
    let __FOUND = product.options.findIndex(function (variant, index) {
      if (variant.name == "Personalized") return true;
    });
  
    if (__FOUND > -1) {
      ref_personalised.current.style.display = "block";
    } else {
      ref_personalised.current.style.display = "none";
    }
  
    //Select the first option for each variant
    variants.current = loadVariantsState();
    setPrice(recalcPrice());
    for (let n = 0; n < ref_variants.current.length; n++) {
      selectedOptionsInDOM(n, 0);
      setWeight(
        product.options[n].values[0].weight
          ? { value: product.options[n].values[0].weight, unit: "kg" }
          : weight
      );
    }
  
    /* We need this dependency to make sure 
   this field is updated for every product */
  }, [product.handle, product.options]);

  /* AUX FUNCTIONS */
  //++++++++++++++++++++++++++++++++++++++++++++++++++++

  function buildImagesArray(product: singleProductProps) {
    let output: { url: string; alt: string }[] = product.imagesURL.map(
      (item) => {
        return {
          url: `${item}`,
          alt: `${product.title} Lazy Dog Company Duvet`,
        };
      }
    );

    return output;
  }

  //Get the id for cart tracking combining all the options ID's
  function idBuilder() {
    let out: string = product.id;
    product.options?.length > 0 &&
      product.options.map((variant, n) => {
        out = `${out}${variant.values[variants.current[n]].id}`;
      });
    return out;
  }

  function aux_addToCart() {
    //Get checkout thumbnail
    function getThumbnail() {
      if (product.checkoutThumbnailURL) {
        return product.checkoutThumbnailURL; //if we have a thumbnail
      } else if (product.imagesURL.length > 1) {
        return product.imagesURL[product.imagesURL.length - 2];
      } else {
        return product.imagesURL[0];
      }
    }

    //Get title combining all the options selected
    function titleBuilder() {
      let opt: string = "";
      product.options?.length > 0 &&
        product.options.map((variant, n) => {
          opt = `${opt} (${variant.name} - ${
            variant.values[variants.current[n]].option
          })`;
        });
      return opt;
    }

    //Get personalized status
    function getPersonalizedStatus() {
      let __FOUND = product.options.findIndex(function (variant, index) {
        if (variant.name == "Personalized") return true;
      });

      if (__FOUND === -1) {
        return "no";
      } else {
        return product.options[__FOUND].values[
          variants.current[__FOUND]
        ].option.toLowerCase();
      }
    }

    //Add the product to the cart
    dispatch(
      addToCart({
        id: idBuilder(),
        title: `${product.title} ${titleBuilder()}`,
        shortDetails: product.shortDescription,
        price: Number(price),
        personalized: getPersonalizedStatus(),
        dogName: ref_dogsName.current.value.trim(),
        imgURL: getThumbnail(),
        quantity: count,
      })
    );

    //Set the counter in the page (not the cart) = 1
    setCount(1);

    toast.success(
      `${count} x ${product.title} ${titleBuilder()} was added to cart`
    );
  }

  function typingHandle() {}

  /* Getting "count" value from the child (QuantityBox component) */
  function handleClick(action: "add" | "subtract") {
    if (action === "add") {
      setCount(count + 1);
    } else {
      if (count === 1) {
        setCount(1);
      } else {
        setCount(count - 1);
      }
    }
  }

  /* Check if detail should show up */
  function display(item: any) {
    if (item?.length > 0) {
      return { display: "block" };
    } else {
      return { display: "none" };
    }
  }

  /* AUX FUNCTIONS TO HANDLE VARIANTS AND OPTIONS OF THE PRODUCTS */
  //++++++++++++++++++++++++++++++++++++++++++++++++++++

  /* Dynamicaly creates a reference for each variant when they are mapped */
  function addToRefs(el: any, variantIndex: number, optionIndex: number) {
    if (ref_variants.current.length - 1 < variantIndex) {
      ref_variants.current[variantIndex] = [];
    }

    if (el && !ref_variants.current[variantIndex].includes(el)) {
      ref_variants.current[variantIndex][optionIndex] = el;
    }
  }

  /* Select the first option for each variant in the variant array */
  function loadVariantsState() {
    let out: number[] = [];
    for (let n = 0; n < product.options.length; n++) {
      out.push(0);
    }
    return out;
  }

  /* Update the state of the variants */
  function updateVariantsState(variantIndex: number, optionIndex: number) {
    variants.current[variantIndex] = optionIndex;
  }

  /* Recalculate the price */
  function recalcPrice() {
    let out: number = Number(product.priceRange.normalPrice.amount);
    if (variants.current.length > 0) {
      for (let n = 0; n < product.options.length; n++) {
        out = out + product.options[n].values[variants.current[n]].price;
      }
    }
    return out;
  }

  /* Select the options in the DOM */
  function selectedOptionsInDOM(variantIndex: number, optionIndex: number) {
    ref_variants.current[variantIndex].forEach((element, n) => {
      if (n === optionIndex) {
        element.style.backgroundColor = "black";
        element.style.border = "solid 1px grey";
        element.style.color = "white";
      } else {
        element.style.backgroundColor = "white";
        element.style.border = "solid 1px grey";
        element.style.color = "black";
      }
    });
  }

  /* Switch variants when the client click on one option */
  function handleVariantClick(
    event: React.MouseEvent,
    variantIndex: number,
    optionIndex: number
  ) {
    event.preventDefault();
    selectedOptionsInDOM(variantIndex, optionIndex);
    updateVariantsState(variantIndex, optionIndex);
    setWeight(
      product.options[variantIndex].values[optionIndex].weight
        ? {
            value: product.options[variantIndex].values[optionIndex].weight,
            unit: "kg",
          }
        : weight
    );
    setPrice(recalcPrice());
    //Enables/Disable field to type dog's name
    if( product.options[variantIndex].name === "Personalized" ){
      if(product.options[variantIndex].values[optionIndex].option === "No"){
        ref_personalised.current.style.display = "none"
      } else{
        ref_personalised.current.style.display = "block"
      }
    }
  }

  /* JSX PAGE RETURN 
/++++++++++++++++++++++++++++++++++++++++++++++++++++*/
  return (
    <div className={`worksans-product-page ${styles.container}`}>
      {/* Head and metatags generator */}
      <SEO title={product.title} description={product.SEO_description} />

      {/* Temporary  message when the user clicks on "add to cart" 
        more information on https://react-hot-toast.com/*/}
      <Toaster
        toastOptions={{
          className: `worksans-toast ${styles.toast}`,
          duration: 1500,
          icon: "🐕",
        }}
      />

      {/* The slider with the pictures */}
      <div className={styles.imageSlider}>
        {/* The buildImagesArray() function will put the image url and the img alt
            in the same object fo the image slider component to use */}
        <DragSlider
          slides={buildImagesArray(product)}
          aspectRatio="66%"
          objectFit="contain"
        />

        <ShareBot
          title={`${product.title} - Lazy Dog Company`}
          text={`The Lazy Dog Company ${product.details[0]}, ${product.details[1]}`}
          className={styles.shareBot}
        />

          <AddToWishlist sanitySlug={product.handle} className={styles.likeBot}/>

        {/*  <ImageSlider slides={buildImagesArray(product)} aspectRatio={'63%'} objectFit={'contain'}/> */}
      </div>

      {/* The main info: name, description... */}
      <div className={styles.productName}>
        <h1>{product.title}</h1>
        <p>{product.shortDescription}</p>
      </div>

      {/* The price */}
      <div className={styles.price}>
        Price <span>£</span>
        {price.toFixed(2)}
      </div>

      {/* The Quantity Box */}
      <div className={styles.quantity}>
        <p>Quantity</p>
        <QuantityBox
          use="productPage"
          productID={variants.current.length > 0 ? idBuilder() : product.id}
          handleClick={handleClick}
          counter={count}
        />
      </div>

      {/* Variants Options */}
      <div className={styles.variantsContainer}>
        {/* Mapping the variants */}
        {product.options?.length > 0 &&
          product.options.map((option, variantIndex) => {
            return (
              <div className={styles.optionContainer} key={option.name}>
                <p>{option.name}</p>
                <div className={styles.options}>
                  {/* Mapping the options for this variant */}
                  {option.values?.length > 0 &&
                    option.values.map((value: any, optionIndex: number) => {
                      return (
                        <button
                          type="button"
                          ref={(el) => addToRefs(el, variantIndex, optionIndex)}
                          onClick={(event) => {
                            handleVariantClick(
                              event,
                              variantIndex,
                              optionIndex
                            );
                          }}
                          className={styles.optionButtom}
                          key={value.option}
                        >
                          {value.option}
                        </button>
                      );
                    })}
                </div>
              </div>
            );
          })}
      </div>

      {/* The personalized field input */}
      <div className={styles.dogsName}>
        <div ref={ref_personalised} onChange={typingHandle}>
          {/* <p>Personalised</p> */}
          <input
            type="text"
            placeholder="Enter your dog's name"
            maxLength={10}
            spellCheck={false}
            ref={ref_dogsName}
          ></input>
        </div>
      </div>

      {/* The buttoms */}
      <div className={styles.addToCart}>
        <div onClick={aux_addToCart}>
          <Buttom
            size="big"
            className={styles.buttom}
            bkgColor="bkg-orange"
            fontColor="font-black"
          >
            Add To Cart
          </Buttom>
        </div>

        <Link href={"/Cart/Cart"}>
          <div onClick={aux_addToCart}>
            <Buttom
              size="big"
              className={styles.buttom}
              bkgColor="bkg-red"
              fontColor="font-black"
            >
              Buy Now
            </Buttom>
          </div>
        </Link>
      </div>

      {/* Details */}
      <div className={`${styles.details}`}>
        <h3 style={display(product.details)}>🐶 Details</h3>
        <ul style={display(product.details)}>
          {product.details?.map((item, index) => {
            return <li key={`detail_${index}`}>▸ {item}</li>;
          })}
        </ul>
        <h3 style={display(product.dimensions)}>🐶 Dimensions and Weight</h3>
        <ul style={display(product.dimensions)}>
          {product.dimensions?.map((item, index) => {
            return <li key={`spec${index}`}>▸ {item}</li>;
          })}
          {/* The weight for the variant 0 */}
          <li>
            ▸ Weight: {weight.value} {weight.unit.toLowerCase()}
          </li>
        </ul>
        <h3 style={display(product.contentMaterials)}>
          🐶 Content and Materials
        </h3>
        <ul style={display(product.contentMaterials)}>
          {product.contentMaterials?.map((item, index) => {
            return <li key={`spec${index}`}>▸ {item}</li>;
          })}
        </ul>
        <h3 style={display(product.careInstructions)}>🐶 Care Instructions</h3>
        <ul style={display(product.careInstructions)}>
          {product.careInstructions?.map((item, index) => {
            return <li key={`spec${index}`}>▸ {item}</li>;
          })}
        </ul>
      </div>
    </div>
  );
};

export default Product;

/* 
==================================================================================
DATA FETCHING
==================================================================================
*/

/* Get the paths
---------------------- */
export async function getStaticPaths() {
  /* (1) Set the variable paths */
  let paths: pathProps = [];

  /* (2) Type the path variable output */
  type pathProps = {
    params: {
      product: string;
      collection: string;
    };
  }[];

  /* (3) Check if we are going to get the paths from Sanity or Shopify */
  const source = await mySanityClient.fetch(
    `*[_type == 'siteSettings'][0]{productsSource}`
  );

  /* (4) If from sanity */
  if (source.productsSource === "Sanity") {
    /* (4.A) Get the response of the query from our storefront() fetching function */
    /* const productsListResponse = await mySanityClient.fetch(`*[_type == 'products']{slug{current}}`); */
    const productsListResponse = await mySanityClient.fetch(
      `*[_type == 'products']{slug{current},categories[]->{slug{current}}}`
    );

    /* (4.B) map the paths combinations */
    productsListResponse.map((productItem: any) => {
      productItem.categories.map((collectionItem: any) => {
        paths.push({
          params: {
            //this variable has to match [product].tsx file for the dynamic routes to work
            product: productItem.slug.current,
            collection: collectionItem.slug.current,
          },
        });
      });
    });

    /* (4) If from shopify */
  } else {
    /* (4.A) Get the response of the query from our storefront() fetching function */
    const productsListResponse = await storefront(productsListQuery);

    /* (4.B) Get the response of the query from our storefront() fetching function */
    const collectionsListQueryResponse = await storefront(collectionsListQuery);

    /* (4.C) Prepare/format the response (typing and removing unnecessary objects and arrays and some other things) */
    const collectionsList: collectionsListProps[] =
      formatCollectionsListResponse(
        collectionsListQueryResponse.data.collections
      );

    /* (4.D) map the paths combinations */
    productsListResponse.data.products.edges.map((productItem: any) => {
      collectionsList.map((collectionItem) => {
        paths.push({
          params: {
            //this variable has to match [product].tsx file for the dynamic routes to work
            product: productItem.node.handle,
            collection: collectionItem.id,
          },
        });
      });
    });
  }

  /* (5) Return paths and fallback */
  return {
    paths,
    fallback: false,
  };
  // Nice tutorial on how to use geStaticPaths https://www.youtube.com/watch?v=NaYs1Gdg4AE
}

/* Get the props
---------------------- */
export const getStaticProps = async (context: any) => {
  const { params } = context;
  var product: any = null!;

  /* (1) Check if we are going to get the props from Sanity or Shopify */
  const source = await mySanityClient.fetch(
    `*[_type == 'siteSettings'][0]{productsSource}`
  );

  /* (2) If from Sanity - Get the data about this product */
  if (source.productsSource === "Sanity") {
    const sanityResponse = await mySanityClient.fetch(
      singleProductQuery(params.collection, params.product)
    );
    //Type and format the product query response
    product = formatSanitySingleProduct(sanityResponse);

    /* (2) If from Shopify - Get the data about this product*/
  } else {
    const shopifyResponse = await storefront(
      productPageQuery(params.collection, params.product)
    );
    //Type and format the product query response
    product = formatProductPageQuery(shopifyResponse).prod;
  }

  return {
    props: {
      product: product,
    },
  };
};
