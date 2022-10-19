import React from "react"
import { ClampX_Builder, clampY_Builder, ClampXY, FluidX } from "../Clamp/Clamp"


function componentDidMount() {
/*   const $style = document.createElement("style");
  document.head.appendChild($style);
  $style.innerHTML = ""; */
}
const ThemeTypography = (): JSX.Element => {
  const s: number = 0.83;
  const b: number = 1.4;

  return (

    <style>
        {`   
            ${fontBuilder(//H2 => About us, Cart items
                ".worksans-h2", (22*s), 1440, 22, (22*b),
                {
                  fontFamily: "var(--font-worksans)",
                  fontWeight: "600",
                  textTransform: "capitalize",
                }
              )}

            ${fontBuilder(//Paragraph
              ".worksans-paragraph", 18*s, 1440, 18, 18*b,
              {
                fontFamily: "var(--font-worksans)",
                fontWeight: "400", lineHeight: "150%",
              }
            )}

            ${fontBuilder(//LOGO
              ".gooddog-logo", 45, 1440, 55, 80, 
              {
                fontFamily: "var(--font-gooddog)",
                fontWeight: "400", lineHeight: "normal",
              }
            )}
          
            ${fontBuilder(//TOP BANNER
              ".worksans-promobar", 17, 1920, 22, 27,
              {
                fontFamily: "var(--font-worksans)",
                fontWeight: "400", lineHeight: "120%",
              }
            )}
          
            ${fontBuilder(//NAVBAR
              ".worksans-navbar", 17, 1440, 18, 32,
              {
                fontFamily: "var(--font-worksans)",
                fontWeight: "400", lineHeight: "240%",
              }
            )}

            ${fontBuilder(//FOOTER TEXT
              ".worksans-footer-text", 13, 1440, 14, 26,
              {
                fontFamily: "var(--font-worksans)",
                fontWeight: "400", lineHeight: "190%",
              }
            )}

            ${fontBuilder(//FOOTER LINKS
              ".worksans-footer-links", 19, 1440, 21, 32,
              {
                fontFamily: "var(--font-worksans)",
                fontWeight: "400", lineHeight: "190%",
              }
            )}

            ${fontBuilder(//SMALL BUTTOM
              ".worksans-small-buttom", 10.5, 1440, 12, 17,
              {
                fontFamily: "var(--font-worksans)",
                fontWeight: "700", lineHeight: "120%",
                textTransform: "uppercase", letterSpacing: "0.2px",
              }
            )}

            ${fontBuilder(//BIG BUTTOM
              ".worksans-big-buttom", 13.5, 1440, 15, 19.8,
              {
                fontFamily: "var(--font-worksans)",
                fontWeight: "700", lineHeight: "120%",
                textTransform: "", letterSpacing: "0.2px",
              }
            )}

            ${fontBuilder(//ARTICLE CARD
              ".worksans-article-card", 14, 1440, 14.5, 21.5,
              {
                fontFamily: "var(--font-worksans)",
                fontWeight: "700", lineHeight: "110%",
              }
            )}

            ${fontBuilder(//PRODUCT ITEM
              ".worksans-product-component", 14, 1440, 18, 24,
              {
                fontFamily: "var(--font-worksans)",
                fontWeight: "600", lineHeight: "87%",
                textTransform: "capitalize",
              }
            )}


            ${fontBuilder(//PRODUCT PAGE
              ".worksans-product-page", 27*s, 1440, 27, 27*b,
              {
                fontFamily: "var(--font-worksans)",
                fontWeight: "700", lineHeight: "87%",
              }
            )}

            ${fontBuilder(//CART SUMMARY
              ".worksans-cart-summary", 10, 1440, 11, 17,
              {
                fontFamily: "var(--font-worksans)",
                fontWeight: "400",
              }
            )}

            ${fontBuilder(//CART ITEMS
              ".worksans-cart-items", (12.6*s), 1440, 12.6, (12.6*b),
              {
                fontFamily: "var(--font-worksans)",
                fontWeight: "700",
              }
            )}
          
            `}

    </style>
  )
}

export default ThemeTypography

//Typography builder function
//=============================================================================================================
type pair = {
  fontFamily?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textTransform?: string
  padding?: string;
}

function fontBuilder(className: string, min: number, middleScreen: number, middleFont: number | 'auto', max: number, props?: pair){

  let output: string = `
  ${className}{
    font-size: ${FluidX(min,middleScreen,middleFont,max).step1};
    font-family: ${props?.fontFamily ? props.fontFamily : "inherit"};
    font-weight: ${props?.fontWeight ? props.fontWeight : "unset"};
    line-height: ${props?.lineHeight ? props.lineHeight : "normal"};
    letter-spacing: ${props?.letterSpacing ? props.letterSpacing : "normal"};
    text-transform: ${props?.textTransform ? props.textTransform : "none"};
  } 
    @media screen and (min-width: ${middleScreen + 1}px) {
      ${className} {
        font-size: ${FluidX(min,middleScreen,middleFont,max).step2};
      }
    }
  `

  return output;

}





