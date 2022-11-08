/* React */
import React from 'react'
import Link from 'next/link'

/* Styles */
import styles from "./Footer.module.scss"

/* Components */
import Logo from '../Logo/Logo'

const Footer = ({text}:{text: string}) => {

  return ( 
    <div className={`worksans-footer ${styles.container}`}>

        <div className={styles.col1}>
            
            <div className={styles.logo}>
                <Logo/>
            </div>

            <p>
                {text}
            </p>
            <p>
              © Copyright 2021-2022 Lazy Dog Company All rights reserved
            </p>
            
        </div>

         <div className={`${styles.col2}`}>
           <ul>
                  <li>
                  <Link href="/About/About"><a>About Us</a></Link>
                  </li>
                  <li className={styles.otherItems_item}>
                  <Link href="/Blog/Blog"><a>Blog</a></Link>
                  </li>
                  <li className={styles.otherItems_item}>
                  <Link href="/"><a>Instagram</a></Link>
                  </li>
                  <li className={styles.otherItems_item}>
                  <Link href="/Contact/Contact"><a>Contact</a></Link>
                  </li>
           </ul>
         </div>

    </div>
  )
}

export default Footer