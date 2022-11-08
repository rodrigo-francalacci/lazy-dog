/* React */
import React from 'react'
import { useState, useRef, useEffect } from 'react';
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

    //Use Effect
    //the first image should start as selected
    useEffect(()=>{
        ref_slides.current[0].style.opacity = "1";
        ref_slides.current[0].style.border =  "solid 1px grey";
    },[])

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
                element.style.border = "solid 1px grey";
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
            <Image 
                src={slides[currentIndex].url} 
                alt={slides[currentIndex].alt} 
                layout='fill' 
                objectFit={objectFit}

                /* This prop is particularly useful for images visible above the fold - i.e, 
                the portion of a web page that is visible without scrolling. 
                Images visible above the fold, such as images on a landing page, 
                should use the priority prop for the performance boost.
                https://refine.dev/blog/using-next-image/#priority */
                priority

                /* On screens that are 690px wide or less, the size is 84vw */
                /* On screens that are 1000px wide or less, the size is 68vw */
                /* On screens that are 1400px wide or less, the size is 39vw */
                /* On screens that are 1920px wide or less, the size is 37vw */
                /* The smaller screen overrides the bigger, 
                but if a bigger sized is already loaded, nextJS will keep the better image
                */
                /* Check documentation: https://nextjs.org/docs/api-reference/next/image#sizes */
                sizes="
                (max-width: 690px) 84vw,
                (max-width: 1000px) 68vw,
                (max-width: 1400px) 39vw,
                (max-width: 1920px) 37vw,
                37vw"                      
                quality={50}
                />
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
                    <Image 
                        src={item.url} 
                        alt={item.alt} 
                        layout='fill' 
                        objectFit='cover'

                        /* This prop is particularly useful for images visible above the fold - i.e, 
                        the portion of a web page that is visible without scrolling. 
                        Images visible above the fold, such as images on a landing page, 
                        should use the priority prop for the performance boost.
                        https://refine.dev/blog/using-next-image/#priority */
                        priority

                        /* On screens that are 690px wide or less, the size is 17vw */
                        /* On screens that are 1000px wide or less, the size is 14vw */
                        /* On screens that are 1400px wide or less, the size is 8vw */
                        /* On screens that are 1920px wide or less, the size is 7vw */
                        /* The smaller screen overrides the bigger, 
                        but if a bigger sized is already loaded, nextJS will keep the better image
                        */
                        /* Check documentation: https://nextjs.org/docs/api-reference/next/image#sizes */
                        sizes="
                        (max-width: 690px) 17vw,
                        (max-width: 1000px) 14vw,
                        (max-width: 1400px) 8vw,
                        (max-width: 1920px) 7vw,
                        7vw"                      
                        quality={20}
                    />
                </div>
            )})}
        </div>

    </div>
  )
}

export default ImageSlider