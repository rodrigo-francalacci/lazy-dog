/* React */
import React from 'react'
import { useRef, useEffect, useState } from 'react'
import Link from 'next/link';

/* Redux */
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { addToCart } from '../../../slices/cartSlice';

/* Style */
import styles from './Product.module.scss'

/* Components */
import ImageSlider from '../../../styles/ImageSlider/ImageSlider'
import QuantityBox from '../../../components/QuantityBox/QuantityBox'
import Buttom from '../../../components/Buttom/Buttom'
import SEO from '../../../components/SEO/SEO';
import toast, { Toaster } from 'react-hot-toast';
import ShareBot from '../../../components/ShareBot/ShareBot';
import { DragSlider } from '../../../styles/DragSlider/DragSlider';

/* API */
import { storefront } from '../../../utils/shopify_fetch_function'
import { mySanityClient } from '../../../lib/sanityClient';

/* Queries */
import {collectionsListQuery, formatCollectionsListResponse} from '../../../utils/shopify_colllection_query' //to fill the navbar
import {productsListQuery} from '../../../utils/shopify_colllection_query' //list of products
import { productPageQuery, formatProductPageQuery } from '../../../utils/shopify_product_query'

/* Types */
import {collectionsListProps} from '../../../utils/shopify_colllection_query'
import {singleProductProps} from '../../../utils/shopify_product_query'; //Type for each indivdual product
type PersonalizedProps = ['yes' | 'no', number, string | undefined, string]


/* 
===================================
PAGE COMPONENT
==================================*/
const Product = ({shopifyResponse}: any) => {

        //Type and format the product query response
        const product = formatProductPageQuery(shopifyResponse).prod

        //We can't declare the dispatch variable inside a function or hook
        //Otherwise we can get "Error: Invalid hook call. Hooks can only be called inside of the body of a function component.""
        const dispatch = useAppDispatch()
 
        //States and Refs
        const ref_personalised = useRef<HTMLDivElement>(null!);
        const ref_dogsName = useRef<HTMLInputElement>(null!);
        const [personalizedStatus, setPersonalizedStatus] = useState<PersonalizedProps>(['no', Number(product.priceRange.minVariantPrice.amount), undefined, product.shopifyID]);
        const [count, setCount] = useState(1); // quantity selector

/* USE EFFECTS
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

        useEffect(()=>{

            if (product.options[0].name == "Personalized" ){
                ref_personalised.current.style.display = "block";
            } else {
                ref_personalised.current.style.display = "none";
            }

           /* We need this dependency to make sure 
           this field is updated for every product */
        },[product.shopifyHandle, product.options])


