/* React */
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

/* Style */
import styles from './ArticleCard.module.scss'


/* Types */
 type ArticleCardProps = {
    thumbnail: {
        url: string;
        alt: string;
    };
    title: string;
    slug: string;
}

const ArticleCard = ({thumbnail, title, slug}: ArticleCardProps) => {

  return (
    
        <div className={`article-card-width ${styles.container}`}>
            <div className={`${styles.image}`}>
                <Image
                    src={thumbnail.url}
                    alt={thumbnail.alt}
                    layout='fill'
                    objectFit='cover'
                />
            </div>
            <div className={`worksans-article-card ${styles.text}`}>
                <h3>{title}</h3>
                <div>
                    <Link  href="/">
                        <a>Read more</a>
                    </Link>
                </div>
            </div>
        </div>
  )
}

export default ArticleCard
