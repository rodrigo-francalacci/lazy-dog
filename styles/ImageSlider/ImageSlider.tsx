/* React */
import React from 'react'
import { useState, useRef } from 'react';
import Image from 'next/image';

/* Style */
import styles from './ImageSlider.module.scss'

/* Types */
type ImageSliderProps = {
    slides: {
        url: string;
        alt: string;
    }[],
    aspectRatio: `${number}%`,
    objectFit: 'cover' | 'contain'
}

const ImageSlider = ({slides, aspectRatio, objectFit}: ImageSliderProps) => {
    
    //States
    const [currentIndex, setCurrentIndex] = useState(0);
    const ratio = {
        paddingTop: aspectRatio,
    }
    const ref_slides = useRef<HTMLDivElement[]>(new Array());

    //Aux Functions
    function gotToPrevious(){
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        selectSlide(newIndex);
    }

    function goToNext(){
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        selectSlide(newIndex);
    }

    function selectSlide(index: number){
        setCurrentIndex(index);
        ref_slides.current.forEach((element, n) => {
            if(index == n){
                element.style.opacity = "1";
                element.style.border = "solid 1px grey"
            } else {
                element.style.opacity = "0.5";
                element.style.border = "none";
            }
        });
    }

    function addToRefs(el: any){
        if(el && !ref_slides.current.includes(el)){
            ref_slides.current.push(el);
        }
    }

  return (
      
    <div className={styles.container}>
        <div className={`${styles.image_container} ${styles.prevent_select}`} style={ratio}>
            
            <div className={styles.Left} onClick={gotToPrevious}>
                <div className={styles.prevent_select}>❰</div>
            </div>
            <div className={styles.Right} onClick={goToNext}>
                <div className={styles.prevent_select}>❱</div>
            </div>
            <Image src={slides[currentIndex].url} alt={slides[currentIndex].alt} layout='fill' objectFit={objectFit}/>
        </div>

        <div className={`${styles.small_images_container} ${styles.prevent_select}`}>
            {slides.map( (item, index) => {
                
                return (
                <div 
                    key={index} 
                    className={styles.small_image}
                    ref={addToRefs} //apply the ref to the div
                    onMouseEnter={() => selectSlide(index)}
                    >
                    <Image src={item.url} alt={item.alt} layout='fill' objectFit='cover'/>
                </div>
            )})}
        </div>

    </div>
  )
}

export default ImageSlider