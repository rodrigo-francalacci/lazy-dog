//Sanity Formating
import { sanityUrlFor } from "../lib/sanityClient" //to get the url of an image
import moment from 'moment';

//Types
import { productProps } from "./shopify_colllection_query";
import { collectionsListProps } from "./shopify_colllection_query";

/* Good GROQ reference for fetching data from sanity
https://hdoro.dev/learn-groq 
*/

/* QUERY FOR THE LIST OF CATEGORIES
A list with the categories to fill up the navbar
---------------------------------------------------------------------*/
export const categoriesListQuery =`*[_type == 'siteSettings'][0]{
  categoriesList[]->{title, slug{current}, _id}
}`

//Formating the response of the list of collections query
export function formatCategoriesListResponse(input: any){
let output: collectionsListProps[] = []

if(input.categoriesList.length>0){
    input.categoriesList.map((item: any, index: number) => {
    
    output.push(
        {
        position: index + 1,
        title: item.title,
        handle: item.slug.current,
        id: item._id
        }
    )
    })

    output.sort((a, b) => (a.position > b.position) ? 1 : -1)
    return output;

} else {
    return []
}

}

/* THIS CATEGORY/COLLECTION QUERY
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
export function categoryPageQuery(category_slug: string){
  return `*[_type == 'categories' && slug.current == "${category_slug}"][0]{
    description,
    SEO_description,
    heroImage,
    slug{current},
    title,
    _id
  }`
}

//Get the type for the collection props, it has to be the same as in Shopify
import { thisCollectionProps } from "./shopify_colllection_query";

export function formatCategoryPageQueryResponse(input: any){
  let output: thisCollectionProps;
  
  output = {
    descriptionPage: input.description,
    SEO_description: input.SEO_description,
    coverImageURL: sanityUrlFor(input.heroImage),
    handle: input.slug.current,
    title: input.title,
    id: input._id,
  }

  return output
}

/* QUERY LIST OF BLOG POSTS
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
//Query list of posts and order starting from the last post to displ
export const list_of_postsQuery = `*[_type in ["post"]]| order(publishedAt){
    slug{current},
    title,
    thumbnail,
  }
  `
    //Type for each posts in the list
    export type list_of_postsProps = {
      slug: string; title: string; thumbnail_url: string;
    }

    //Formating and typing the output of sanity query
    export function format_List_of_posts(input: any[]){
      let output: list_of_postsProps[] = [];

      input.length > 0 && input.map((item)=>{
        output.push({
          slug: item.slug.current,
          title: item.title,
          thumbnail_url: sanityUrlFor(item.thumbnail),
        })
      })

      return output
    }

/* HOME HERO  QUERY
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
//Query to get the Home Hero 
export const homeHero_Query = `{
  'sitesettings': *[_type == 'siteSettings'][0]{
    description
  },  
  'showcase': *[_type == 'showcase'][0]{
    heroTitle,
    heroDescription,
    heroImage
  }
}`
    //Types
    export type homeHeroProps = {
      heroTitle: string, heroDescription: any, heroImageURL: string, homeDescription: string
    }

    //Formating and typing the output of sanity query
    export function format_homeHero(input: any){
      let output: homeHeroProps;

      output = {
        heroTitle: input.showcase.heroTitle,
        heroDescription: input.showcase.heroDescription,
        heroImageURL: sanityUrlFor(input.showcase.heroImage),
        homeDescription: input.sitesettings.description
      }
      
      return output
    }

/*PRODUCTS IN CATEGORY
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
//Query to get the list of products in the home showcase
export const productsShowcaseQuery = `*[_type == 'showcase'][0]{
  products[]->{title, slug{current}, images[0], price, shortDescription, categories[0]->{_id, slug}}
}`

//Query to get the list of products from any other category
export function productsInCategoryQuery(category: string){
  return `*[_type == 'products' && '${category}' in categories[]->slug.current]{
    title, slug{current}, images[0], price, shortDescription, categories[0]->{_id, slug} 
  }`
}

//Formating and typing the output of sanity query
export function format_productsInCategory(input: any){
  

  let output: productProps[];

  output = input.products?.length > 0 && input.products.map((item: any)=>{
      return{
        title: item.title,
        handle: item.slug.current,
        thumbnail_URL: sanityUrlFor(item.images),
        price: item.price,
        shortDescription: item.shortDescription,
        collectionID: item.categories.slug.current
      }
    })

  return output
}


/*SINGLE PRODUCT
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
//Query to information about a single product
export function singleProductQuery(category: string, product: string){
  return `*[_type == 'products' && slug.current == '${product}' && '${category}' in categories[]->slug.current][0]{
  categories[0]->{_id, slug, title, images, careIntructions, contentMaterials, dimensions, details},
  title,                                    
  careInstructions, contentMaterials, dimensions, details,
  slug{current}, 
  images, 
  price,
  weight,
  variants,
  shortDescription, SEO_description,  
  _id  
  }`
}


import { singleProductProps } from "./shopify_product_query";
export function formatSanitySingleProduct(input: any){

  function careInstructionsBuilder(){
    let out: string[] = []
    if(input.careInstructions){
      out = input.careInstructions
    } else {
      if(input.categories.careIntructions){out = input.categories.careIntructions}
    }
    return out
  }

  function contentMaterialsBuilder(){
    let out: string[] = []
    if(input.contentMaterials){
      out = input.contentMaterials
    } else {
      if(input.categories.contentMaterials){out = input.categories.contentMaterials}
    }
    return out
  }

  function dimensionsBuilder(){
    let out: string[] = []
    if(input.dimensions){
      out = input.dimensions
    } else {
      if(input.categories.dimensions){out = input.categories.dimensions}
    }
    return out
  }


  function detailsBuilder(){
    let out: string[] = [];

    //get product details
    input.details?.length > 0 && input.details.map((item: any)=>{
      out.push(item)
    })

    //get category details
    input.categories.details?.length > 0 && input.categories.details.map((item: any)=>{
      out.push(item)
    })

    return out
  }

  function imagesURLBuilder(){

    var output: string[] = [];

    //add all images of this product
    input.images?.length > 0 && input.images.map( (item: string) => {
      output.push(sanityUrlFor(item))
    })

    //add the images of the category of this product that should show up in all products of this category
    input.categories.images?.length > 0 && input.categories.images.map( (item: string) => {
      output.push(sanityUrlFor(item))
    })

    //if images are missing we return a "missing image"
    if(output.length === 0){
      output.push('/images/image_missing.jpeg')
    }

    return output
  }

  function priceRangeBuilder(){

      let prices: number[] = [];

      /* if we have variants we will map all the variants and options
      to get all the prices*/  
      if(input.variants){

        input.variants.map((variant: any)=>{
          variant.options.map((option:any)=>{
            prices.push(option.price)
          })
        })

      /* if we don't have variants the min and max are the same
      and we'll get them from the */
      } else {
        prices.push(input.price);
        prices.push(input.price);
      }

      //Sort the prices to get the max and min
      prices.sort(function(a, b){return a - b});

      return {
        maxVariantPrice: {
            amount: (input.price + prices[prices.length-1]).toString(),
        },
        normalPrice:{
            amount: input.price.toString(),
        },
        minVariantPrice: {
            amount: (input.price + prices[0]).toString(),
        },
    }

  }

  function optionsBuilder(){

    let output:{name: string, values: any}[] = [];
    
    //If we have variants
    if(input.variants){

      input.variants.map((variant: any)=>{
        output.push({
          name: variant.name,
          values: variant.options.map((option: any)=>{
            return {
              option: option.option,
              price: option.price,
              weight: option.weight ? option.weight : null,
              id: option._key
            }
          })
        })
      })
      
    } else {return []}

    //If we don't have variants the array will remain empty

    return output

  }
  

  let prod: singleProductProps = {
    collection: input.categories.title,
    careInstructions: careInstructionsBuilder(),
    contentMaterials: contentMaterialsBuilder(),
    dimensions: dimensionsBuilder(),
    shortDescription: input.shortDescription ? input.shortDescription : input.categories[0].title,
    details: detailsBuilder(),
    imagesURL: imagesURLBuilder(),
    weight: [{value: input.weight, unit: 'kg'}],
    SEO_description: input.SEO_description,
    handle: input.slug.current,
    id: input._id,
    title: input.title,
    priceRange: priceRangeBuilder(),
    options: optionsBuilder(),
    checkoutThumbnailURL: sanityUrlFor(input.images[input.images.length -1])
}


