import React from 'react'
import { screenSetup } from '../Typography/globalTypographySetup'


const A: number = screenSetup.bigScreenFactor /* big screen factor */
const B: number = screenSetup.smallScreenFactor /* small screen factor */
const smallerScreen: number = screenSetup.smallerScreen /* smaller possible screen in pixels */
const biggerScreen: number = screenSetup.biggerScreen /* bigger possible screen in pixels */
const screenDiff: number = screenSetup.screenDiff


  type cssProps = 'fontSize' | 'width' | 'height' | 'maxWidth' | 
  'maxHeight' | 'minWidth' | 'minHeight' | 'top' |  'bottom' | 'left' | 'right' |
  'marginTop' | 'marginBottom' | 'marginLeft' | 'marginRight' |
  'paddingTop' | 'paddingBottom' | 'paddingLeft' | 'paddingRight' |
  'letterSpacing' | 'lineHeight';

  type max = number;
  type min = number;
  type rangeMax = number;
  type rangeMin = number;
  
export type clampProps = {

    cssProp: cssProps;
    min: number;
    max: number;

  }

export type clampPropsArray = [cssProps, min, max, rangeMin?, rangeMax?];




//===========================================================================================================================
//returns a style element to be used inside inline inside the style property style={Here goes the function}//
  export const Clamp = (cssProp: cssProps, min: number, max: number): React.CSSProperties => {

    const screenDiff: number = ((biggerScreen * B) - (smallerScreen * A));
    
    const fontDiff: number = ((max * B) - (min * A));
    var y: number = 100 * (fontDiff/screenDiff);
    var x: number = (max/(16 * A)) - (y*(biggerScreen/(1600 * A)));
    
    var minPX: string;
    var maxPX: string;

    if(min < max){
      minPX = String(min) + "px";
      maxPX = String(max) + "px";
   } else {
      minPX = String(max) + "px";
      maxPX = String(min) + "px";
   }

   let signal: string = "";
   if (y<0){  signal = "-"; }
   if (y>=0){ signal = "+"; }
   let clampOut: string = `clamp(${minPX}, ${x.toFixed(4)}rem ${signal} calc(${Math.abs(0.01 * y).toFixed(6)} * min(${biggerScreen}px, 100vw)), ${maxPX})`;

    var ret: any = {};
    ret[cssProp] = clampOut;


  return ret
}




//===========================================================================================================================
//returns a style element to be used inside inline inside the style property style={Here goes the function}//
//the input is an array of properties so it's possible to clamp many properties in one go 
export const Clamps = (props: clampProps[]):  React.CSSProperties => {

var ret: any = {};
var minPX: string;
var maxPX: string;
const screenDiff: number = ((biggerScreen * B) - (smallerScreen * A));

for (let i = 0; i < props.length; i++){

    let fontDiff: number = ((props[i].max * B) - (props[i].min * A));
    let y: number = 100 * (fontDiff/screenDiff);
    let x: number = (props[i].max/(16 * A)) - (y*(biggerScreen/(1600 * A)));
    
    if(props[i].min < props[i].max){
      minPX = String(props[i].min/16) + "rem";
      maxPX = String(props[i].max/16) + "rem";
   } else {
      minPX = String(props[i].max/16) + "rem";
      maxPX = String(props[i].min/16) + "rem";
   }

   let signal: string = "";
   if (y<0){  signal = "-"; }
   if (y>=0){ signal = "+"; }
   let clampOut: string = `clamp(${minPX}, ${x.toFixed(4)}rem ${signal} calc(${Math.abs(0.01 * y).toFixed(6)} * min(${biggerScreen}px, 100vw)), ${maxPX})`;

    ret[props[i].cssProp] = clampOut;

}

return ret
}



