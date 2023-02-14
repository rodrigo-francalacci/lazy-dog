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



//Filter Function
export function filterProducts({products, variants}:{products: productProps[], variants: Variant[]}) {

    let filtered_products: productProps[] = []
    

    products.map((product)=>{
      if(filter({product, variants}) === true){
        filtered_products.push(product)
      }
    });

    //sort the result
filtered_products = sortItems({array: filtered_products, basedOn:'handle'})
    
    function sortItems({
        array,
        basedOn,
      }: {
        array: productProps[];
        basedOn: "handle" | "price";
      }) {
        let output = array;
        if (basedOn === "handle") {
          output = array.sort((a, b) => (a.handle! > b.handle! ? 1 : -1));
        }
        if (basedOn === "price") {
          output = array.sort((a, b) => (a.price! > b.price! ? 1 : -1));
        }
        return output;
      }


    return filtered_products;
  }


  //Filter this product function
  //======================================
   function filter({product, variants}:{product: productProps, variants: Variant[]}) {
    //Loop the variants...   
    if(variants){
     for (let index = 0; index < variants.length; index++) {
        let _variant = variants[index];
        //If it fails one filter we don't need to check the other variants
        if(filterVariant(_variant) === false){
         return false
       }
     }

     return true
    }
      //Filter this variant
      //===========================
      function filterVariant(variant: Variant){
        //if the filter for this variant is active
        if (variant.filterActive) {
          //Check if this product has this variant
          let i = product.options.findIndex(
            (product_variant) => product_variant.name === variant.name
          );
          
          //if the product have the variant
          if (i > -1) {
      
            //loop the selecteds options
            for (let n = 0; n < variant.options.length; n++) {
       
                //search if the product has this selected option
                for (let k = 0; k < product.options[i].values.length; k++) {
      
                  let productValues = product.options[i].values
                  if ((variant.options[n].name === productValues[k].option) && (variant.options[n].state === true)) {
                   /*  console.log(`${product.title} - product has the variant and one of the selected options`) */
                    return true;
                  }
                  
                }
            }
              
      
            /* console.log(`${product.title} - product has the variant but no selected options`) */
            return false;
      
            //If the product does not have the variant
          } else {
            /* console.log(`${product.title} - product has not the variant`) */
            return false;
          }
        } else {
          /* console.log(`${product.title} - filter is not active`) */
          return true
        }// End Checking if this filter is active
      
        }
   
     /* console.log(`${product.title} - chegou aqui???`) */
     return true
   }