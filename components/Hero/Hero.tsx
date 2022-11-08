/* React/NextJS */
import React from 'react'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'

/* Styles */
import styles from './Hero.module.scss'

const Hero = ({imgUrl, title, description}:{imgUrl: string, title: string, description: any}) => {
  return (
    <div className={`worksans-hero ${styles.container}`}>
        
        <div className={styles.imageContainer}>
            <Image 
                src={imgUrl} 
                layout='fill' 
                objectFit='cover'/>
        </div>

        
        <div className={styles.content}>
            <PortableText value={description}/>
        </div>

    </div>
  )
}

export default Hero