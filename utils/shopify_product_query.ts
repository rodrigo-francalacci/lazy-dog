/* PRODUCT PAGE QUERY
We have to query: 
  1) The information about the collection we are about to fetch
  3) The products inside the this collection and some of their information
S after fetching we will use the formatCollectionQueryResponse() function 
to take the response of the queries and create 2 objects
{thisCollection, products}, for each of this 2
objects we will create a Type that is down bellow this query.
++++++++++++++++++++++++++++++++++++++++++++++++++*/

/* OBS: We are going to use the String.raw() method for all the queries.
The static String raw() method is so named as we can use it to get
the raw string form of template literals in JavaScript. 
Source:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/raw
    https://codingbeautydev.com/blog/javascript-raw-string/
*/
const gql = String.raw 


export function productPageQuery(shopifyCollectionID: string, productHandle: string){
    
  
  const query =gql`query ProductPage {

        collection(id: "${shopifyCollectionID}") {
          title
          image: metafield(namespace: "custom", key: "image") {
            reference {
              ... on MediaImage {
                image {
                  url
                }
              }
            }
          }
          dimensions: metafield(namespace: "custom", key: "dimensions") {
            value
          }
          details: metafield(namespace: "custom", key: "details") {
            value
          }
          contentMaterials: metafield(namespace: "custom", key: "content_and_materials") {
            value
          }
          careInstructions: metafield(namespace: "custom", key: "care_instructions") {
            value
          }
        }
        product(handle: "${productHandle}") {
          title
          handle
          id
          variants(first: 100) {
            edges {
              node {
                weight
                weightUnit
              }
            }
          }
          description
          options {
            name
            values
          }
          priceRange {
            minVariantPrice {
              amount
            }
            maxVariantPrice {
              amount
            }
          }
          shortDescription: metafield(namespace: "custom", key: "short_description") {
            value
          }
          details: metafield(namespace: "custom", key: "details") {
            value
          }
          contentMaterials: metafield(namespace: "custom", key: "content_and_materials") {
            value
          }
          careInstructions: metafield(namespace: "custom", key: "care_instructions") {
            value
          }
          dimensions: metafield(namespace: "custom", key: "dimensions") {
            value
          }
          checkoutThumbnailURL: metafield(namespace: "custom", key: "checkout_thumbnail") {
            reference {
              ... on MediaImage {
                image {
                  url
                }
              }
            }
          }
          images(first: 200) {
            edges {
              node {
                url
              }
            }
          }
        }
      }
      `
    return query;
    }

//Types
 export type singleProductProps = {
    collection?: string;
    careInstructions: string[],
    contentMaterials: string[],
    dimensions: string[],
    shortDescription: string,

    //we want to concatenate the general collection details and the product details
    details: string[],
    
    //If there is no thumbnail selected by the client we're gonna use the last image of the product
    checkoutThumbnailURL: string | undefined,
    
    //add the collection image to the set of images of this product
    imagesURL: string[], 

    //Weight
    weight: {value: number, unit: string}[],
    
    //The description we are going to use in the meta tags 
    SEO_description: string,
    
    handle: string,
    id: string,
    title: string,

    //These two last types comes from the shopify data structure
    priceRange: {
        maxVariantPrice: {
        amount: string
        }
        normalPrice: {
          amount: string
        }
        minVariantPrice: {
        amount: string
        }
    },
    options: {
        name: string, 
        values: any
    }[],  
    }

    //Function to format and type the output
    export function formatProductPageQuery(response: any){

        let collectionData = response.data.collection
        let productData = response.data.product

        function careInstructionsBuilder(){
            let fromCollection = collectionData.careInstructions?.value ? JSON.parse(collectionData.careInstructions.value) : [];
            //if the user don't set this fields we're gonna take them from it's collection
            let output: string[] = productData.careInstructions?.value ? JSON.parse(productData.careInstructions.value) : fromCollection
            return output
        }

        function contentMaterialsBuilder(){
            let fromCollection = collectionData.contentMaterials?.value ? JSON.parse(collectionData.contentMaterials.value) : [];
            //if the user don't set this fields we're gonna take them from it's collection
            let output: string[] = productData.contentMaterials?.value ? JSON.parse(productData.contentMaterials.value) : fromCollection;
            return output
        
        }
        function dimensionsBuilder(){
            let fromCollection = collectionData.dimensions?.value ? JSON.parse(collectionData.dimensions.value) : [];
            //if the user don't set this fields we're gonna take them from it's collection
            let output: string[] = productData.dimensions?.value ? JSON.parse(productData.dimensions.value) : fromCollection
            return output
        }
        function detailsBuilder(){
            let fromCollection = collectionData.details?.value ? JSON.parse(collectionData.details.value) : [];
            //we want to concatenate the general collection details and the product details
            let output: string[] = productData.details?.value ? JSON.parse(productData.details.value).concat(fromCollection) : fromCollection
            return output
        }

        function imagesURLBuilder(){
            //First we will grab the collection image, because this image should show up in all products of this collection
            //If we don't have an image it's going to return the src for the "image-missing.jpeg"
            let collectionImgURL =  collectionData.image?.reference.image.url ? collectionData.image.reference.image.url : '/images/image_missing.jpeg';

            //map the images url's of the product
            let imagesURL: string[] = [];
            if (productData.images.edges.length > 0){
                productData.images.edges.map((imgEdge: any)=>{
                imagesURL.push(imgEdge.node.url)
                })
            } else if (collectionImgURL){
            if(collectionImgURL !== '/images/image_missing.jpeg') {imagesURL.push(collectionImgURL)};
            }

            imagesURL.push(collectionImgURL)
            return imagesURL
        }

        function weightBuilder(){
            //map the weight for the variants
            let weight: {value: number, unit: string}[] = [];
            if (productData.variants.edges.length > 0){
                productData.variants.edges.map((variantEdge: any)=>{
                  weight.push({value: variantEdge.node.weight, unit: variantEdge.node.weightUnit})
                })
                
            } else {
                weight = [{value: 0, unit: "kg"}]
            }
            return weight;
        }

        let prod: singleProductProps = {
            collection: collectionData.title,
            careInstructions: careInstructionsBuilder(),
            contentMaterials: contentMaterialsBuilder(),
            dimensions: dimensionsBuilder(),
            shortDescription: productData.shortDescription?.value ? productData.shortDescription.value : collectionData.title,
            details: detailsBuilder(),
            imagesURL: imagesURLBuilder(),
            weight: weightBuilder(),
            SEO_description: productData.description,
            handle: productData.handle, //shopifyHandle
            id: productData.id, //shopifyID
            title: productData.title,
            priceRange: productData.priceRange,
            options: productData.options,
            checkoutThumbnailURL: productData.checkoutThumbnailURL?.reference.image.url ? productData.checkoutThumbnailURL.reference.image.url : undefined,
        }

        return {prod}

    }