/* React */
import React from 'react'
import { useRef, useEffect, useState } from 'react'

/* Redux */
import { useDispatch } from 'react-redux';
import { addToCart, removeItem } from '../../../slices/cartSlice';

/* Style */
import styles from './Product.module.scss'

/* Components */
import ImageSlider from '../../../styles/ImageSlider/ImageSlider'
import QuantityBox from '../../../components/QuantityBox/QuantityBox'
import Buttom from '../../../components/Buttom/Buttom'

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

type PersonalizedProps = ['yes' | 'no', number, string | undefined, string]



const Product = () => {

/* Fake data */
const product: productProps = {
    name: 'Name of The Product',
    id: 'THfn47',
    description: 'Description of product, details of materials and other things.',
    price: 24.6,
    personalized: {
        status: true,
        price: 26
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


/* Refs and states */
const ref_personalised = useRef<HTMLDivElement>(null!);
const ref_dogsName = useRef<HTMLInputElement>(null!);
const [personalizedStatus, setPersonalizedStatus] = useState<PersonalizedProps>(['no', product.price, undefined, product.id]);
const [count, setCount] = useState(1); // quantity selector

/* On load check if is a personalizable item */
useEffect(()=>{
if (product.personalized.status === true ){
    ref_personalised.current.style.display = "block";
} else {
    ref_personalised.current.style.display = "none";
}
},[])


/* Aux Functions */
const dispatch = useDispatch()
function aux_addToCart(){

    if(personalizedStatus[2] !== undefined){
        personalizedStatus[3] = `${product.id}${personalizedStatus[2]}`}
    else{        
        personalizedStatus[3]=product.id
    };

    dispatch(addToCart({
       id: personalizedStatus[3], 
       title: product.name, 
       shortDetails: product.description, 
       price: personalizedStatus[1], 
       personalized: personalizedStatus[0], 
       dogName: personalizedStatus[2],
       imgURL: product.images[0].url,
       quantity: count
        }))
    
    setCount(1)
}


function typingHandle(){
    if(ref_dogsName.current.value.trim() === ""){
        setPersonalizedStatus(['no', product.price, undefined, personalizedStatus[3]]);
    } else {
        setPersonalizedStatus(['yes', product.personalized.price, ref_dogsName.current.value.trim(), personalizedStatus[3]]);
    }
}

/* Getting count from the  child (QuantityBox component) */
function handleClick(action: 'add' | 'subtract' ){
    if(action === 'add'){
        setCount(count+1);
    } else {
       if(count === 1){setCount(1)} else {setCount(count-1)}
    }
}



/* Page return =======*/
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

{/* The personalized field */}
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