//===========================================================================================================================
//returns a style element to be used inside inline inside the style property style={Here goes the function}//
//the input is an array of arrays so it's possible to clamp mutiple properties in one go
//[ ["the css Prop", value for minimum screenin px, value for max screen in px], [next propertie array... ], [...] ]
export const ClampsArray = (props: clampPropsArray[]):  React.CSSProperties => {

  var ret: any = {};
  var minPX: string;
  var maxPX: string;
  const screenDiff: number = ((biggerScreen * B) - (smallerScreen * A));
  
  
  for (let i = 0; i < props.length; i++){
  
      let fontDiff: number = ((props[i][2] * B) - (props[i][1] * A));
      let y: number = 100 * (fontDiff/screenDiff);
      let x: number = (props[i][2]/(16 * A)) - (y*(biggerScreen/(1600 * A)));

      if(props[i][1] < props[i][2]){
         minPX = String(props[i][1]) + "px";
         maxPX = String(props[i][2]) + "px";
      } else {
         minPX = String(props[i][2]) + "px";
         maxPX = String(props[i][1]) + "px";
      }

      let signal: string = "";
      if (y<0){  signal = "-"; }
      if (y>=0){ signal = "+"; }
      let clampOut: string = `clamp(${minPX}, ${x.toFixed(4)}rem ${signal} calc(${Math.abs(0.01 * y).toFixed(6)} * min(${biggerScreen}px, 100vw)), ${maxPX})`;

      /* let middle: string = String(x.toFixed(3)) + "rem" + " + " + String(y.toFixed(3)) + "vw";
      let clampOut: string = "clamp(" + minPX + "," +  middle + "," + maxPX + ")"; */
      ret[props[i][0]] = clampOut;
  
  }
  
  return ret
  }



//===========================================================================================================================
//returns a string to be used in a stylesheet code//
export const ClampX_Builder = (min: number, max: number, stopMax?: number, stopMin?: number, ratio?: number): string => {

  const screenDiff: number = ((biggerScreen * B) - (smallerScreen * A));
  const fontDiff: number = ((max * B) - (min * A));
  var y: number = 100 * (fontDiff/screenDiff);
  var x: number = (max/(16 * A)) - (y*(biggerScreen/(1600 * A)));
  
  if(ratio){
    min = min * ratio;
    max = max * ratio;
  }
  
  if(min <= max){
    var minPX: string = String(min) + "px";
    var maxPX: string = String(max) + "px";
  } else {
    var minPX: string = String(max) + "px";
    var maxPX: string = String(min) + "px";
  }

var signal: string = "";
 if (y<0){  signal = "-"; }
 if (y>=0){ signal = "+"; }
  
var clampOut: string = `clamp(${minPX}, ${x.toFixed(4)}rem ${signal} calc(${Math.abs(0.01 * y).toFixed(6)} * min(${biggerScreen}px, 100vw)), ${maxPX})`;
if(stopMax){clampOut = `min(${clampOut}, ${stopMax}px)`}
if(stopMin){clampOut = `max(${clampOut}, ${stopMin}px)`}

return clampOut
}

//===========================================================================================================================
export const FluidX = (min: number, middleScreen: number, middleFont: number | 'auto', max: number) => {

  
  if(middleFont == 'auto'){
    let alpha = (max - min)/(biggerScreen - smallerScreen);
    let beta = max - (alpha*biggerScreen);
    middleFont = (alpha * middleScreen) + beta;
  }

  let alpha = (A - B)/(biggerScreen - smallerScreen);
  let I = alpha*(middleScreen - biggerScreen) + A;

  //first step
  let screenDiff: number = ((middleScreen * B) - (smallerScreen * I));
  let fontDiff: number = ((middleFont * B) - (min * I));
  let y: number = 100 * (fontDiff/screenDiff);
  let x: number = (middleFont/(16 * I)) - (y*(middleScreen/(1600 * I)));
  
    let minPX: string = min.toFixed(3) + "px";
    let maxPX: string = middleFont.toFixed(3) + "px";

    let signal: string = "";
    if (y<0){  signal = "-"; }
    if (y>=0){ signal = "+"; }

    var step1: string = `clamp(${minPX}, ${x.toFixed(4)}rem ${signal} calc(${Math.abs(0.01 * y).toFixed(6)} * min(${middleScreen}px, 100vw)), ${maxPX})`;

  //second step
   screenDiff = ((biggerScreen * I) - (middleScreen * A));
   fontDiff = ((max * I) - (middleFont * A));
   y = 100 * (fontDiff/screenDiff);
   x = (max/(16 * A)) - (y*(biggerScreen/(1600 * A)));

    minPX = middleFont.toFixed(3) + "px";
    maxPX = max.toFixed(3) + "px";

    if (y<0){  signal = "-"; }
    if (y>=0){ signal = "+"; }

    var step2: string = `clamp(${minPX}, ${x.toFixed(4)}rem ${signal} calc(${Math.abs(0.01 * y).toFixed(6)} * min(${biggerScreen}px, 100vw)), ${maxPX})`;



return {step1, step2};
}