return prod
}

    

/* ABOUT US QUERY 
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
export const aboutUsQuery = `*[_type == 'siteSettings'][0]{
  aboutUs
}`

export type aboutUsProps = {
  text:  any; imageURL: string
}

export function format_aboutUs(input: any){
  const output: aboutUsProps ={
    text: input.aboutUs.text,
    imageURL: sanityUrlFor(input.aboutUs.image),
  }
  return output
}

/* SINGLE POST QUERY
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
/* the $slug is passed as a parameter in the query */
export const singlePostQuery = `*[_type == "post" && slug.current == $post][0]{
  slug,
  title,
  author->{name, bio, image, website},
  tags[]->{title},
  thumbnail,
  body,
  publishedAt,
  description
}`

//Type for each posts in the list
export type singlePostProps = {
  title: string; thumbnail_url: string; tags: string[]; date: string; body: any; description: string;
  author:{
    name: string;
    bio: string;
    imageURL: string;
    website: string;
  }

}

//Formating and typing the output of sanity query
export function format_single_post(input: any){
  let output: singlePostProps;

  output = {
    title: input.title,
    thumbnail_url: sanityUrlFor(input.thumbnail),
    tags: input.tags?.length && input.tags.map((item: any)=>{
      return item.title
    }),
    date: moment(input.publishedAt, "YYYY-MM-DD").format("MMMM Do YYYY"),
    body: input.body,
    author: {
      name: input.author.name,
      bio: input.author.bio,
      website: input.author.website,
      imageURL: sanityUrlFor(input.author.image),
    },
    description: input.description

  }

  return output
}

