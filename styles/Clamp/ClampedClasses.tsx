import React from 'react'
import {ClampX_Builder, clampY_Builder, FluidX} from './Clamp' 


const ClampedClasses = (): JSX.Element => {
  return (

    <style>
      {`

        :root{
        --clamp-promo-min_height: ${ClampX_Builder(27, 31)}; 
        --clamp-320--1140: ${ClampX_Builder(320, 1140)}; 
        --clamp-10--300: ${ClampX_Builder(10, 300)}; 
        --clamp-toggle-button: ${clampY_Builder(640, 1440, 35, 55)}; 
        }


        .navbar-toggle-dimentions{
          width: ${FluidX(34,1440,42,65).step1};
          height: ${FluidX(34,1440,42,65).step1};
        }  @media screen and (min-width: ${1440 + 1}px){.navbar-toggle-dimentions{
            width: ${FluidX(34,1440,42,65).step2};
            height: ${FluidX(34,1440,42,65).step2};
          }
        }

        ${NewClampClass(//ProductCard component
          ".product-card-width", 1440, 
          [
            {cssProp: "width", min: (150), mid: 238, max: (320)},
          ]                  //min: 240 for 1 collumn in mobile
        )
        }

        ${NewClampClass(//Navbar opened
          ".navbar-opened-width", 1440, 
          [
            {cssProp: "width", min: (320), mid: 600, max: (1000)},
          ]                  
        )
        }

        ${NewClampClass(//ProductCard component
          ".dogfriend-card-width", 1440, 
          [
            {cssProp: "width", min: (320), mid: 228, max: (430)},
          ]                  
        )}                   

        ${NewClampClass(//image slider component
          ".image-slider-width", 1440, 
          [
            {cssProp: "width", min: (300), mid: 600, max: (650)},
          ]
        )}

        ${NewClampClass(//buttom component
          ".small-buttom-dimensions", 1440, 
          [
            {cssProp: "width", min: (124*0.83), mid: 124, max: (124*1.4)},
            {cssProp: "min-height", min: (28*0.83), mid: 28, max: (28*1.4)},
          ]
        )}

        ${NewClampClass(//buttom component
          ".big-buttom-dimensions", 1440, 
          [
            {cssProp: "width", min: (210*0.83), mid: 210, max: 210*1.4},
            {cssProp: "min-height", min: (50*0.83), mid: 50, max: (50*1.4)},
          ]
        )}

        ${NewClampClass(//quantity box component
          ".quantity-box-dimensions", 1440, 
          [
            {cssProp: "width", min: (117*0.83), mid: 117, max: 117*1.4},
            {cssProp: "min-height", min: (36*0.83), mid: 36, max: (36*1.4)},
          ]
        )}

        ${NewClampClass(//article card component
          ".article-card-width", 1440, 
          [
          {cssProp: "width", min: (240), mid: 280, max: (492)},
          ]
          )}

        ${NewClampClass(//article card component
          ".article-arrow-div-height", 1440, 
          [
          {cssProp: "height", min: (240/2), mid: 280/2, max: (492/2)},
          ]
          )}

        ${NewClampClass(//cart page
          ".cart-summary-dimensions", 1440, 
          [
            {cssProp: "width", min: (280*0.83), mid: 280, max: (280*1.4)},
            {cssProp: "min-height", min: (120*0.83), mid: 120, max: (120*1.4)},
          ]
        )}

        ${NewClampClass(//cart page
          ".cart-item-picture-box", 1440, 
          [
            {cssProp: "width", min: (70*0.83), mid: 70, max: (70*1.4)},
            {cssProp: "max-height", min: (70*0.83), mid: 70, max: (70*1.4)},
          ]
        )}


      `}
    </style> 
  )
}

export default ClampedClasses



//Clamp class builder
//==================================================================================================
 type clampProps = {
  cssProp: cssProps;
  min: number;
  mid: number | "auto";
  max: number;
}

type cssProps = 'font-size' | 'width' | 'height' | 'max-width' | 
  'max-height' | 'min-width' | 'min-height' | 'top' |  'bottom' | 'left' | 'right' |
  'margin-top' | 'margin-bottom' | 'margin-left' | 'margin-right' |
  'padding-top' | 'padding-bottom' | 'padding-left' | 'padding-right' |
  'letter-spacing' | 'line-height';

export function NewClampClass(className: string, middleScreen: number, props: clampProps[]){
  
  var output: string = `${className}{\n`

  // write the class
  for (let i = 0; i < props.length; i++){
    output = `${output}  ${props[i].cssProp}: ${FluidX(props[i].min, middleScreen, props[i].mid, props[i].max).step1};\n`
  }

  //transition to media query
  output = `${output}} \n@media screen and (min-width: ${middleScreen + 1}px){  ${className}\n{`

  //write the media queries
  for (let i = 0; i < props.length; i++){
    output = `${output}  ${props[i].cssProp}: ${FluidX(props[i].min, middleScreen, props[i].mid, props[i].max).step2};\n`
  }

  output = `${output}}}`;

  
  return output;
}