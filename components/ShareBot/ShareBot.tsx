/* React/Next */
import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

/* Styles */
import styles from './ShareBot.module.scss'
import {BsFillShareFill} from 'react-icons/bs'

type ShareBotProps = {
    title: string,
    text: string,
    className?: string
}


const ShareBot = ({title, text, className=''}: ShareBotProps) => {

  //States
  const [documentURL, setDocumentURL] = useState<string>(null!)
  const path: string = useRouter().asPath;

  //When the path changes the useEffect runs to catch the new path
  useEffect(()=>{
    setDocumentURL(document.location.href);
  },[path])
  
  //Aux Functions
  const handleShareClick = () => {

      if (navigator.share) {
        navigator
          .share({
            title: title,
            text: text,
            url: documentURL,
          })
          .then(() => {
            console.log('Successfully shared');
          })
          .catch(error => {
            console.error('Something went wrong sharing the blog', error);
          });
      }
    };
    
  //JSX Return
  return (
      
    <div className={`${styles.container} ${className}`} onClick={handleShareClick}>
        <BsFillShareFill size={25}/>
    </div>
  )
}

export default ShareBot