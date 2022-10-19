/* React */
import React from 'react'
import { useRef, useEffect, useState } from 'react'

/* Style */
import styles from './Product.module.scss'

/* Components */
import ImageSlider from '../../styles/ImageSlider/ImageSlider'
import QuantityBox from '../../components/QuantityBox/QuantityBox'
import Buttom from '../../components/Buttom/Buttom'

/* Types */
type productProps = {
    name: string;
    id: string;
    description: string;
    price: number;
    personalized: {
        status: boolean;
        price: number;
    };
    images: {
        url: string;
        alt: string;
    }[];
    imageFit: 'cover' | 'contain';
    details: string[];
    spec: string[];
}



const Product = () => {

/* Fake data */
const product: productProps = {
    name: 'Name of The Product',
    id: 'THfn47',
    description: 'Description of product, details of materials and other things.',
    price: 24.6,
    personalized: {
        status: true,
        price: 2.5
    },
    images: [
        {url:'/images/ada.jpeg',  alt: 'Ada'},
        {url:'/images/arthur.jpeg', alt: 'Arthur'},
        {url:'/images/bailey.jpeg', alt: 'Bailey'},
        {url:'/images/bear.jpeg', alt: 'Bear'},
    ],
    imageFit: 'contain',
    details: [
        "The Personalised Bailey set has your Dogs name on the Pillowcase.",
        "In Oatmeal with Orange embroidery.",
        "Duvet size is approx 32 x 32 inches.",
        "Pillowcases are approx 18 x 8 inches.",
        "Wash all items on gentle wash.",
        "Do Not bleach or tumble dry.",
        "also includes the Lazy Dog Duvet and 2 Pillows."
    ],
    spec: [
        'Product Code: EMD012', 
        'Weight: 0.3kg'
    ],
    
}



//Refs
const ref_personalised = useRef<HTMLDivElement>(null!);
const ref_dogsName = useRef<HTMLInputElement>(null!);
const [price, setPrice] = useState<Number>(0);

useEffect(()=>{
    
//set the price
setPrice(product.price);

//check if is a personalizable item
if (product.personalized.status == true){
    ref_personalised.current.style.display = "block";
} else {
    ref_personalised.current.style.display = "none";
}

//check client typing
ref_dogsName.current.addEventListener('input', ()=>{
    
    if(ref_dogsName.current.value.trim() == ""){
        setPrice(product.price);
    } else {
        setPrice(product.price + product.personalized.price);
    }

})

},[])

  return (


<div className={`worksans-product-page ${styles.container}`}>

{/* The slider with the pictures */}
  <div className={styles.imageSlider}>
    <ImageSlider slides={product.images} aspectRatio={'63%'} objectFit={product.imageFit}/>
  </div>

{/* The main info: name, price, quantity, buttoms... */}
  <div className={styles.productName}>
     <h1>{product.name}</h1>
     <p>{product.description}</p>
  </div>

{/* The price */}
  <div className={styles.price}>
      Price <span>£</span>{price.toFixed(2)}
  </div>

{/* The Quantity Box */}
  <div className={styles.quantity}>
    <p>Quantity</p>
    <QuantityBox productID={product.id}/>
  </div>

{/* The personalized field */}
  <div className={styles.dogsName}>
    <div ref={ref_personalised}>
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
      <div>
          <Buttom
            size='big' className={styles.buttom}
            bkgColor='bkg-orange' fontColor='font-black'>
              Add To Cart
          </Buttom>
      </div>
      <div>
          <Buttom
            size='big' className={styles.buttom}
            bkgColor='bkg-red' fontColor='font-black'>
              Buy Now
          </Buttom>
      </div>
  </div>

  {/* Details */}
  <div className={`${styles.details}`}>
      <h3>Details</h3>
      <ul>{
          product.details?.map((item, index)=>{
              return(
                  <li key={`detail_${index}`}>🦴 {item}</li>
              )
          })
          }
      </ul>
  </div>

  {/* Specifications */}
  <div className={`${styles.specifications}`}>
      <h3>Specifications</h3>
      <ul>{
          product.spec?.map((item, index)=>{
              return(
                  <li key={`spec${index}`}>{item}</li>
              )
          })
          }
      </ul>
  </div>
</div>

  )
}

export default Product