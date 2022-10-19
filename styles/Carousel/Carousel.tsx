/* React */
import React from 'react'
import { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

/* Styles */
import styles from './Carousel.module.scss'

/* Plugins */

/* Types */
type CarouselrProps = {
    children: React.ReactNode;
}


const Carousel = ({ children }: CarouselrProps) => {

//States & Refs
const ref_carousel = useRef<HTMLDivElement>(null!);
const [width, setWidth]= useState<number>(0);


//Use Effect
useEffect(() => {
    handleSize();
}, []);

//Aux Functions


function handleSize(){
    setWidth(ref_carousel.current.scrollWidth - ref_carousel.current.offsetWidth);
}


  return (
    <div className={`${styles.container}`}>
        <motion.div ref={ref_carousel} className={styles.carousel}>
            <motion.div 
                drag="x"
                dragConstraints={{right:0, left: -width}} 
                className={styles.inner_carousel}>

                    {children}

            </motion.div>
        </motion.div>
    </div>
  )
}

export default Carousel


