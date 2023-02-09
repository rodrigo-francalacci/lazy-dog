/* React */
import React from 'react'
import { useRef, useEffect } from 'react';

/* Style */
import styles from './Box.module.scss'


/* Types */
type BoxProps = {
    children?: React.ReactNode,
    bkgColor?: "bkg-green" | "bkg-gold" | "bkg-blue-velvet" | "bkg-orange" | "bkg-red" | "bkg-white";
    fontColor?: "font-black" | "font-white";
    size?: "cart-summary-dimensions" | "cart-item-picture-box" | "quantity-box-dimensions" | "";
    className?: string;
}

/* Component */
const Box = ({bkgColor="bkg-white", fontColor="font-black", size='', className='', children }: BoxProps) => {
    
    //states and refs
    const ref_ = useRef<HTMLDivElement>(null!);

    //setup current buttom
    useEffect(()=>{

        if(fontColor=="font-black"){
            ref_.current.style.border = "solid 0.0625rem black"
        }

    },[fontColor])


  return (
    <div className={`${size} ${bkgColor} ${fontColor} ${styles.container} ${className}`} ref={ref_}>
        {children}
    </div>
  )
}

export default Box