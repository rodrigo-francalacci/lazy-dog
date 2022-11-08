/* React/Next */
import React from 'react'
import Image from 'next/image'

/* Styles */
import styles from './DogFriendCard.module.scss'

/* Types */
import { dogsFriendsProps } from '../../utils/sanity_queries'

const DogFriendCard = ({id, name, bio, imageURL, instagram}: dogsFriendsProps) => {
  return (
    <div className={`worksans-dogfriend-card ${styles.container}`}>

        <h2>{name}</h2>

        {/* Image and Instagram Icon */}
        <div className={styles.imageWrapper}>
            {/* Image */}
            <a href={instagram!} target="_blank" rel="noopener noreferrer">
                <div className={styles.imageContainer}>
                    <Image
                        src={imageURL} alt={name}
                        layout='fill' objectFit='cover'
                
                        /* The smaller screen overrides the bigger,
                        but if a bigger sized is already loaded, nextJS will keep the better image
                        */
                        /* Check documentation: https://nextjs.org/docs/api-reference/next/image#sizes */
                        sizes="
                        (max-width: 480px) 90vw,
                        (max-width: 590px) 50vw,
                        (max-width: 1000px) 33vw,
                        (max-width: 1400px) 25vw,
                        (max-width: 1920px) 15vw,
                        12vw"
                        quality={40}/>
                </div>
            </a>

            {/* Instagram icon */}
            <a href={instagram!} target="_blank" rel="noopener noreferrer">
                <div className={styles.iconContainer}>
                    <Image src='/images/instagram_icon.png' alt={`${name} Instagram`} layout='fill' objectFit='contain'/>
                </div>
            </a>
        </div>

        <div className={styles.descriptionContainer}>
            <p>{bio}</p> 
        </div>
        
    </div>
  )
}

export default DogFriendCard