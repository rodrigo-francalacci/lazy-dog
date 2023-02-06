/* React */
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* Custom Hooks/Helpers */
import { useStateRef, getRefValue } from "./lib/hooks";
import { getTouchEventData } from './lib/dom'; //To apply the same logic for mobile

/* Styles */
import styles from "./Swiper.module.scss";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';

/* Types */
export type SwiperProps = {
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

const MIN_SWIPE_REQUIRED = 30;

/* COMPONENT
================================================================================= */
function Swiper({ items, objectFit ='cover', Aratio  }: SwiperProps) {
  //Refs
  const containerRef = useRef<HTMLUListElement>(null);
  const minOffsetXRef = useRef(0);
  const currentOffsetXRef = useRef(0);
  const startXRef = useRef(0);
  const ref_slides = useRef<HTMLDivElement[]>(new Array()); //all the miniature images

  //States
  const [offsetX, setOffsetX, offsetXRef] = useStateRef(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [ratio, setRatio] = useState<any>(null!);

  /*===================================================================================
                                    USE EFFECTS
===================================================================================== */

  //Change the image ratio depending on the screen width
  useEffect(() => {
    setAspectRatio();
    /* if (window.screen.width >= 680) {
      setRatio({ paddingTop: aspectRatio });
    }
    if (window.screen.width < 680) {
      setRatio({ paddingTop: "75%" });
    }
    if (window.screen.width < 500) {
      setRatio({ paddingTop: "100%" });
    } */
    window.addEventListener("resize", () => {
      onTouchEnd();
      setAspectRatio();
      /*  if (window.screen.width >= 680) {
        setRatio({ paddingTop: aspectRatio });
      }
      if (window.screen.width < 680) {
        setRatio({ paddingTop: "75%" });
      }
      if (window.screen.width < 500) {
        setRatio({ paddingTop: "100%" });
      } */
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

  //Select the active miniature image by changing the opacity and adding a border
  useEffect(() => {
    ref_slides.current.forEach((element, n) => {
      if (currentIdx == n) {
        element.style.opacity = "1";
        element.style.border = "solid 1px grey";
      } else {
        element.style.opacity = "0.5";
        element.style.border = "none";
      }
    });
  }, [currentIdx]);

  /*===================================================================================
                            MOUSE AND TOUCH EVENTS HANDLERS
===================================================================================== */

  /* 
    START -> onMouseDown -> onMouseMove -> onMouseUp -> END

    Instead of simply using MouseEvent as the type of e, we need to use 
    React.MouseEvent which accepts an argument of what type of Element 
    do we expect, in this case we expect it to be an HTMLDivElement. 
    */

  //On mouse Down
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    currentOffsetXRef.current = getRefValue(offsetXRef);
    startXRef.current = e.clientX;

    const containerEl = getRefValue(containerRef);
    minOffsetXRef.current = containerEl.offsetWidth - containerEl.scrollWidth;

    /* So we only need to listen to the other two events when the user triggers onMouseDown.
        We can start listening to these two other events inside onMouseDown */
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  //On mouse Move
  const onMouseMove = (e: MouseEvent) => {
    const currentX = e.clientX;
    const diff = getRefValue(startXRef) - currentX;
    let newOffsetX = getRefValue(currentOffsetXRef) - diff;

    const maxOffsetX = 0;
    const minOffsetX = getRefValue(minOffsetXRef);

    if (newOffsetX > maxOffsetX) {
      newOffsetX = maxOffsetX;
    }

    if (newOffsetX < minOffsetX) {
      newOffsetX = minOffsetX;
    }

    setOffsetX(newOffsetX);
  };

  //On mouse Up
  const onMouseUp = () => {
    const currentOffsetX = getRefValue(currentOffsetXRef);
    const containerWidth = containerRef.current?.offsetWidth;
    let newOffsetX = getRefValue(offsetXRef);

    const diff = currentOffsetX - newOffsetX;

    // we need to check difference in absolute/positive value (if diff is more than 40px)
    if (Math.abs(diff) > MIN_SWIPE_REQUIRED) {
      if (diff > 0) {
        // swipe to the right if diff is positive
        newOffsetX = Math.floor(newOffsetX / containerWidth!) * containerWidth!;
      } else {
        // swipe to the left if diff is negative
        newOffsetX = Math.ceil(newOffsetX / containerWidth!) * containerWidth!;
      }
    } else {
      // remain in the current image
      newOffsetX = Math.round(newOffsetX / containerWidth!) * containerWidth!;
    }

    setIsSwiping(false);
    setOffsetX(newOffsetX);
    setCurrentIdx(Math.abs(newOffsetX / containerWidth!));

    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("mousemove", onMouseMove);
  };

  //Touch start
  const onTouchStart = (
    e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    setIsSwiping(true);
    currentOffsetXRef.current = getRefValue(offsetXRef);
    startXRef.current = getTouchEventData(e).clientX;

    const containerEl = getRefValue(containerRef);
    minOffsetXRef.current = containerEl.offsetWidth - containerEl.scrollWidth;

    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("mousemove", onTouchMove);
    window.addEventListener("mouseup", onTouchEnd);
  };

  //Touch move
  const onTouchMove = (e: TouchEvent | MouseEvent) => {
    const currentX = getTouchEventData(e).clientX;
    const diff = getRefValue(startXRef) - currentX;
    let newOffsetX = getRefValue(currentOffsetXRef) - diff;

    const maxOffsetX = 0;
    const minOffsetX = getRefValue(minOffsetXRef);

    if (newOffsetX > maxOffsetX) {
      newOffsetX = maxOffsetX;
    }

    if (newOffsetX < minOffsetX) {
      newOffsetX = minOffsetX;
    }

    setOffsetX(newOffsetX);
  };

  //touch end
  const onTouchEnd = () => {
    const currentOffsetX = getRefValue(currentOffsetXRef);
    const containerWidth = containerRef.current?.clientWidth;
    let newOffsetX = getRefValue(offsetXRef);

    const diff = currentOffsetX - newOffsetX;

    // we need to check difference in absolute/positive value (if diff is more than 40px)
    if (Math.abs(diff) > MIN_SWIPE_REQUIRED) {
      if (diff > 0) {
        // swipe to the right if diff is positive
        newOffsetX = Math.floor(newOffsetX / containerWidth!) * containerWidth!;
      } else {
        // swipe to the left if diff is negative
        newOffsetX = Math.ceil(newOffsetX / containerWidth!) * containerWidth!;
      }
    } else {
      // remain in the current image
      newOffsetX = Math.round(newOffsetX / containerWidth!) * containerWidth!;
    }

    setIsSwiping(false);
    setOffsetX(newOffsetX);
    setCurrentIdx(Math.abs(newOffsetX / containerWidth!));

    window.removeEventListener("touchend", onTouchEnd);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("mouseup", onTouchEnd);
    window.removeEventListener("mousemove", onTouchMove);
  };

  /*===================================================================================
                                     AUX FUNCTIONS
===================================================================================== */

  //Indicator function
  const indicatorOnClick = (idx: number) => {
    const containerEl = getRefValue(containerRef);
    const containerWidth = containerEl.offsetWidth;
    calcNewOffset();

    function calcNewOffset() {
      let newOffset: number;
      if (containerWidth * idx >= containerRef.current?.scrollWidth!) {
        newOffset = -(containerWidth * (idx - 1));
        setCurrentIdx(Math.abs(newOffset / containerWidth!));
        setOffsetX(newOffset);
        return;
      }

      if (containerWidth * idx < 0) {
        setOffsetX(0);
        setCurrentIdx(0);
        return;
      }

      newOffset = -(containerWidth * idx);
      setCurrentIdx(idx);
      setOffsetX(newOffset);
    }
  };

  //Dynamicly creates a reference for each image miniature when they are mapped
  function addToRefs(el: any) {
    if (el && !ref_slides.current.includes(el)) {
      ref_slides.current.push(el);
    }
  }

  /*===================================================================================
                                     JSX RETURN
===================================================================================== */
  return (
    <div
      className={styles.swiper_container}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {/* Items list */}
      <ul
        ref={containerRef}
        className={`${styles.swiper_list} ${
          isSwiping ? styles.is_swiping : ""
        }`}
        style={{ transform: `translate3d(${offsetX}px, 0, 0)` }}
      >
        {/* Mapping images */}
        {items.map((item, idx) => (
          <li key={idx} className={styles.swiper_item} style={ratio}>
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
              key={index}
              className={styles.small_image}
              ref={addToRefs} //apply the ref to the div
              onClick={() => {
                indicatorOnClick(index);
              }}
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
        <div onClick={() => indicatorOnClick(currentIdx + 1)}>
          <AiOutlineArrowRight />
        </div>
      </div>
      <div className={styles.prev} style={ratio}>
        <div onClick={() => indicatorOnClick(currentIdx - 1)}>
          <AiOutlineArrowLeft />
        </div>
      </div>
    </div>
  );
}

export default Swiper;
