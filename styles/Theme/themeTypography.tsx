import React from "react"
import { FluidX } from "../Clamp/Clamp"


const ThemeTypography = (): JSX.Element => {
  const s: number = 0.83;
  const b: number = 1.4;

  return (

    <style>
        {`   
            ${fontBuilder(//H2 => About us, Cart items
                ".worksans-h2", (21), 1440, 24, (23*b),
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
              ".worksans-navbar", 18, 1440, 21, 32,
              {
                fontFamily: "var(--font-worksans)",
                fontWeight: "400", lineHeight: "120%",
              }
            )}

            ${fontBuilder(//SIDEBAR
              ".worksans-sidebar", 15, 1440, 18, 32,
              {
                fontFamily: "var(--font-worksans)",
                fontWeight: "400", lineHeight: "normal",
              }
            )}

            ${fontBuilder(//TOAST
              ".worksans-toast", 14, 1440, 15, 18,
              {
                fontFamily: "var(--font-worksans)",
                fontWeight: "600", lineHeight: "130%",
              }
            )}

            ${fontBuilder(//FOOTER TEXT
              ".worksans-footer", 16, 1440, 16, 26,
              {
                fontFamily: "var(--font-worksans)",
                fontWeight: "400", lineHeight: "170%",
              }
            )}

            ${fontBuilder(//SMALL BUTTOM
              ".worksans-small-buttom", 14, 1440, 15, 18,
              {
                fontFamily: "var(--font-worksans)",
                fontWeight: "700", lineHeight: "150%",
                textTransform: "uppercase", letterSpacing: "0.2px",
              }
            )}

            ${fontBuilder(//BIG BUTTOM
              ".worksans-big-buttom", 15, 1440, 17, 21,
              {
                fontFamily: "var(--font-worksans)",
                fontWeight: "700", lineHeight: "120%",
                textTransform: "", letterSpacing: "0.2px",
              }
            )}

            ${fontBuilder(//HERO
              ".worksans-hero", 20, 1440, 40, 75,
              {
                fontFamily: "var(--font-worksans)",
                fontWeight: "400", lineHeight: "120%",
              }
            )}

            ${fontBuilder(//ARTICLE CARD
              ".worksans-article-card", 14, 1440, 14.5, 21.5,
              {
                fontFamily: "var(--font-worksans)",
                fontWeight: "700", lineHeight: "110%",
              }
            )}

            ${fontBuilder(//DOG FRIEND CARD
              ".worksans-dogfriend-card", 15, 1440, 15, 24,
              {
                fontFamily: "var(--font-worksans)",
                fontWeight: "400", lineHeight: "150%",
              }
            )}

            ${fontBuilder(//PRODUCT ITEM
              ".worksans-product-card", 14, 1440, 18, 24,
              {
                fontFamily: "var(--font-worksans)",
                fontWeight: "600", lineHeight: "110%",
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
              ".worksans-cart-summary", 12, 1440, 11, 17,
              {
                fontFamily: "var(--font-worksans)",
                fontWeight: "400",
              }
            )}

            ${fontBuilder(//CART ITEMS
              ".worksans-cart-items", (15), 1440, 15, (15*b),
              {
                fontFamily: "var(--font-worksans)",
                fontWeight: "700",
              }
            )}

            ${fontBuilder(//BLOG -> POST
              ".worksans-blog-post", (15), 1440, 17, (22),
              {
                fontFamily: "var(--font-worksans)",
                fontWeight: "400", lineHeight: "160%",
              }
            )}

            ${fontBuilder(//CONTACTS
              ".worksans-contacts", (15), 1440, 18, (30),
              {
                fontFamily: "var(--font-worksans)",
                fontWeight: "400", lineHeight: "160%",
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





