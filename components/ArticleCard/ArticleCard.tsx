/* React */
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

/* Style */
import styles from './ArticleCard.module.scss'


/* Types */
 type ArticleCardProps = {
    thumbnail_URL: string;
    title: string;
    slug: string;
}


const ArticleCard = ({thumbnail_URL, title, slug}: ArticleCardProps) => {

  return (
    
        <div className={`${styles.container}`}>
            
            <div className={`${styles.image}`} >
                <Image
                    src={thumbnail_URL}
                    alt={`${title} Lazy Dog Company`}
                    layout='fill'
                    objectFit='cover'
                />
                <div className={styles.dragDiv}></div>
            </div>
            

            <Link  href={`/Blog/${slug}`}>
            <div className={`worksans-article-card ${styles.text}`}>
                    <h3>{title}</h3>
                    <div data-title={title}>
                        <a>Read more</a>
                    </div>
            </div>
            </Link>
            
            
            
        </div>
        
  )
}

export default ArticleCard
