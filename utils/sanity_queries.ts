import { sanityUrlFor } from "../lib/sanityClient" //to get the url of an image
import moment from 'moment';
/* Good GROQ reference for fetching data from sanity
https://hdoro.dev/learn-groq 
*/


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

/* HOME HERO AND SHOWCASE PRODUCTS QUERY
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
//Query list of posts and order starting from the last post to displ
export const homeHero_and_showcase_Query = `*[_type == 'showcase'][0]{
  heroTitle,
  heroDescription,
  heroImage,
  products[]->{title, price, images[0]}
}`
    //Types
    export type homeHero_and_showcaseProps = {
      heroTitle: string, heroDescription: any, heroImageURL: string, products?: {title: string, price: number, thumbnailURL: string}[]
    }

    //Formating and typing the output of sanity query
    export function format_homeHero_and_showcase(input: any){
      let output: homeHero_and_showcaseProps;

      output = {
        heroTitle: input.heroTitle,
        heroDescription: input.heroDescription,
        heroImageURL: sanityUrlFor(input.heroImage),
        products: input.products?.length > 0 && input.products.map((item: any)=>{
          return{
            title: item.title,
            price: item.price,
            thumbnailURL: sanityUrlFor(item.images)
          }
        })
      }

      return output
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
       footerText,
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