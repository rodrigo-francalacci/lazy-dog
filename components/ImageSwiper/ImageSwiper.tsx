/* React */
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* Components */
import SwiperLogic from "../SwiperLogic/SwiperLogic";


/* Styles */
import styles from "./ImageSwiper.module.scss";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';

/* Types */
export type ImageSwiperProps = {
    items:{
      url: string;
      alt: string;
    }[],
    Aratio: {
        up_to_screen_width: `${number}px`,
        aspectRatio: `${number}/${number}`,
    }[],
    objectFit?: 'cover' | 'contain',
  };

/* COMPONENT
================================================================================= */
function ImageSwiper({items, objectFit ='cover', Aratio  }: ImageSwiperProps) {

const [ratio, setRatio] = useState<any>(null!);
/*===================================================================================
                                    USE EFFECTS
===================================================================================== */

  //Change the image ratio depending on the screen width
  useEffect(() => {
    setAspectRatio();

    window.addEventListener("resize", () => {
      setAspectRatio();
    });
  }, []);

  function setAspectRatio() {
    const currentScreen = window.screen.width;
    //reverse sorted
    const sortedRatios = Aratio?.sort((a, b) =>
      a.up_to_screen_width < b.up_to_screen_width ? 1 : -1
    );

    //check the screen size to set the padding top
    sortedRatios?.forEach(function (item, idx) {
      let thisSize = Number(item.up_to_screen_width.replace("px", ""));
      let nextSize =
        idx === sortedRatios.length - 1
          ? 0
          : Number(sortedRatios[idx + 1].up_to_screen_width.replace("px", ""));
      let paddingTop = `${(eval(item.aspectRatio) * 100).toFixed(1)}%`;

      if (currentScreen <= thisSize && currentScreen > nextSize) {
        setRatio({ paddingTop: paddingTop });
      }
    });
  }

  return (
    <SwiperLogic transition_time="300ms" transition_style="ease-out" snap_in={true} min_swipe_required={30}>
    {/* Items list */}
    <ul datatype={`["slides-container"]`}>

        {/* Mapping images */}
        {items.map((item, idx) => (
          <li 
            datatype={JSON.stringify(["slide", idx])} 
            key={idx}
            className={styles.swiper_item}
            style={ratio}>
            <Image
              className={styles.image}
              src={item.url}
              alt={item.alt}
              layout="fill"
              objectFit={objectFit}
              draggable={false}
              /* This prop is particularly useful for images visible above the fold - i.e, 
                 the portion of a web page that is visible without scrolling. 
                 Images visible above the fold, such as images on a landing page, 
                 should use the priority prop for the performance boost.
                 https://refine.dev/blog/using-next-image/#priority */
              priority={true}
              loading="eager"
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
          </li>
        ))}
      </ul>

      {/* Images Miniatures */}
      <div
        className={`${styles.small_images_container} ${styles.prevent_select}`}
      >
        {items.map((item, index) => {
          return (
            <div
              datatype={JSON.stringify(["nav-item", index, styles.navActive, styles.navInactive])}
              key={index}
              className={styles.small_image}
            >
              <Image
                src={item.url}
                alt={item.alt}
                layout="fill"
                objectFit="cover"
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
          );
        })}

      </div>

      {/* Navigation Arrows */}
      <div className={`${styles.next}`} style={ratio}>
        <div datatype={`["nav-arrow-right"]`}>
          <AiOutlineArrowRight />
        </div>
      </div>

      <div className={styles.prev} style={ratio}>
        <div datatype={`["nav-arrow-left"]`}>
          <AiOutlineArrowLeft />
        </div>
      </div>

      
    </SwiperLogic>
  )
}

export default ImageSwiper