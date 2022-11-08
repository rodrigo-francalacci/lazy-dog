/* React */
import React, { Component } from 'react'

/* Styles */
import styles from './DogsFriends.module.scss'

/* Components */
import DogFriendCard from '../../components/DogFriendCard/DogFriendCard'
import SEO from '../../components/SEO/SEO'

/* Types */
import { dogsFriendsProps, format_dogsFriends } from '../../utils/sanity_queries'

const DogsFriends = ({sanityDogsFriends}: any) => {

 const dogs: dogsFriendsProps[] = format_dogsFriends(sanityDogsFriends)

  return (
    <div className={styles.container}>

         {/* Head and metatags generator */}
         <SEO title='Lazy Dog Friends' description='The Lazy Dog Company has many dog friends. When we make our blankets and duvets we always think that they are the ones who have to be happy!' />

        <h2 className={`worksans-h2`}>Lazy Dog Friends</h2>
        <ul className={`${styles.cardsContainer}`}>
            {dogs?.length > 0 && dogs.map((dog)=>{
                return(
                    <li className='dogfriend-card-width' key={dog.id}>
                        <DogFriendCard 
                            name={dog.name}
                            imageURL={dog.imageURL}
                            bio={dog.bio}
                            instagram={dog.instagram}
                        />
                    </li>
                )
            })}
        </ul>
    </div>
  )
}

export default DogsFriends

/* 
==================================================================================
DATA FETCHING
==================================================================================
*/

/* API */
import { mySanityClient } from '../../lib/sanityClient';
import { dogsFriendsQuery } from '../../utils/sanity_queries'

export async function getStaticProps() {

    //FROM SANITY
    //Get the list of dogs friends from sanity
    const sanityDogsFriends = await mySanityClient.fetch(dogsFriendsQuery);
    
  return {
   props: {
    sanityDogsFriends: sanityDogsFriends,
  }

 }
};