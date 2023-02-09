import React, { Component } from 'react';

//Global setup settings
const A: number = 1.4 /* big screen factor */
const B: number = 1 /* small screen factor */
const smallerScreen: number = 360 /* smaller possible screen in pixels */
const biggerScreen: number = 2560 /* bigger possible screen in pixels */
const screenDiff: number = (biggerScreen * B) - (smallerScreen * A);

export const screenSetup: TypographyGlobalsValues = {

  bigScreenFactor: A,
  smallScreenFactor: B,
  smallerScreen: smallerScreen,
  biggerScreen: biggerScreen,
  screenDiff: screenDiff,
}

//Types
interface TypographyGlobalsValues {
    bigScreenFactor: number;
    smallScreenFactor: number;
    smallerScreen: number;
    biggerScreen: number;
    screenDiff: number
}


//===========================================================================================================================
export function GlobalTypographySetup() {

    var sFont =  16 * B; /* smallest font size in pixels */
    var bFont = 16 * A; /* largest font size in pixels */
  
      var fontDiff = bFont - sFont;
      var xUp = (sFont * screenDiff) - (fontDiff * smallerScreen);
      var x = xUp/(16 * screenDiff);
      var y = 100 * (fontDiff / screenDiff)

    var  minREM: string = String(B) + "rem"
    var  maxREM: string = String(A) + "rem"
    var  middle: string = String(x.toFixed(4)) + "rem" + " + " + String(y.toFixed(4)) + "vw"
    var  clampOut: string = "clamp(" + minREM + ", " + middle + ", " + maxREM + ")"

    return clampOut

}

//===========================================================================================================================
export const HTML_Typography = () => {
    return (
      <style type="text/css">
        { `
           html { font-size: ${GlobalTypographySetup()}}
          
        `}
      </style>
    )
  }
    