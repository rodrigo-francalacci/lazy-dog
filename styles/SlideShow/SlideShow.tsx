import React from 'react'

//React
import {useRef, useState, useEffect} from 'react';

//Styles
import styles from './SlideShow.module.scss'

//Types
type SlideShowProps = {
    children: React.ReactNode;
    t?: number;
    allSlidesDuration?:  (number |undefined)[]
} 

//===========================================================================================================================
const SlideShow: React.FunctionComponent<SlideShowProps> = ({children, t = 5000, allSlidesDuration}: SlideShowProps) => {

    //HTML refs
    const ref_SlidesContainer =useRef<HTMLUListElement>(null!);

    //timer refs
    const interact = useRef<boolean>(false);
    const timer1 = useRef<NodeJS.Timeout | null>(null);
    const timer2 = useRef<NodeJS.Timeout | null>(null);
    const timer3 = useRef<NodeJS.Timeout | null>(null);
    const resizeTimer = useRef<NodeJS.Timeout | null>(null);

    //Append a copy of the first element after the last element
    function copyFirstElement(){

        let firstSlide = ref_SlidesContainer.current.firstElementChild?.outerHTML;
        let innerHTML = ref_SlidesContainer.current.innerHTML;
        ref_SlidesContainer.current.childElementCount

        //embed each slide within a <li> tag, and add a copy of the first slide after the last slide
        let formatedSlides: string = "";
        let slides = ref_SlidesContainer.current.children;
        for (let i = 0; i < slides.length; i++) {
            formatedSlides = formatedSlides + "<li>" + slides.item(i)?.outerHTML + "</li>"
        }
        
        formatedSlides = formatedSlides + "<li>" + slides.item(0)?.outerHTML + "</li>" // copy of the first slide
        ref_SlidesContainer.current.innerHTML = formatedSlides; // insert inside the contaiter of the slides.

        //The duration of the last slide (that is a copy of the first) should be equal to the duration of the first once they are the same
        if(allSlidesDuration){allSlidesDuration[ref_SlidesContainer.current.childElementCount] = allSlidesDuration[1]};

    };


//Core function of the carrousel
function slideTimmer(slideDuration: number, n: number, src: string){
    
    let nSlides = ref_SlidesContainer.current.childElementCount;
    let scrollWidth = ref_SlidesContainer.current.scrollWidth;
    let nextSlideDuration: (number | undefined);

           //case we only have one banner
           if(nSlides <=2 ){
            return}
            ;
   
        if(interact.current == true){
       
                switch(true) {
    
                    case (n == 1):
                        ref_SlidesContainer.current.scrollLeft = 0;
                        timer1.current = setTimeout(()=>{
                            n=n+1;

                            // check if there is any preseted duration for the next slide
                            if(allSlidesDuration && allSlidesDuration[n]){
                                nextSlideDuration = allSlidesDuration[n]!
                            }else{
                                nextSlideDuration = t;
                            }

                            //"nextSlideDuration" is the next slide duration if the user didn't define a specific duration for it
                            slideTimmer(nextSlideDuration , n, src);
                            
                        },slideDuration) //"slideDuration" is the duration of this slide, this value comes from the function
                        
                    break;
    
    
                    case ((nSlides>2) && ((n < nSlides) && (n > 1))):
                        ref_SlidesContainer.current.style.scrollBehavior = "smooth";
                        ref_SlidesContainer.current.scrollLeft = (scrollWidth/nSlides) * (n-1);
                        timer2.current = setTimeout(()=>{
                            n=n+1;

                            // check if there is any preseted duration for the next slide
                            if(allSlidesDuration && allSlidesDuration[n]){
                                nextSlideDuration = allSlidesDuration[n]!
                            }else{
                                nextSlideDuration = t;
                            }

                            //"nextSlideDuration" is the next slide duration if the user didn't define a specific duration for it
                            slideTimmer(nextSlideDuration , n, src);

                        },slideDuration) //"slideDuration" is the duration of this slide, this value comes from the function
                        
                    break;
    
                    case (n == nSlides):
                        ref_SlidesContainer.current.scrollLeft = (scrollWidth/nSlides) * (n-1);
                        timer3.current = setTimeout(()=>{
                            ref_SlidesContainer.current.style.scrollBehavior = "auto";
                            n=1;

                            //"50" is the next (first) slide duration, because its goin to repeat the last (this)
                            slideTimmer(25, n, src); 
                            
                        },slideDuration) //"slideDuration" is the duration of this slide, this value comes from the function
                            
                    break;
          }
        }
    
}



    useEffect(() => {
        
        if(interact.current == false){
            let firstSlideDuration: number
            if(allSlidesDuration && allSlidesDuration[1]){firstSlideDuration = allSlidesDuration[1]} else {firstSlideDuration = t};
            interact.current = true;
            copyFirstElement();
            slideTimmer(firstSlideDuration ,1, "load page");
            
        }


        window.addEventListener('resize', function(){

            clearTimeout(resizeTimer.current!);

            resizeTimer.current = setTimeout(()=>{

                if(interact.current==true){
                    interact.current = false;
                    ref_SlidesContainer.current.style.scrollBehavior = "auto";
                    ref_SlidesContainer.current.scrollLeft = 0;
                    clearTimeout(timer1.current!);
                    clearTimeout(timer2.current!);
                    clearTimeout(timer3.current!); 
                };
        
                if(interact.current == false){
                    let firstSlideDuration: number
                    interact.current = true;
                    if(allSlidesDuration && allSlidesDuration[1]){firstSlideDuration = allSlidesDuration[1]} else {firstSlideDuration = t};
                    slideTimmer(firstSlideDuration , 1, "unpause");
                }

            }, 100)

        });
            

    }, []);



  return (
    <section className = {styles.sliderWrapper}> 
    
        <ul className = {`${styles.scrollHide} ${styles.slidesContainer}`} ref={ref_SlidesContainer}>
             {children}
        </ul>

    </section> 
  )
}

export default SlideShow
