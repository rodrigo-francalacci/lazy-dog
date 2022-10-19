/* React */
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

/* Components */
import Product from '../components/Product/Product'
import Carousel from '../styles/Carousel/Carousel'
import ArticleCard from '../components/ArticleCard/ArticleCard'

/* Style */
import styles from './Home.module.scss'

/* Types */
type ProductProps = {
    name: string;
    price: number;
    imgUrl: string;
    category: string; 
}


type HomeProps = {
  title: string;
  description: string;
  products: ProductProps[];
}



/* const Home: NextPage<HomeProps> = ({title, description, products}) */
const Home: NextPage<HomeProps> = () => {

  /* Fake Data - products */
  const fakeData: HomeProps = {
    title: "Personalised Duvet",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    products: [
      {
        name: "Bobby",
        price: 16,
        imgUrl: '/images/bobby-double-127-p.jpeg',
        category: 'Single Dog Duvet Sets',
      },
      {
        name: "Ada",
        price: 24.57,
        imgUrl: '/images/ada.jpeg',
        category: 'Single Dog Duvet Sets'
      },
      {
        name: "Arthur",
        price: 24.57,
        imgUrl: '/images/arthur.jpeg',
        category: 'Single Dog Duvet Sets'
      },
      {
        name: "Bailey",
        price: 24.57,
        imgUrl: '/images/bailey.jpeg',
        category: 'Single Dog Duvet Sets'
      },
      {
        name: "Bear",
        price: 24.57,
        imgUrl: '/images/bear.jpeg',
        category: 'Single Dog Duvet Sets'
      },
      {
        name: "Belle",
        price: 24.57,
        imgUrl: '/images/belle.jpeg',
        category: 'Single Dog Duvet Sets'
      },
      {
        name: "Buster",
        price: 24.57,
        imgUrl: '/images/buster.jpeg',
        category: 'Single Dog Duvet Sets'
      },
      {
        name: "Daisy",
        price: 24.57,
        imgUrl: '/images/daisy.jpeg',
        category: 'Single Dog Duvet Sets'
      }
    ]
  }

/* Fake data - articles */
const articles = [
  {
      title: 'Article One',
      slug: 'article-one',
      _id: '7ndjiw',
      date: '10, June, 2002',
      thumbnail: {url:'/images/aboutus.jpeg',  alt: 'Ada'},
      textBlock: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',    
  },
  {
      title: 'Article Two',
      slug: 'article-two',
      _id: 'ndjinj',
      date: '20, May, 2022',
      thumbnail: {url:'/images/aboutus2.jpg',  alt: 'Ada'},
      textBlock: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',    
  },
  {
      title: 'Article Three has a huge title that does not fit well',
      slug: 'article-three',
      _id: '7dbjibj',
      date: '20, May, 2022',
      thumbnail: {url:'/images/ada.jpeg',  alt: 'Ada'},
      textBlock: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',    
  },
  {
      title: 'Article Four',
      slug: 'article-four',
      _id: '1jcnqp',
      date: '20, May, 2022',
      thumbnail: {url:'/images/buster.jpeg',  alt: 'Ada'},
      textBlock: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',    
  }
]

/* Aux functions */
const doubleDogDuvet = articles.filter(obj => {
  return obj.title === 'Article Three';
});

function filterCategory(input: ProductProps[], filterFor: string){
  const result = input.filter(obj => {
    return obj.category === filterFor
  })
  console.log(result);
  return result
  
}


  const {title, description, products} = fakeData;

  return ( 
  <div className={styles.container}>
      <h2 className={`worksans-h2  ${styles.h2_title}`}>{title}</h2>
      <p className={`worksans-paragraph`}>{description}</p>

      <div className={styles.products_container}>

        {/* mapping products */}
        {filterCategory(fakeData.products, 'Single Dog Duvet Sets')?.length > 0 
        && 
        filterCategory(fakeData.products, 'Single Dog Duvet Sets').map((item, index)=>{
          return(
            <div key={`${item.name}${index}`}>
              <Product name={item.name} price={item.price} imgUrl={item.imgUrl}/>
            </div>
          )
        })}

    
      </div>

     
      <h2 className={`worksans-h2  ${styles.h2_article}`}>Articles</h2>

      <div className={styles.articles_wrapper}>
      
        <div className={`article-arrow-div-height ${styles.left_arrow}`}><div>🡠</div></div>
          <div className={styles.carousel_container}>
            <Carousel>

              {/* mapping articles */}
                {articles?.length > 0 && articles.map((item, index)=>{
                  return(
                    <div key={index} className={styles.slider_item}>
                      <ArticleCard thumbnail={item.thumbnail} title={item.title} slug={item.slug}/>
                    </div>
                  )
                })}

            </Carousel>
          </div>
          <div className={`article-arrow-div-height ${styles.right_arrow}`}><div>🡢</div></div>

      </div>




  </div> )
}

export default Home


