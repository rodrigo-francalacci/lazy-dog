/* React/NextJS */
import React, { useEffect } from "react";
import { useState } from "react";

/* Style */
import css from "./BlogFilter.module.scss";

/* Components */
import SwiperLogic from "../SwiperLogic/SwiperLogic";

/* Types */
import { list_of_postsProps } from "../../utils/sanity_queries";

type BlogFilterProps ={
    posts: list_of_postsProps[],
    setPosts: React.Dispatch<React.SetStateAction<list_of_postsProps[]>>
}


export const BlogFilter = ({posts, setPosts}:BlogFilterProps) => {

    const[tags, setTags] = useState<string[]>(null!)
    const[currentTag, setCurrentTag] = useState<string>(null!)

    /* LOADING FUNCTIONS
  ================================================================ */
  useEffect(()=>{
    if(posts){
        let output: string[] = [];
        posts?.length > 0 && posts.map((post)=>{
            post.tags?.length > 0 && post.tags.map((tag)=>{
                let index = output.findIndex((e) => e === tag);
                if(index === -1){
                    output.push(tag)
                }
            })
        })
        setTags(output);
    }
  },[posts])


  /* AUX Functions
  ================================================================ */
  function A(input: any){
      return JSON.stringify(input)
  }

  function filter(tag: string){
      const out: list_of_postsProps[] = [];
      
      posts?.length > 0 && posts.map(post=>{

          post.tags?.length > 0 && post.tags.map(postTag=>{
              if(postTag === tag){
                  out.push(post)
              }
          })

      })

      return out
  }

  /* JSX Return
  ================================================================ */
  return (
    <div className={css.container}>
         <SwiperLogic transition_time="300ms" transition_style="ease-out" snap_in={false} min_swipe_required={30}>
           {/* Items list */}
           <ul datatype={A(["slides-container"])} className={css.list}>
               <li datatype={A(["slide"])} className={css.list_item}>
               <span 
                            className={css.allTags}
                            onClick={()=>{setPosts(posts); setCurrentTag(null!)}}>All Posts</span>
               </li>

             {tags?.length > 0  && tags.map((item, idx)=>{
               return (
                 <li 
                    datatype={A(["slide", idx])} 
                    key={idx} 
                    className={`${css.list_item}`}>
                        <span 
                            className={`${(currentTag == item) ? css.active : css.inactive}`}
                            onClick={()=>{setPosts(filter(item)); setCurrentTag(item)}}>{item}</span>
                 </li>
               )
             })}
           </ul>
       </SwiperLogic>
       
    </div>
  );
};


