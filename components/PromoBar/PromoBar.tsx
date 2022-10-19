import React from 'react'
import styles from './promoBar.module.scss'

//Components
import SlideShow  from '../../styles/SlideShow/SlideShow'

//Types
type promosConfig ={
    defaultInterval: number;
    positon: string;
}

type promosItemsProps = {
    text: string;
    url?: string;
    theme: "promoBar-theme-normal" | "promoBar-theme-light";
    flashing: boolean;
    duration?: number;
}[];


//===========================================================================================================================
export const PromoBar = () => {

//--------------HARDCODE FAKE DATA-----------------
//general configuration data
var promoConfig: promosConfig = {
    defaultInterval: 2000,
    positon: "fixed",
}


//idividual banners data
var promosItems: promosItemsProps = [
    {
        text: "Sale 20% off Use HAPPY20 at the checkout for 20% ",
        theme: "promoBar-theme-normal",
        flashing: false,
        duration: 1000,
    },
    {
        text: "Check out instagram page here - 5s",
        url: "https://www.instagram.com/lazydogduvets/",
        theme: "promoBar-theme-normal",
        flashing: false,
        duration: 5000
    },
    {
        text: "Check out instagram page here - 15s",
        url: "https://www.instagram.com/lazydogduvets/",
        theme: "promoBar-theme-normal",
        flashing: false,
        duration: 15000        
    },

];

//define the allSlidesDuration array to get the duration of each slides
let allSlidesDuration: (number | undefined)[] = [];

//first element of the array is the default interval
allSlidesDuration[0] = promoConfig.defaultInterval;

//get the duration of each slide
promosItems?.length > 0 && promosItems.map((item, index) => (
    allSlidesDuration[index + 1] = item.duration
))


  return (

    <div className={`worksans-promobar ${styles.bar_container}`}>
        <SlideShow
            t={promoConfig.defaultInterval}
            allSlidesDuration={allSlidesDuration}>
            {promosItems?.length > 0 && promosItems.map((item, index) => (
                <div className={`${item.theme} ${styles.item_container}`} key={'promo' + index}>
                    {!!item.url ?
                    <a href={item.url}>{item.text}</a> :
                    <p>{item.text}</p>
                    }
                </div>
            ))}
        </SlideShow>
    </div>

  )
};



