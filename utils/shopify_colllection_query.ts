/*
- Google for "Shopify GraphiQL App" so you can learn how to have a
  preview of the data you are going to fetch.
- Check how to fetch the shopify metafields on 
  https://shopify.dev/api/admin-graphql/2022-10/objects/Metafield
- For more information ask the community
  https://community.shopify.com/c/shopify-community/ct-p/en
- In this page I created a a function to format each query response
  as well as a Type for the formated output. So we have a more friendly
  output to use the data.
*/


/* OBS: We are going to use the String.raw() method for all the queries.
The static String raw() method is so named as we can use it to get
the raw string form of template literals in JavaScript. 
Source:
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/raw
    https://codingbeautydev.com/blog/javascript-raw-string/
*/
const gql = String.raw 

/* QUERY FOR THE LIST OF COLLECTIONS
A list with the collections to fill up the navbar
---------------------------------------------------------------------*/
export const collectionsListQuery =gql`{
  collections(first: 100) {
    edges {
      node {
        position: metafield(namespace: "custom", key: "position") {
          value
        }
        title
        handle
        id
      }
    }
  }
}`

    //The Collection page Type
    export type collectionsListProps = {
      position: number;
      title: string;
      handle: string;
      id: string
      }

    //Formating the response of the list of collections query
    export function formatCollectionsListResponse(input: any){
    let output: collectionsListProps[] = []

    
    if(input.edges.length>0){
        input.edges.map((item: any) => {
        if(item.node.position.value == ""){item.node.position.value = "0"}
        output.push(
            {
            position: Number(item.node.position.value),
            title: item.node.title,
            handle: item.node.handle,
            id: item.node.id
            }
        )
        })

        output.sort((a, b) => (a.position > b.position) ? 1 : -1)
        return output;

    } else {
        return []
    }

    }


/* COLLECTION PAGE QUERY
We have to query: 
  1) A list of collections to fill up the navbar
  2) The information about the collection we are about to fetch
  3) The products inside the this collection and some of their information
So we will use the formatCollectionQueryResponse() function 
to take the response of the quey bellow and create 3 objects
{collectionsList, thisCollection, products}, for each of this 3
objects we will create a Type that is down bellow this query.
++++++++++++++++++++++++++++++++++++++++++++++++++*/

export function collectionPageQuery(collectionHandle: string){
const query =gql`query CollectionPage {

  collection(handle: "${collectionHandle}") {
    handle
    id
    title
    description
    descriptionPage: metafield(namespace: "custom", key: "collection_description") {
      value
    }
    image{
      url
    }
    products(first: 100, sortKey: COLLECTION_DEFAULT) {
      edges {
        node {
          title
          handle
          priceRange {
            minVariantPrice {
              amount
            }
          }
          shortDescription: metafield(namespace: "custom", key: "short_description") {
            value
          }
         collectionID: metafield(namespace: "custom", key: "collection") {
            value
          }  
          images(first: 1) {
            edges {
              node {
                url
              }
            }
          }
        }
      }
    }
  }
}
`
return query;
}


//This collection Type
export type thisCollectionProps = {
  descriptionPage: any;
  SEO_description: string,
  coverImageURL?: string;
  handle: string,
  title: string,
  id: string;   
}

export type productProps = {
  title: string;
  handle: string;
  thumbnail_URL: string;
  price: number | null;
  shortDescription: string;
  collectionID: string; 
  options: {
    name: string;
    values: any;
}[];
}