/* CONTACT LIST QUERY 
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
export const contactListQuery = `*[_type == "siteSettings"][0]{contactsList[]{_key, type, contact}}`


export type contactListProps = {
    key: string; type: string; contact: string
}


export function format_contactList(input: any){
  
  let output: contactListProps[] = input.contactsList?.length > 0 && input.contactsList.map((item: any)=>{
    return{
      key: item._key,
      type: item.type,
      contact: item.contact
    }
  })
  return output
}

/* DOGS FRIENDS QUERY 
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
export const dogsFriendsQuery = `*[_type == "dogFriend"]{_id, name, bio, image, instagram}`


export type dogsFriendsProps = {
  id?: string; name: string; bio: string; imageURL: string, instagram?: string
}


export function format_dogsFriends(input: any){
  const output: dogsFriendsProps[] = input?.length > 0 &&  input.map((item: any)=>{
    return{
      id: item._id,
      name: item.name,
      bio: item.bio,
      imageURL: sanityUrlFor(item.image),
      instagram: item.instagram
    }
  })
return output
}

/* QUERY LIST LAYOUT PROPS (Banners, footer text, etc..) 
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
export const layoutQuery = `{
	'sitesettings': *[_type == 'siteSettings'][0]{
       title, description, 
       contactsList, socialMedias,
       footerText, productsSource
  },
  
  'banners': *[_type == 'banners']{
       text,
       link,
       color,
       timer
    }
}`

    //Types for each banner item
    export type bannerItemProps = {
      text: string; url?: string; theme: string; duration?: number;
    };

    //Formating and typing the output of sanity query
    export function formatBannerItems(input: any){
      let output: bannerItemProps[] = [];
      input.length > 0 && input.map((item: any)=>{
        output.push({
          text: item.text,
          url: item.link,
          theme: `promoBar-theme-${item.color.toLowerCase()}`,
          duration: item.timer
        })
      })

      return output
    }

     //Types for the siteSettings
     export type siteSettingsProps = {

        title: string;
        description: string;
        footerText: string;
        productsSource: string;

        contactsList: {
          type: string;
          contact: string;
        }[],

        socialMedias: {
          name: string;
          link: string;
        }[],


    };

    //Formating and typing the output siteSettings sanity query
    export function formatSiteSettings(input: any){

      let output: siteSettingsProps ={

        title: input.title,
        description: input.description,
        footerText: input.footerText,
        productsSource: input.productsSource,

        contactsList: input.contactsList.map((item: any)=>{

          return { 
            type: item.type,
            contact: item.contact
          }  

        }),

        socialMedias: input.socialMedias.map((item: any)=>{

          return { 
            name: item.name,
            link: item.link
          }  

        }),

      }

      return output

    }



//Query list of posts and order starting from the last post
/* export const singlePost = `{
	'sitesettings': *[_type == 'siteSettings'][0]{
       title, description, 
       contactsList, socialMedias,
       footerText, aboutUs
  },
  
  'banners': *[_type == 'banners']{
       text,
       link,
       color,
       timer
    }
}` */