/* React */
import React, { useEffect, useRef, useState } from "react";

/* Custom Hooks/Helpers */
import { useStateRef, getRefValue } from "./lib/hooks";
import { getTouchEventData } from './lib/dom'; //To apply the same logic for mobile

/* Styles */
import styles from "./SwiperLogic.module.scss";

/* Types */
export type SwiperProps = {
    children: React.ReactNode,
    snap_in: boolean;
    transition_time: `${number}ms`,
    transition_style: string,
    min_swipe_required: number,
  };

/* COMPONENT
================================================================================= */
function SwiperLogic({children, snap_in, transition_time, transition_style, min_swipe_required}: SwiperProps) {
  //Refs
  const containerRef = useRef<HTMLUListElement>(null);
  const minOffsetXRef = useRef(0);
  const currentOffsetXRef = useRef(0);
  const startXRef = useRef(0);

  //States
  const [offsetX, setOffsetX, offsetXRef] = useStateRef(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

/*===================================================================================
                                    USE EFFECTS
===================================================================================== */

  //Change the image ratio depending on the screen width
  useEffect(() => {
    window.addEventListener("resize", () => {
      onTouchEnd();
    });
  }, []);


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
    if(snap_in){
      if (Math.abs(diff) > min_swipe_required) {
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

    if(snap_in){
    // we need to check difference in absolute/positive value (if diff is more than 40px)
      if (Math.abs(diff) > min_swipe_required) {
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


//================================<CHILDREN MANIPULATION>=================================
//========================================================================================
function recursiveMap(children: React.ReactNode, fn: any): React.ReactNode {
  return React.Children.map(children, child => {
    if (!React.isValidElement(child)) {
      return child;
    }

    if (child.props.children) {
      child = React.cloneElement(child, {
        children: recursiveMap(child.props.children, fn)
      });
    }

    return fn(child);
  });
}

function changeChild(child: React.ReactNode): React.ReactNode {
   if (React.isValidElement(child)) {
     if (child.props.datatype) {
       let type = JSON.parse(child.props.datatype);
       switch (type[0]) { 
         case "slides-container":
           return React.cloneElement(child, {
             ref: containerRef, draggable: false,
             className:`${styles.swiper_list} ${isSwiping ? styles.is_swiping : ""} ${child.props.className ? child.props.className : ""}` ,
             style: { transform: `translate3d(${offsetX}px, 0, 0)`, transition: `transform ${transition_time} ${transition_style}` },
             }); break;

         case "slide":
           return React.cloneElement(child, { 
            className: `${child.props.className ? child.props.className : ""} ${styles.swiper_item}`,
            draggable: false,
            }); break;

         case "nav-item":
           return React.cloneElement(child, { 
            draggable: false,
            className: `${child.props.className ? child.props.className : ""} ${(currentIdx === Number(type[1])) ? type[2] : type[3]}`,
            onClick: () => {
              indicatorOnClick(Number(type[1]));
            }} 
            ); break;
         
        case "nav-arrow-right":
           return React.cloneElement(child, { 
            draggable: false,
            onClick: () => indicatorOnClick(currentIdx + 1)
              }
            ); break;
        
        case "nav-arrow-left":
           return React.cloneElement(child, {
            draggable: false,
            onClick: () => indicatorOnClick(currentIdx - 1)
              }
            ); break;

         default:
          return React.cloneElement(child, {
            draggable: false,
              }
            ); break;
       }
     } else {
      return React.cloneElement(child, {
        draggable: false,
          }
        );
     }
   }
   return child;
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
      {recursiveMap(children, changeChild)}

    </div>
  );
}

export default SwiperLogic;
