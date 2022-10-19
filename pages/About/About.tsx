/* React */
import React from 'react'
import Image from 'next/image'

/* Style */
import styles from './About.module.scss'
import ResponsiveBox from '../../styles/ResponsiveBox/ResponsiveBox'

/* Types */
type aboutProps = {
  imageFit: 'contain'| 'cover';
}


const About = ({imageFit = 'cover'}: aboutProps) => {
 
 const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

    return (
    <div className={styles.container}>

        <h2 className='worksans-h2'>About Us</h2>
        

        <div className={styles.image_width}> {/* Image width */}
          <div className={` ${styles.image_container}`}> {/* Image container */}
            <Image src='/images/aboutus.jpeg' layout='fill' objectFit={imageFit} /> {/* React Image -> hange config to allow external src */}
          </div>
        </div>

        <p className='worksans-paragraph'>{text}</p>
    </div>
  )
}

export default About