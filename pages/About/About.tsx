/* React */
import React from 'react'
import Image from 'next/image'

/* Style */
import styles from './About.module.scss'

/* Components */
import SEO from '../../components/SEO/SEO'

/* Sanity */
import { PortableText } from '@portabletext/react'

/* Types */
import { format_aboutUs, aboutUsProps } from '../../utils/sanity_queries'


const About = ({sanityAboutUs}: any) => {

const aboutUs: aboutUsProps = format_aboutUs(sanityAboutUs)

    return (
    <div className={styles.container}>
       {/* Head and metatags generator */}
       <SEO title='About Us' description='Handmade Dog Duvets. Duvet and Pillow Sets with Changeable, Washable Covers. Dog Beds. Just like yours… but smaller...' />

        <h2 className='worksans-h2'>About Us</h2>
        
        <div className={styles.image_width}> {/* Image width */}
          <div className={` ${styles.image_container}`}> {/* Image container */}
            <Image src={aboutUs.imageURL} layout='fill' objectFit='cover' alt='Lazy Dod Company'/> {/* React Image -> hange config to allow external src */}
          </div>
        </div>

      <div className='worksans-paragraph'><PortableText value={aboutUs.text}/></div>

      <h2 className='worksans-h2'>How are your duvets made?</h2>

      <iframe src="https://player.vimeo.com/video/12793324" width="640" height="360"  allow="autoplay; fullscreen" ></iframe>

    </div>
  )
}

export default About

/* 
==================================================================================
DATA FETCHING
==================================================================================
*/
import { aboutUsQuery } from '../../utils/sanity_queries'
import { mySanityClient } from '../../lib/sanityClient'
export async function getStaticProps() {      

  const sanityAboutUs = await mySanityClient.fetch(aboutUsQuery);
  return {
   props: {
    sanityAboutUs: sanityAboutUs
  }
 
 }
 };