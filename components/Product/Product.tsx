/* React */
import React from 'react'
import Image from 'next/image'

/* Style */
import styles from './Product.module.scss'

/* Types */
type ProductProps = {
    name: string;
    price: number;
    imgUrl: string;
}

const Product = ({name, price, imgUrl}: ProductProps) => {

  return (
    <div className={`product-width worksans-product-component ${styles.container}`}>

        {/* Image */}
        <div className={`${styles.image_container}`}>
            <Image src={imgUrl} layout='fill' objectFit='cover'/>
        </div>

        {/* Title */}
        <h3>{name}</h3>
        
        {/* price */}
        <p>{`Price ${price.toFixed(2)}`} </p>


    </div>
  )
}

export default Product