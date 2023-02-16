/* React/NextJS */
import React, { useEffect } from "react";
import { useState } from "react";

/* Style */
import css from "./CategoryFilter.module.scss";
import { HiOutlineArrowNarrowUp } from "react-icons/hi";

/* Components */
import SwiperLogic from "../SwiperLogic/SwiperLogic";
import Buttom from "../Buttom/Buttom";

import { filterProducts } from "./Filters";

/* Types */
import { productProps } from "../../utils/shopify_colllection_query";
type Variant = {
  name: string;
  options: {
    name: string,
    state: boolean
  }[],
  filterActive: boolean;
}

type FilterProps = {
  products: productProps[],
  setProducts: React.Dispatch<React.SetStateAction<productProps[]>>
}

export const CategoryFilter = ({products, setProducts}: FilterProps) => {

  const [variants, setVariants] = useState<Variant[]>(null!);
  const [currentVariant, setCurrentVariant] = useState<{variant: Variant, index: number}>(null!);
  const [showSelector, setShowSelector] = useState<boolean>(false);
  const [toggleFilterState, toggleFilter] = useState<boolean>(false);

    /* LOADING FUNCTIONS
  ================================================================ */

  useEffect(()=>{
    setVariants(getVariants());
    resetVariantArray();
    setProducts(products);

  },[products])

  function getVariants() {
    let output: Variant[] = [];
    //Map the products
    {
      products?.length > 0 &&
        products.map((product) => {
          //Map the variants inside this product
          {
            product.options?.length > 0 &&
              product.options.map((item) => {
                //check if we already have this variant
                let index = output.findIndex((e) => e.name === item.name);
                //if we don't
                if (index == -1) {
                  output.push({
                    name: item.name,
                    options: item.values.map((opt: any) => {
                      return {name: opt.option, state: true};
                    }),
                    filterActive: false
                  });
                }
                //if we have this variant we need to check if we have all the options
                else {
                  item?.values > 0 &&
                    item.values.map((opt: any) => {
                      let idx = output[index].options.findIndex(
                        (e) => e === opt.option
                      );
                      //if its a new option for this variant, we add the new option
                      if (idx == -1) {
                        output[index].options.push({name: opt.option, state: true});
                      }
                    });
                }
              });
          }
        });
    }

    return output;
  }

  /* AUX Functions
  ================================================================ */
  function A(item: any){
    return JSON.stringify(item)
  }
  
  function resetVariantArray() {
    if (variants) {
      var copyVariants =
        variants?.length > 0 &&
        variants.map((variant) => {
          return {
            name: variant.name,
            filterActive: false,
            options:
              variant?.options &&
              variant.options.map((opt) => {
                return {
                  name: opt.name,
                  state: true,
                };
              }),
          };
        });

      if (copyVariants) {
        setVariants(copyVariants);
        if (currentVariant) {
          setCurrentVariant(null!);
        }
      }
    }
  }
  
  function handleSelection({event, value, optIndex}:{event: any ,value: string, optIndex: number}){
    /* event.preventDefault(); */

    let copyVariants = variants;
    let copyCurrentVariant = currentVariant;

    //update current variant
    copyCurrentVariant.variant.options[optIndex].state = event.target.checked;
    setCurrentVariant(copyCurrentVariant);

     //Find where is this variant in the variants state array
    let index = copyVariants.findIndex((e) => e.name === currentVariant.variant.name);
    
    //Update the variants array
    if (index != -1) {
      copyVariants[index] = copyCurrentVariant.variant
      setVariants(copyVariants)
    }

  }

  function handleApplyThisFilter({variantIndex, filterState}:{variantIndex: number, filterState: boolean}){
        
        //make a copy of the variants
        const copyVariants = variants;

        //change the filterActive state for variants[variantIndex]
        copyVariants[variantIndex].filterActive = filterState;

        //Reset the variants
        setVariants(copyVariants);
        
        //Trigger the filter action
        toggleFilter(!toggleFilterState);

  }

  function handleVariantClick({thisItem, index}:{thisItem: Variant, index: number}){
    setCurrentVariant({variant: thisItem, index: index});
    if(thisItem.name === currentVariant?.variant.name){
      showSelector ? setShowSelector(false) : setShowSelector(true)
    } else{
      setShowSelector(true)
    }
  }

  /* FILTER EFFECT
  ================================================================ */
  useEffect(()=>{
    //Filter items
    let filteredProducts = filterProducts({products, variants});
    setProducts(filteredProducts)

  },[toggleFilterState])

  /* JSX Return
  ================================================================ */
  return (
    <div className={css.container}>
         <SwiperLogic transition_time="300ms" transition_style="ease-out" snap_in={false} min_swipe_required={30}>
           {/* Items list */}
           <ul datatype={A(["slides-container"])} className={css.list}>
             <li datatype={A(["slide", 0])} className={css.list_item}>
               <span className={css.showAll} onClick={()=>{setProducts(products); setShowSelector(false); resetVariantArray()}}>Show All Products</span>
              </li>
             <li datatype={A(["slide", 1])} className={css.list_item}>or filter by:</li>
             {variants?.length > 0  && variants.map((item, idx)=>{
               return (
                 <li 
                    datatype={A(["slide", idx+1])} 
                    key={idx+1} 
                    className={css.list_item}>
                   <span onClick={()=>{handleVariantClick({thisItem: item, index: idx})}}
                          className={
                            `${(currentVariant?.index === idx && showSelector)? css.edit : css.disabled}
                             ${(item.filterActive) ? css.active: css.disabled}
                            `
                            }>
                     {item.name}
                     </span>
                 </li>
               )
             })}
           </ul>
       </SwiperLogic>
       <div className={`${css.selectorContainer} ${showSelector ? css.selectorContainerOpened : css.selectorContainerClosed}`}>
             <h3>Options for {currentVariant && currentVariant.variant.name}</h3>
             <form action="#">
                {currentVariant?.variant.options?.length > 0 && currentVariant.variant.options.map((opt, optIndex) =>{
                  
                  return (
                  <p key={opt.name}>
                     <input 
                        type="checkbox" 
                        id={opt.name} 
                        defaultChecked={opt.state}
                        onClick={(e)=>{handleSelection({event: e, value: opt.name, optIndex: optIndex})}}/>
                     <label htmlFor={opt.name}>{opt.name}</label>
                  </p>
                  )
                })}
             </form>

             <div className={css.selector_bots_container}>
               <Buttom
                onClick={()=>{handleApplyThisFilter({variantIndex: currentVariant.index, filterState: !currentVariant.variant.filterActive})}}
                bkgColor='bkg-black' fontColor='font-white' size="small">
                  <button>
                    {currentVariant?.variant?.filterActive ? "Remove Filter" : "Apply Filter"}</button>
               </Buttom>
               
               <button onClick={()=>{setShowSelector(false)}} className={css.collapse}>
                 <HiOutlineArrowNarrowUp/>
               </button>
             </div>

            
       </div>
    </div>
  );
};