/* AUX FUNCTIONS */
//++++++++++++++++++++++++++++++++++++++++++++++++++++

        function buildImagesArray(product:singleProductProps){
        
            let output:{ url: string; alt: string}[] = product.imagesURL.map(item=>{
                return {url:`${item}`, alt: `${product.title} Lazy Dog Company Duvet`}
            })

            return output
        }

        function aux_addToCart(){

            //creates a different ID for the personalized option to be used inside the cart to track the quantities
            if(personalizedStatus[2] !== undefined){
                personalizedStatus[3] = `${product.shopifyID}${personalizedStatus[2]}`}
            else{        
                personalizedStatus[3]=product.shopifyID
            };
            
            //Add the product to the cart
            dispatch(addToCart({
            id: personalizedStatus[3], 
            title: product.title, 
            shortDetails: product.shortDescription, 
            price: personalizedStatus[1], 
            personalized: personalizedStatus[0], 
            dogName: personalizedStatus[2],
            imgURL: product.imagesURL.length > 1 ? product.imagesURL[product.imagesURL.length-2] : product.imagesURL[0],
            quantity: count
                }))
            
            //Set the counter in the page (not the cart) = 1
            setCount(1)

            toast.success(`${count} x ${product.title} was added to cart`);
        }

        function typingHandle(){

                if(ref_dogsName.current.value.trim() === ""){
                    setPersonalizedStatus(['no', Number(product.priceRange.minVariantPrice.amount), undefined, personalizedStatus[3]]);
                } else {
                    setPersonalizedStatus(['yes',Number(product.priceRange.maxVariantPrice.amount), ref_dogsName.current.value.trim(), personalizedStatus[3]]);
                }
            
        }

        /* Getting "count" value from the child (QuantityBox component) */
        function handleClick(action: 'add' | 'subtract' ){
            if(action === 'add'){
                setCount(count+1);
            } else {
            if(count === 1){setCount(1)} else {setCount(count-1)}
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
        <Toaster toastOptions={{ className: `worksans-toast ${styles.toast}`,  duration: 5000,  icon: '🐕'}}/>

        {/* The slider with the pictures */}
        <div className={styles.imageSlider}>
            {/* The buildImagesArray() function will put the image url and the img alt
            in the same object fo the image slider component to use */}
            <DragSlider slides={buildImagesArray(product)} aspectRatio='66%' objectFit='contain' />
            
            <ShareBot 
                title={`${product.title} - Lazy Dog Company`}
                text={`The Lazy Dog Company ${product.details[0]}, ${product.details[1]}`}
                className={styles.shareBot}
            />

           {/*  <ImageSlider slides={buildImagesArray(product)} aspectRatio={'63%'} objectFit={'contain'}/> */}
        </div>

        {/* The main info: name, description... */}
        <div className={styles.productName}>
            <h1>{product.title}</h1>
            <p>{product.shortDescription}</p>
        </div>

        {/* The price */}
        <div className={styles.price}>
            Price <span>£</span>{personalizedStatus[1].toFixed(2)}
        </div>

        {/* The Quantity Box */}
        <div className={styles.quantity}>
            <p>Quantity</p>
            <QuantityBox 
                use='productPage' 
                productID={personalizedStatus[3]} 
                handleClick={handleClick}
                counter={count}/>
        </div>

        {/* The personalized field input */}
        <div className={styles.dogsName}>
            <div ref={ref_personalised} onChange={typingHandle}>
                <p>Personalised</p>
                <input 
                    type="text" 
                    placeholder="Enter your dog's name" 
                    maxLength={10} 
                    spellCheck={false}
                    ref={ref_dogsName}> 
                </input>
            </div>
        </div>

        {/* The buttoms */}
        <div className={styles.addToCart}>
            <div onClick={aux_addToCart}>
                <Buttom
                    size='big' className={styles.buttom}
                    bkgColor='bkg-orange' fontColor='font-black'>
                    Add To Cart
                </Buttom>
            </div>
            
            <Link href={'/Cart/Cart'}>
            <div onClick={aux_addToCart}>
                    <Buttom
                        size='big' className={styles.buttom}
                        bkgColor='bkg-red' fontColor='font-black'>
                        Buy Now
                    </Buttom>
            </div>
            </Link>
        </div>

        {/* Details */}
        <div className={`${styles.details}`}>

            <h3>🐶 Details</h3>
            <ul>{
                product.details?.map((item, index)=>{
                    return(
                        <li key={`detail_${index}`}>▸ {item}</li>
                    )
                })
                }
            </ul>
            <h3>🐶 Dimensions and Weight</h3>
            <ul>{
                product.dimensions?.map((item, index)=>{
                    return(
                        <li key={`spec${index}`}>▸ {item}</li>
                    )
                })
                }
                {/* The weight for the variant 0 */}
                <li>▸ Weight: {product.weight[0].value} {product.weight[0].unit.toLowerCase()}</li>
            </ul>
            <h3>🐶 Content and Materials</h3>
            <ul>{
                product.contentMaterials?.map((item, index)=>{
                    return(
                        <li key={`spec${index}`}>▸ {item}</li>
                    )
                })
                }
            </ul>
            <h3>🐶 Care Instructions</h3>
            <ul>{
                product.careInstructions?.map((item, index)=>{
                    return(
                        <li key={`spec${index}`}>▸ {item}</li>
                    )
                })
                }
            </ul>
        </div>

        </div>

        )
        }

export default Product


/* 
==================================================================================
DATA FETCHING
==================================================================================
*/

/* Get the paths
---------------------- */
export async function getStaticPaths() {
    /* (1) Get the response of the query from our storefront() fetching function */
    const productsListResponse = await storefront(productsListQuery);

    /* (2) Get the response of the query from our storefront() fetching function */
     const collectionsListQueryResponse = await storefront(collectionsListQuery);

    /* (3) Prepare/format the response (typing and removing unnecessary objects and arrays and some other things) */
     const collectionsList: collectionsListProps[] = formatCollectionsListResponse(collectionsListQueryResponse.data.collections);

    /* (4) Type the path variable output */
        type pathProps = {
            params: {
                product: string;
                collection: string
            };
        }[]
        let paths: pathProps = []
   
    /* (5) map the paths combinations */
       productsListResponse.data.products.edges.map(((productItem: any) =>{
           collectionsList.map((collectionItem=>{
               paths.push({
                   params: {
                       //this variable has to match [product].tsx file for the dynamic routes to work
                       product: productItem.node.handle,
                       collection: collectionItem.id
                   }
               }) 
           }))     
       }))

    /* (6) Return paths and fallback */
    return{
        paths,
        fallback: false,
    }
    // Nice tutorial on how to use geStaticPaths https://www.youtube.com/watch?v=NaYs1Gdg4AE   
}



/* Get the props
---------------------- */
export const getStaticProps = async (context: any) => {
const {params} = context;

       //FROM SHOPIFY
       //Get the data about this product
       const shopifyResponse =  await storefront(productPageQuery(params.collection, params.product ));
       
        return {
            props: {
                shopifyResponse: shopifyResponse,
            }
        };
}



