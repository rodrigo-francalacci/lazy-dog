/* React */
import React from 'react'
import Link from 'next/link'

/* Styles */
import styles from "./Footer.module.scss"

/* Components */
import Logo from '../Logo/Logo'


const Footer = () => {

/* Fake Data */
const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."

  return (
    <div className={styles.container}>

        <div className={styles.col1}>
            
            <div className={styles.logo}>
                <Logo/>
            </div>

            <p className={`worksans-footer-text ${styles.text}`}>
                {text}
            </p>
            
        </div>

         <ul className={`worksans-footer-links ${styles.col2}`}>
                <li>
                <Link href="/About/About"><a>About Us</a></Link>
                </li>
                <li className={styles.otherItems_item}>
                <Link href="/"><a>Products</a></Link>
                </li>
                <li className={styles.otherItems_item}>
                <Link href="/"><a>Q and A's</a></Link>
                </li>
                <li className={styles.otherItems_item}>
                <Link href="/"><a>Instagram</a></Link>
                </li>
                <li className={styles.otherItems_item}>
                <Link href="/"><a>Contact</a></Link>
                </li>
               
         </ul>

    </div>
  )
}

export default Footer