/* React */
import React, { useEffect, useState, useRef } from 'react'

/* Custom Hooks/Helpers */
import { useStateRef, getRefValue } from "./lib/hooks";
import { getTouchEventData } from './lib/dom'; //To apply the same logic for mobile

/* Style */
import styles from './Pages.module.scss'

type PagesProps = {
    products: JSX.Element[],
}

type Pages = {total: number}
const MIN_SWIPE_REQUIRED = 60;

/* Component
============================================ */
const Pages = ({products }:PagesProps) => {


/* Refs */
const containerRef = useRef<HTMLDivElement>(null!);
const page_list_ref = useRef<HTMLDivElement>(null!);
const minOffsetXRef = useRef(0);
const currentOffsetXRef = useRef(0);
const startXRef = useRef(0);
const ref_slides = useRef<HTMLDivElement[]>(new Array());

/* States*/
const [prevWidth, setPrevWidth] = useState<number>(null!)
const [pages, setPages] = useState<Pages>(null!);
const [jsxPages, setJSX_pages] = useState<JSX.Element[]>(null!);
const [itensPerPage, setItensPerPage] = useState(10);
const [currentIdx, setCurrentIdx] = useState(0);
const [offsetX, setOffsetX, offsetXRef] = useStateRef(0);
const [isSwiping, setIsSwiping] = useState(false);

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

    const containerEl = getRefValue(page_list_ref);
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
    const containerWidth = page_list_ref.current?.offsetWidth;
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
    setCurrentPageHeight(Math.abs(newOffsetX / containerWidth!));

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

    const containerEl = getRefValue(page_list_ref);
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
    const containerWidth = page_list_ref.current?.clientWidth;
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
    setCurrentPageHeight(Math.abs(newOffsetX / containerWidth!))

    window.removeEventListener("touchend", onTouchEnd);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("mouseup", onTouchEnd);
    window.removeEventListener("mousemove", onTouchMove);
  };

  /*===================================================================================
                                     AUX FUNCTIONS
===================================================================================== */


useEffect(()=>{

  if(document){setPrevWidth(document.documentElement.clientWidth)}
    //calc number of pages
    let nPages: number;
    //If the number of products is smaller them items per page => we have 1 page
    if(products.length <= itensPerPage){
        nPages = 1
    } else {
        let remainder = products.length %  itensPerPage;
        // if the remainder is 0 so we just need to divide producs per number of itens in each page
        if(remainder === 0){
            nPages = products.length/itensPerPage
        //if we have a remainder we just need to add another page to acomodate the remainder
        } else {
            nPages = Math.floor((products.length/itensPerPage) + 1)
        }  
    }

      /* Changes the state "prevWidth" on resize, a change in this state 
       triggers the useEffect bellow to recalculate the slideshow width */
      window.addEventListener("resize", () => {
        setPrevWidth(document.documentElement.clientWidth)
      });


    setCurrentIdx(0);
    setPages({total: nPages});
    setCurrentPageHeight(0)
    
    

},[itensPerPage, products])

//Happens whenever the width changes
useEffect(()=>{
 if(pages){ indicatorOnClick(currentIdx ? currentIdx : 0)}
},[prevWidth])

useEffect(()=>{
    pagesBuilder();
},[pages?.total])




//Pages Builder
function pagesBuilder(){
    let pagesArray: JSX.Element[] = [];
    //reset the references for the pages
    ref_slides.current = [];

    for (let index = 1; index <= pages?.total; index++) {
        let pageItemsArray = selectPageItems(index);


        pagesArray.push(
        <div 
          className={styles.single_page} 
          ref={addToRefs} 
          key={`page_${index}`}
          draggable={false}
          >
            {
            pageItemsArray?.length > 0 && pageItemsArray?.map((item: JSX.Element, index)=>{
                if(item) {

                    return(item)
                }})
            }
        </div>)  
        
        
    }
   
    setJSX_pages(pagesArray);
}

useEffect(()=>{
  if(jsxPages?.length > 0){indicatorOnClick(1);}
},[jsxPages])


