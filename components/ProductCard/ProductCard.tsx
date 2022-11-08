/* React */
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

/* Redux */
import { useAppDispatch, useAppSelector } from '../../hooks';
import {setLoading} from '../../slices/navbarSlice';

/* Style */
import styles from './ProductCard.module.scss'

/* Types */
type ProductCardProps = {
    name: string;
    price: number | null;
    imgUrl: string;
    collectionID: string;
    productHandle: string;
}

const ProductCard = ({name, price, imgUrl, collectionID, productHandle}: ProductCardProps) => {

  const dispatch = useAppDispatch()

  return (
    <div className={`product-card-width worksans-product-card ${styles.container}`}>
      
        {/* Image */}
        <Link  href={`/Collection/${collectionID}/${productHandle}`} >
        <a className={styles.image_zoom_wrapper}>
          <div className={`${styles.image_container}`} 
                onClick={()=>{dispatch(setLoading())}} //turn on the parent page loading component
                >
              <Image 
                src={imgUrl} 
                layout='fill' 
                objectFit='cover' 
                alt={`${name} - Lazy Dog Company`}
                
                /* The smaller screen overrides the bigger, 
                but if a bigger sized is already loaded, nextJS will keep the better image
                */
                /* Check documentation: https://nextjs.org/docs/api-reference/next/image#sizes */
                sizes="
                (max-width: 480px) 50vw,
                (max-width: 590px) 33vw,
                (max-width: 700px) 25vw,
                (max-width: 1000px) 20vw,
                (max-width: 1400px) 17vw,
                (max-width: 1920px) 15vw,
                12vw"
                quality={40}/>
          </div>
        </a>
        </Link>

        {/* Title */}
        <h3>{name}</h3>
        
        {/* price */}
        {/* If price is null we retunr "--" */}
        <p>Price <span>£</span>{`${price ? price.toFixed(2) : "--"}`} </p>


    </div>
  )
}

export default ProductCard