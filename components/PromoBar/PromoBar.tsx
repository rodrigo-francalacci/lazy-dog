//React
import React from 'react'

//Components
import SlideShow  from '../../styles/SlideShow/SlideShow'

//Style
import styles from './promoBar.module.scss'

//Types
import {bannerItemProps} from '../../utils/sanity_queries'

type promosConfig ={
    defaultInterval: number;
    positon: string;
}



//===========================================================================================================================
export const PromoBar = ({banners}: {banners: bannerItemProps[]}) => {


//--------------HARDCODE FAKE DATA-----------------
//general configuration data
var promoConfig: promosConfig = {
    defaultInterval: 2000,
    positon: "fixed",
}

//define the allSlidesDuration array to get the duration of each slides
let allSlidesDuration: (number | undefined)[] = [];

//first element of the array is the default interval
allSlidesDuration[0] = promoConfig.defaultInterval;

//get the duration of each slide
banners?.length > 0 && banners.map((item, index) => (
    allSlidesDuration[index + 1] = item.duration! * 1000 // seconds to miliseconds
))


return (

    <div className={`worksans-promobar ${styles.bar_container}`}>
        
        {banners?.length > 0 && //because the slideshow component won't update the state
                                //we only pass the banner when it exists and there is
                                // at least one item (banner)
        
        <SlideShow
            t={promoConfig.defaultInterval}
            allSlidesDuration={allSlidesDuration}>
            
            {banners.map((item, index) => (
                <div className={`${item.theme} ${styles.item_container}`} key={'promo' + index}>
                    {!!item.url ?
                    <a href={item.url}>{item.text}</a> :
                    <p>{item.text}</p>
                    }
                </div>
            ))}
        </SlideShow>}
    </div> 

  ) 
};