//Select Page items
function selectPageItems(page: number) {
  let output: JSX.Element[] = [];

  //Scroll to top
/*   if (typeof window !== "undefined") {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  } */

  //If we have only one page whe return all items
  if (pages?.total === 1) {
    return products;
  }

  //If we have more than one page and we are selecting page 1
  if (page === 1) {
    products?.length > 0 &&
      products.map((item: JSX.Element, index: number) => {
        if (index + 1 <= itensPerPage) {
          output.push(item);
        }
      });
    return output;
  }

  //If we are in any other page
  if (page > 1) {
    const from = (page - 1) * itensPerPage;
    const to = (page * itensPerPage) - 1;

    for (let nItem = from; nItem <= to; nItem++) {
      output.push(products[nItem]);
    }

    return output;
  }

  return []
}

//Change page on click
  //Indicator function
  const indicatorOnClick = (idx: number) => {
    const containerEl = getRefValue(page_list_ref);
    const containerWidth = containerEl.offsetWidth;
    calcNewOffset();

    function calcNewOffset() {
      let newOffset: number;
      if (containerWidth * idx >= page_list_ref.current?.scrollWidth!) {
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
      setCurrentPageHeight(idx);

    }
  };

  function setCurrentPageHeight(idx: number){
     //set the container height to match the current page height
     idx = idx + 1
     if(ref_slides?.current[idx-1]?.clientHeight){
      page_list_ref.current!.style.maxHeight = `${ref_slides.current[idx-1].clientHeight.toString()}px`;
      
    }
  }
/* const indicatorOnClick = (idx: number) => {
    const totalWidth = page_list_ref.current?.scrollWidth;
    //scroll to the page selected
    page_list_ref.current?.scrollTo({
        left: (totalWidth!/pages?.total) * (idx-1),
        behavior: "smooth",
      });

      //set the container height to match the current page height
      if(ref_slides?.current[idx-1]?.clientHeight){
        page_list_ref.current!.style.maxHeight = `${ref_slides.current[idx-1].clientHeight.toString()}px`;
      }
      
      setCurrentIdx(idx)
  }; */


//Pages Navigation Builder
function pageNavBuilder(pagesInfo: Pages) {
  let output: JSX.Element[] = [];

  for (let index = 1; index <= pagesInfo?.total; index++) {
    output.push(
      <div 
        className={`${styles.page_selector_item} ${(currentIdx === index-1) ? styles.page_selector_item_active : ""}`}
        key={`navItem_${index}`}
        >
        <button type={'button'} onClick={() => {indicatorOnClick(index-1)}}>Page {index}</button>
      </div>
    );
  }
  return output
}

//Dynamicly creates a reference for each image miniature when they are mapped
function addToRefs(el: any){
    if(el && !ref_slides.current.includes(el)){
        ref_slides.current.push(el);
    }
}

/* JSX Return
==================================================== */
  return (
    <div className={styles.container}>

        {/* Page options/header */}
        <div className={styles.header}>

            <div className={styles.npages_selector}>
                <label htmlFor ="nItems">Items per page</label>

                <select name="nItems" id="nItems" defaultValue={10} onChange={(event)=>{setItensPerPage(Number(event.target.value)); }}>
                    <option value={4}>4</option>
                    <option value={6}>6</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>
            <div className={styles.current_page_info}><p>Page {currentIdx+1} / {pages?.total}</p></div>
        </div>

         {/* Page Nav */}
         <div className={styles.page_selector_container}>
            {
            pageNavBuilder(pages)?.length > 0 && pageNavBuilder(pages).map((item: JSX.Element) => (item))
            }
        </div>
        
        {/* Page items */}
        <div className={styles.pages_container}
             ref={containerRef}
             onMouseDown={onMouseDown}
             onTouchStart={onTouchStart}>
            <div 
                ref={page_list_ref}
                className={`${styles.pages_list} ${
                  isSwiping ? styles.is_swiping : ""
                }`}
                style={{ transform: `translate3d(${offsetX}px, 0, 0)` }}>

                {jsxPages?.length > 0 && jsxPages.map((page: JSX.Element) => {

                    if(page){return(page)}
                })}
            </div>
        </div>
       
    </div>
  )


}

export default Pages