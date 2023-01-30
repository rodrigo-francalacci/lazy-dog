/* React */
import React, { useState } from 'react'
import { useRef, useEffect } from 'react';

/* Style */
import styles from './Buttom.module.scss'


/* Types */
type ButtomProps = {
    children: React.ReactNode,
    bkgColor?: "bkg-green" | "bkg-gold" | "bkg-blue-velvet" | "bkg-orange" | "bkg-red" | "bkg-white" | "bkg-black";
    fontColor?: "font-black" | "font-white";
    size?: "small" | "big";
    className?: string;

}

/* Component */
const Buttom = ({bkgColor="bkg-orange", fontColor="font-black", size='small', className='', children }: ButtomProps) => {
    
    //states and refs
    const ref_ = useRef<HTMLDivElement>(null!);
    const [sizeClass, setSizeClass] = useState<string>(null!)
    const [fontSize, setFontSize] = useState<string>(null!)

    //setup current buttom
    useEffect(()=>{

        if(size == "small"){
            setSizeClass("small-buttom-dimensions");
            setFontSize("worksans-small-buttom")

        } else {
            setSizeClass("big-buttom-dimensions");
            setFontSize("worksans-big-buttom")
        }

        if(fontColor=="font-black"){
            ref_.current.style.border = "solid 0.0625rem black"
        }

    },[fontColor,size])



  return (
    <div className={`${sizeClass} ${bkgColor} ${fontColor} ${fontSize} ${styles.container} ${className}`} 
         ref={ref_}>
        {children}
    </div>
  )
}

export default Buttom