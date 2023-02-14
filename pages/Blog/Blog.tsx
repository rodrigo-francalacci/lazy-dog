/* React */
import React from 'react'
import { useState } from 'react'

/* Styles */
import styles from './Blog.module.scss'

/* Components */
import ArticleCard from '../../components/ArticleCard/ArticleCard'
import SEO from '../../components/SEO/SEO'
import { BlogFilter } from '../../components/BlogFilter/BlogFilter'

/* Types */
import {list_of_postsProps} from '../../utils/sanity_queries'

const Blog = ({sanityPostsList}: any) => {

    const allPosts = format_List_of_posts(sanityPostsList)
    const [posts, setPosts] = useState<list_of_postsProps[]>(allPosts)

  return (
    <div className={styles.blogContainer}>
        {/* Head and metatags generator */}
        <SEO title='Blog' description='The Lazy Dog Company Blog. Handmade Dog Duvets. Duvet and Pillow Sets with Changeable, Washable Covers. Dog Beds. Just like yours… but smaller...' />

        <h2 className={`worksans-h2`}>Lazy Dog Blog</h2>

        <BlogFilter posts={allPosts} setPosts={setPosts}/>
        <ul className={styles.postListContainer}>
            {posts?.length > 0 && posts.map((item)=>{
                return(
                    <li key={item.slug}><ArticleCard title={item.title} thumbnail_URL={item.thumbnail_url} slug={item.slug}/></li>
                )
            })
            }
        </ul>
    </div>
  )
}

export default Blog

/* 
==================================================================================
DATA FETCHING
==================================================================================
*/

/* API */
import { mySanityClient } from '../../lib/sanityClient';
import { list_of_postsQuery, format_List_of_posts } from '../../utils/sanity_queries'

export async function getStaticProps() {

    //FROM SANITY
    //Get the list of posts from sanity
    const sanityPostsList = await mySanityClient.fetch(list_of_postsQuery);
    

  return {
   props: {
    sanityPostsList: sanityPostsList,
  }

 }
};