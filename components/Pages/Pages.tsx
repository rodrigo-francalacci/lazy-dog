/* React */
import React, { useEffect, useState, useRef } from 'react'

/* Style */
import styles from './Pages.module.scss'

type PagesProps = {
    products: JSX.Element[],
}

type Pages = {current: number, total: number}


/* Component
============================================ */
const Pages = ({products }:PagesProps) => {

/* States and Refs */
const [prevWidth, setPrevWidth] = useState<number>(null!)
const containerRef = useRef<HTMLDivElement>(null!);
const page_list_ref = useRef<HTMLDivElement>(null!);
const ref_slides = useRef<HTMLDivElement[]>(new Array());
const [pages, setPages] = useState<Pages>(null!);
const [jsxPages, setJSX_pages] = useState<JSX.Element[]>(null!);
const [itensPerPage, setItensPerPage] = useState(10);


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


    setPages({current: 1, total: nPages});
    

},[itensPerPage, products])

//Happens whenever the width changes
useEffect(()=>{
 if(pages){ indicatorOnClick(pages?.current ? pages.current : 1)}
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
        <div className={styles.single_page} ref={addToRefs} key={`page_${index}`}>
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
const indicatorOnClick = (idx: number) => {
    const totalWidth = containerRef.current?.scrollWidth;
    //scroll to the page selected
    containerRef.current?.scrollTo({
        left: (totalWidth!/pages?.total) * (idx-1),
        behavior: "smooth",
      });

      //set the container height to match the current page height
      if(ref_slides?.current[idx-1]?.clientHeight){
        page_list_ref.current!.style.maxHeight = `${ref_slides.current[idx-1].clientHeight.toString()}px`;
      }
      
      setPages({current: idx, total: pages.total});
  };


//Pages Navigation Builder
function pageNavBuilder(pagesInfo: Pages) {
  let output: JSX.Element[] = [];

  for (let index = 1; index <= pagesInfo?.total; index++) {
    output.push(
      <div 
        className={`${styles.page_selector_item} ${(pages.current === index) ? styles.page_selector_item_active : ""}`}
        key={`navItem_${index}`}
        >
        <button type={'button'} onClick={() => {indicatorOnClick(index)}}>Page {index}</button>
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
            <div className={styles.current_page_info}><p>Page {pages?.current} / {pages?.total}</p></div>
        </div>

         {/* Page Nav */}
         <div className={styles.page_selector_container}>
            {
            pageNavBuilder(pages)?.length > 0 && pageNavBuilder(pages).map((item: JSX.Element) => (item))
            }
        </div>
        
        {/* Page items */}
        <div className={styles.pages_container} ref={containerRef}>
            <div className={styles.pages_list} ref={page_list_ref}>
                {jsxPages?.length > 0 && jsxPages.map((page: JSX.Element) => {

                    if(page){return(page)}
                })}
            </div>
        </div>
       
    </div>
  )
}

export default Pages