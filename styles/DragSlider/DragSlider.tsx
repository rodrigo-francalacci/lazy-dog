/* React/NextJS */
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

/* Plugins */
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";

/* Styles */
import styles from './DragSlider.module.scss'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';

/* Types */
type DragSliderProps = {
    slides: {
        url: string;
        alt: string;
    }[],
    aspectRatio: `${number}%`,
    objectFit: 'cover' | 'contain',
}

/* Global variables and functions
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    };
  }
};

/**
 * Experimenting with distilling swipe offset and velocity into a single variable, so the
 * less distance a user has swiped, the more velocity they need to register as a swipe.
 * Should accomodate longer swipes and short flicks without having binary checks on
 * just distance thresholds and velocity > 0.
 */
const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};


/* COMPONENT START
This component was done on top of framer motion, 
check https://www.framer.com/docs/animate-presence/ 
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
export const DragSlider = ({slides, aspectRatio, objectFit}: DragSliderProps) => {

  //States, Refs and Props 
  const [[page, direction], setPage] = useState([0, 0]);
  const ratio = {
      paddingTop: aspectRatio,
  }
  const ref_slides = useRef<HTMLDivElement[]>(new Array());


  // Supose we only have 3 images, but we paginate them absolutely (ie 1, 2, 3, 4, 5...) and
  // then wrap that within 0-2 to find our image ID in the array below. By passing an
  // absolute page index as the `motion` component's `key` prop, `AnimatePresence` will
  // detect it as an entirely new image. So you can infinitely paginate as few as 1 images.
  const imageIndex = wrap(0, slides.length, page);

  //Select the active miniature image by changing the opacity and adding a border
  useEffect(()=>{
    ref_slides.current.forEach((element, n) => {
        if(imageIndex == n){
            element.style.opacity = "1";
            element.style.border = "solid 1px grey";
        } else {
            element.style.opacity = "0.5";
            element.style.border = "none";
        }
    });
  },[imageIndex])


  /* Aux Functions
  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    
    //This functions is used by the navigation arrows
    const paginate = (newDirection: number) => {
        setPage([page + newDirection, newDirection]);
    };

    //This function is used by the miniature images to set the image to be displayed
    function findDirection(index: number){
        if(index >= page){
            return 1
        } else {
            return -1
        }
    }

    //Dynamicly creates a reference for each image miniature when they are mapped
    function addToRefs(el: any){
        if(el && !ref_slides.current.includes(el)){
            ref_slides.current.push(el);
        }
    }


  /* JSX Return
  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
  return (
      /* The Component Container */
      <div className={styles.container}>

        {/* The Slide Element */}
        <div className={styles.sliderWrapper} style={ratio}>
            <AnimatePresence initial={false} custom={direction}>

                  {/* Each slide should be inside this <motion.div> */}
                  <motion.div
                      className={styles.slideContainer}
                      key={page}
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                          x: { type: "spring", stiffness: 300, damping: 30 },
                          opacity: { duration: 0.2 }
                      }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={1}
                      onDragEnd={(e, { offset, velocity }) => {
                          const swipe = swipePower(offset.x, velocity.x);
                          if (swipe < -swipeConfidenceThreshold) {
                          paginate(1);
                          } else if (swipe > swipeConfidenceThreshold) {
                          paginate(-1);
                          }
                      }}>
                          
                          {/* Single slide element */}
                          <div className={styles.imageContainer} style={ratio}>
                              <Image
                                  className={styles.image}
                                  src={slides[imageIndex].url}
                                  alt={slides[imageIndex].alt}
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

                  </motion.div>
            </AnimatePresence>
        </div>

        {/* Other elements */}

             {/* Navigation Arrows */}
             <div className={`${styles.next}`} style={ratio} >
                 <div onClick={() => paginate(1)}><AiOutlineArrowRight/></div>
             </div>
             <div className={styles.prev} style={ratio}>
                 <div onClick={() => paginate(-1)}><AiOutlineArrowLeft/></div>
             </div>
   
             {/* Images Miniatures */}
             <div className={`${styles.small_images_container} ${styles.prevent_select}`}>
                 {slides.map( (item, index) => {
   
                     return (
                     <div 
                         key={index} 
                         className={styles.small_image}
                         ref={addToRefs} //apply the ref to the div
                         onClick={() => setPage([index, findDirection(index)])}
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

  );
};