/* Format Home Query Response */
export function formatCollectionPageQueryResponse(response: any){


    //format the collection data
    let thisCollection: thisCollectionProps = {

    //If the object descriptionPage is null we return null, otherwise we return the data
    descriptionPage: response.data.collection.descriptionPage?.value ? response.data.collection.descriptionPage.value : null,
    
    //If the object image is null we return null, otherwise we return the data
    coverImageURL: response.data.collection.image?.url ? response.data.collection.image.url : null,
    
    SEO_description: response.data.collection.description,
    handle: response.data.collection.handle,
    title: response.data.collection.title,
    id: response.data.collection.id
  }

 
  //Format products in this collection
  let products: productProps[] =  [];
  response.data.collection.products.edges.map((item: any)=>{
    
    products.push({
      
      title: item.node.title,
      handle: item.node.handle,

      //if image, price or short description are empty we return null
      thumbnail_URL: item.node.images?.edges[0].node.url ? item.node.images.edges[0].node.url : null,
      price: item.node.priceRange.minVariantPrice?.amount ? Number(item.node.priceRange.minVariantPrice.amount) : null,
      shortDescription: item.node.shortDescription?.value ?  item.node.shortDescription.value: null,
      collectionID: collectionID_Builder(item.node.collectionID), options: [],

    })
  })


   //Format the collection ID
   function collectionID_Builder(collectionID_fromProduct: {value: string} | null){
    let id: string;
      //if we are in the homePage we will try to get the id of the collection this product belongs
      if(thisCollection.handle == "frontpage"){
        //if the user has set the product collection in the metafield we take it
        if (collectionID_fromProduct){
         
          //I am getting gid://shopify/Collection/425571549464 from shopify, so I'll
          //Buffer.from("gid://shopify/Collection/425571549464").toString('base64')
          // to get the id in this format ""Z2lkOi8vc2hvcGlmeS9Db2xsZWN0aW9uLzQyNTU3MTMyMDA4OA==""
          //more info: https://stackoverflow.com/questions/6182315/how-can-i-do-base64-encoding-in-node-js
          id = Buffer.from(collectionID_fromProduct.value).toString('base64') 

        //else, we will be forced to use the "frontpageID", 
        //and as a result of the product data that comes from it's collection won't be loaded
        } else {
          id = thisCollection.id
        }
      //if we are not in the homePage, we can just grab the ID directly from it's collection
      } else {
        id = thisCollection.id
      }
      return id
  }

return {thisCollection, products}
}


/* LIST OF ALL PRODUCTS QUERY
A list with the products handles for the [product].tsx dynamic path function
---------------------------------------------------------------------*/
    export const productsListQuery = gql`query Products {
      products(first:250) {
        edges {
          node {
            handle
          }
        }
      }
    }`