//===========================================================================================================================
export function clampY_Builder(
  minScreenHeight: number | 640 | 800 | 900 | 1080 | 1440 = 640, 
  maxScreenHeight: number | 640 | 800 | 900 | 1080 | 1440 = 1440, 
  minValue: number, 
  maxValue: number, 
  method: "clamp" | "calc" = "calc"): string {

let y: number = 100 * ((maxValue - minValue)/(maxScreenHeight - minScreenHeight));
let x: number = minValue - (y * 0.01 * minScreenHeight);

if(minValue <= maxValue){
  var minPX: string = String(minValue) + "px";
  var maxPX: string = String(maxValue) + "px";
} else {
  var minPX: string = String(maxValue) + "px";
  var maxPX: string = String(minValue) + "px";
}

let signal: string = "";
if (y<0){  signal = "-"; }
if (y>=0){ signal = "+"; }

if(method == "clamp"){
var output: string = `clamp(${minPX}, ${x.toFixed(4)}px ${signal} ${Math.abs(y).toFixed(4)}vh , ${maxPX})`
} else {
  var output: string = `calc( ${x.toFixed(4)}px ${signal} ${Math.abs(y).toFixed(4)}vh)`;
}

return output

}



//===========================================================================================================================
export function ClampY(
  cssProp: cssProps,
  minScreenHeight: number | 640 | 800 | 900 | 1080 | 1440 = 640, 
  maxScreenHeight: number | 640 | 800 | 900 | 1080 | 1440 = 1440, 
  minValue: number, 
  maxValue: number, 
  method: "calc" | "clamp" = "calc"): React.CSSProperties {

  let y: number = 100 * ((maxValue - minValue)/(maxScreenHeight - minScreenHeight));
  let x: number = minValue - (y * 0.01 * minScreenHeight);
  
  if(minValue <= maxValue){
    var minPX: string = String(minValue) + "px";
    var maxPX: string = String(maxValue) + "px";
  } else {
    var minPX: string = String(maxValue) + "px";
    var maxPX: string = String(minValue) + "px";
  }
  

  let signal: string = "";
  if (y<0){  signal = "-"; }
  if (y>=0){ signal = "+"; }
  
  if(method == "clamp"){
  var output: string = `clamp(${minPX}, ${x.toFixed(4)}px ${signal} ${Math.abs(y).toFixed(4)}vh , ${maxPX})`
  } else {
  var output: string = `calc(${x.toFixed(4)}px ${signal} ${Math.abs(y).toFixed(4)}vh)`;
  }

  var ret: any = {};
  ret[cssProp] = output;
  
  return ret
  
  }

  //===========================================================================================================================
  export function ClampXY(min: number, intersection: number, max: number){
    
    let widthClamp = ClampX_Builder(min, intersection);
    let heightClamp = clampY_Builder(640, 900, min, intersection, "calc");
    
    let output = `min(max(${widthClamp}, ${heightClamp}), ${max}px)`;
    return output;
  }




