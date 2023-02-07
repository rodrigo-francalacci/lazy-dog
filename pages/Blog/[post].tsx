/* React */
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'

/* API */
import { mySanityClient } from '../../lib/sanityClient';
import { singlePostQuery, list_of_postsQuery } from '../../utils/sanity_queries'

/* Styles */
import styles from './Post.module.scss'

/* Sanity */
import { sanityUrlFor } from "../../lib/sanityClient" //to get the url of an image

/* Components */
import { MdArrowLeft, MdArrowRight } from "react-icons/md";
import SEO from '../../components/SEO/SEO'
import ShareBot from '../../components/ShareBot/ShareBot'

/* Types */
import { singlePostProps, format_single_post } from '../../utils/sanity_queries'

/* Blog Component 
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
const Blog = ({sanitySinglePost, nextPostSlug, previousPostSlug}: any) => {

    //Format and type the properties
    const post: singlePostProps = format_single_post(sanitySinglePost);

    //Setting the image component for the images inside the <PortableText/> component
    //More information: https://www.sanity.io/docs/portable-text-to-react
    const myPortableTextComponents = {
        types: {
          image: ({value}: any) => 
          <div className={styles.imageContainer}>
              <Image 
                    src={sanityUrlFor(value)} 
                    alt={`${post.title} - Lazy Dog Company`}
                    layout='fill'
                    objectFit='cover'  />
         </div>,
        },
      
      }


/* JSX return
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    return (
        <div className={`worksans-blog-post ${styles.postContainer}`}>
            {/* Head and metatags generator */}
            <SEO title={post.title} description={post.description!} />

            {/* Title and author and date */}
            <h1>{post.title}</h1>
            <hr/>
            <div className={styles.head}>
                <div className={styles.postDetails}>
                    <span>by {post.author.name}</span>
                    <span>{post.date}</span>
                </div>
                <ShareBot title={post.title} text={post.description} className={styles.shareBot}/>
            </div>
            <hr/>

            {/* Body */}
            <article className={styles.bodyContainer}>
                <PortableText value={post.body} components={myPortableTextComponents} />
            </article>

            {/* List of tags */}
            <ul className={styles.tagList}>
                {post.tags?.length > 0 && post.tags.map(item =>{
                    return <li key={item}>#{item}</li>
                })}
            </ul>

            {/* More Posts Navigation */}
            
                <div className={`size-28 ${styles.morePosts}`}>
                    <Link href={`/Blog/${nextPostSlug}`}>
                        <a><MdArrowLeft size='4em' className={styles.arrowIcon}/></a>
                    </Link>
                    <span>More Posts</span>
                    <Link href={`/Blog/${previousPostSlug}`}>
                        <a><MdArrowRight size='4em' className={styles.arrowIcon}/></a>
                    </Link>
                </div>

            
        </div>
    )
    }

export default Blog

/* 
==================================================================================
DATA FETCHING
==================================================================================
*/

    //GETTING THE PATHS
    export async function getStaticPaths() {
        /* (1) Get the list of all posts (paths) 
        this website explains how we can catch all routes with sanity
        https://www.simeongriggs.dev/nextjs-sanity-slug-patterns*/
        //OBS: the param object key ("post:") and the file [post].tsx must have the samen name
        const paths = await mySanityClient.fetch(
            `*[_type == "post" && defined(slug.current)]{
                
                "params": {
                    "post": slug.current
                }
            }`
        )
    
        return {
            paths,
            fallback: false
        }
    }

    //GETTING THE PROPS
    export const getStaticProps = async ({ params }: any) => {
      const { post } = params;
      //FROM SANITY

      //(1) Get all the data about the post that will be displayed
      const sanitySinglePost = await mySanityClient.fetch(singlePostQuery, { post });
      
      //(2) Get the list of posts from sanity
      const sanityList_of_Posts = await mySanityClient.fetch(list_of_postsQuery);

      //(3) Find the next and the previous post for pagination
      const currentPostIndex: number = sanityList_of_Posts.findIndex((item: any) => item.slug.current === sanitySinglePost.slug.current);
      const lastIndex: number = sanityList_of_Posts.length -1;
      let previousPostIndex: number = 0;
      let nextPostIndex: number = 0;
  
            if(currentPostIndex == 0){
                previousPostIndex = 0;
            } else {
                previousPostIndex = currentPostIndex - 1;
            }

            if(currentPostIndex == lastIndex ){
                nextPostIndex = currentPostIndex;
            } else {
                nextPostIndex = currentPostIndex + 1;
            }

       const nextPostSlug = sanityList_of_Posts[nextPostIndex].slug.current;
       const previousPostSlug = sanityList_of_Posts[previousPostIndex].slug.current; 
        
      return {
      props: {
        sanitySinglePost: sanitySinglePost,
        nextPostSlug: nextPostSlug,
        previousPostSlug: previousPostSlug,
      }
    };
    }



    