/* ALL PRODUCTS AND COLLECTIONS DATA QUERY
This Query returns all the collections with its properties and products
its usefull if you want to download all data in one go and store the data
inside redux. However this approach slow the home page loading and its not good
for SEO because the search engine can't look all the pages. So I ended up not using
this approach.
Keep reading to understand how I've treated the data to get the 
collection name also inside the products object.
---------------------------------------------------------------------*/
 export const FullCollectionsQuery =gql`{
  collections(first: 100) {
    edges {
      node {
        id
        title
        handle
        description
        position: metafield(namespace: "custom", key: "position") {
          value
        }
        descriptionPage: metafield(namespace: "custom", key: "collection_description") {
          value
        }
        image: metafield(namespace: "custom", key: "image") {
          reference{
            ... on MediaImage{
              image{
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
        products(first: 100) {
          edges {
            node {
              handle
              id
              title
              variants(first: 100) {
                edges {
                  node {
                    weight
                    weightUnit
                  }
                }
              }
              description
              options{
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
                reference{
                  ... on MediaImage{
                    image{
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
        }
      }
    }
  }
}`

    //Types for the formatFullCollectionsResponse() bellow
    export type CollectionsProps = {
    position: number;
    careInstructions:  string[];
    contentMaterials: string[];
    descriptionPage: string;
    details: string[];
    dimensions: string[];
    imageURL: string;
    SEO_description: string,
    shopifyHandle: string,
    shopifyID: string,
    title: string,
    productsIn: ProductsProps[];
    }

    export function formatFullCollectionsResponse(dataCollections: any): CollectionsProps[]{
    //setting the type for the collections
    let output: CollectionsProps[] = [];

    //checking if edges exists and then map
    dataCollections.edges.map( (item: any, index: number) =>{
        let node = item.node

        output.push({
        //We use the position to order (sort) the categories later.
        //if the position is missing it's going to assume position = 1 (placing the item just after the Home as a first category)
        position: node.position?.value ? Number(node.position.value) : 1,

        //If the user didn't se the Care Instructions it will return a empty array []
        //In case the user has set the Care Instructions we have to JSON.pare the API response to get an array output.
        careInstructions: node.careInstructions?.value ? JSON.parse(node.careInstructions.value) : [],
        
        //Same thing we did for the "Care instructions"
        contentMaterials: node.contentMaterials?.value ? JSON.parse(node.contentMaterials.value) : [],
        
        //This description is going to be used in the page (not in the meta for SEO)
        descriptionPage: node.descriptionPage?.value ? node.descriptionPage.value : "",

        //Same thing we did for the "Care instructions"
        details: node.details?.value ? JSON.parse(node.details.value) : [],

        //Same thing we did for the "Care instructions"
        dimensions: node.dimensions?.value ? JSON.parse(node.dimensions.value) : [],
        
        //If we don't have an image it's going to retunr the src for the "image-missing.jpeg"
        imageURL: node.image?.reference.image.url ? node.image.reference.image.url : '/images/image_missing.jpeg',
        
        //This is the description for the meta
        SEO_description: node.description,
        
        //Handle, ID, and Title of this category
        shopifyHandle: node.handle,
        shopifyID: node.id,
        title: node.title,
        
        /* We set the products initialy as an empty array
        because in the line bellow there is an specific function 
        to format the products response */ 
        productsIn: []
        })

        /*Now we can format the product response
        - First argument of the function is an array of all the products 
          in this collection (this information comes with the query)
        - Second argument is the collection name that we're going to insert inside 
          each product object (this information isn't in the original query response)*/
        output[index].productsIn = formatProductsResponse(node.products.edges, output[index] )
    })
    return output
    }

        //Types for the formatProductsResponse() bellow
        export type ProductsProps = {
        collection?: string;
        careInstructions: string[],
        contentMaterials: string[],
        dimensions: string[],
        shortDescription: string,

        //we want to concatenate the general collection details and the product details
        details: string[],
        
        //If there is no thumbnail selected by the client we're gonna use the last image of the product
        checkoutThumbnailURL: string,
        
        //add the collection image to the set of images of this product
        imagesURL: string[], 

        //Weight
        weight: {value: number, unit: string}[],
        
        //The description we are going to use in the meta tags 
        SEO_description: string,
        
        shopifyHandle: string,
        shopifyID: string,
        title: string,

        //These two last types comes from the shopify data structure
        priceRange: {
            maxVariantPrice: {
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

        //
        export function formatProductsResponse(productsEdges: any[], parentCollection: CollectionsProps): ProductsProps[]{
        
        //setting the type for the collections response
        let output: ProductsProps[] = [];

        // check if we have products an then map the products to format the data
        productsEdges.length > 0 && productsEdges.map((item: any) => {
            
            let productNode = item.node;
        
            //map the images url's of the product
            let imagesURL: string[] = [];
            if (productNode.images.edges.length > 0){

                productNode.images.edges.map((imgEdge: any)=>{
                imagesURL.push(imgEdge.node.url)
                })
              
            } else if (parentCollection.imageURL){
            if(parentCollection.imageURL !== "") {imagesURL.push(parentCollection.imageURL)};
            }

            //map the weight for the variants
            let weight: {value: number, unit: string}[] = [];
            if (productNode.variants.edges.length > 0){

                productNode.variants.edges.map((variantEdge: any)=>{
                  weight.push({value: variantEdge.node.weight, unit: variantEdge.node.weightUnit})
                })
                
            } else {
                weight = [{value: 0, unit: "kg"}]
            }
        
        
            output.push({
                
                //add the collection that this product belongs to
                collection: parentCollection.title,
                
                //if the user don't set this fields we're gonna take them from it's collection
                careInstructions: productNode.careInstructions?.value ? JSON.parse(productNode.careInstructions.value) : parentCollection.careInstructions,
                contentMaterials: productNode.contentMaterials?.value ? JSON.parse(productNode.contentMaterials.value) : parentCollection.contentMaterials,
                dimensions: productNode.dimensions?.value ? JSON.parse(productNode.dimensions.value) : parentCollection.dimensions,
                shortDescription: productNode.shortDescription?.value ? productNode.shortDescription.value : parentCollection.title,
        
                //we want to concatenate the general collection details and the product details
                details: productNode.details?.value ? JSON.parse(productNode.details.value).concat(parentCollection?.details) : parentCollection.details,
                
                //If there is no thumbnail selected by the client we're gonna use the last image of the product
                checkoutThumbnailURL: productNode.checkoutThumbnailURL?.reference.image.url ? productNode.checkoutThumbnailURL.reference.image.url : imagesURL[imagesURL.length - 1],
                
                //add the collection image to the set of images of this product
                imagesURL: parentCollection?.imageURL ? [...imagesURL, parentCollection?.imageURL] : imagesURL, 

                //Weight
                weight: weight,
                
                //The description we are going to use in the meta tags 
                SEO_description: productNode.description,
                
                shopifyHandle: productNode.handle,
                shopifyID: productNode.id,
                title: productNode.title,

                priceRange: productNode.priceRange,
                options: productNode.options,
            })
        })

        return output
        
        }


  