/* React */
import React from 'react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/* Redux */
import { useAppSelector, useAppDispatch } from '../../hooks';
import { open, close } from '../../slices/navbarSlice';

/* Components */
import { NavBarOpened, NavBarClosed } from '../../components/NavBar/NavBar';
import { PromoBar } from '../../components/PromoBar/PromoBar';
import Footer from '../../components/Footer/Footer';
import Loading from '../../components/Loading/Loading';

/* Queries */
import { getLayoutProps } from '../../utils/layout_fetch_function'; //get the layout props, site settings, promo top bar banners

/* Formating Functions 
to type and format the response of the following queries
I am getting the queries response through pageProps (see _app.js)*/
import {formatSiteSettings, formatBannerItems} from '../../utils/sanity_queries'
import {formatCollectionsListResponse} from '../../utils/shopify_colllection_query' // collection query to fill the navbar

/* Styles */
import styles from './layout.module.scss';

/* Types */
import { collectionsListProps } from '../../utils/shopify_colllection_query';
import {bannerItemProps, siteSettingsProps} from '../../utils/sanity_queries'

interface Props {
  children: React.ReactNode,
  layoutProps?: any,

}

//===========================================================================================================================
const Layout: React.FunctionComponent<Props> = ({children, layoutProps}:Props) =>{
 
/* 
- I could have grabbed the data from the layoutProps property, 
  however that means I have to make a request on every page 
  which can slow the site down, so I decided to use the useEffect hook 
  to grab the layout data directly from the layout component. 
- Good news NextJS 13 allows Component-level data fetching but I am 
  not using NextJS 13 yet
*/

/* Fetch layout data using useEffect and useState
++++++++++++++++++++++++++++++++++ */

    const [siteSettings, setSiteSettings] = useState<siteSettingsProps>(null!)
    const [categoriesList, setCategoriesList] = useState<collectionsListProps[]>(null!)
    const [banners, setBanners] = useState<bannerItemProps[]>(null!)

    useEffect(() => {

        loadData();

        async function loadData(){
          const data = await getLayoutProps()
          setBanners(formatBannerItems(data.sanityLayoutItems.banners))
          setSiteSettings(formatSiteSettings(data.sanityLayoutItems.sitesettings))
          setCategoriesList(formatCollectionsListResponse(data.shopifyCollectionsResponse.data.collections))
          console.log(data)
        }
        
    }, [])

    
/* +++++++++++++++++++++++++++++++ */
    
   //HTML refs
   const ref_overlay = useRef<HTMLDivElement>(null!);
   const ref_top = useRef<HTMLDivElement>(null!);

   //States
   const status = useAppSelector(state => state.navbar_state.status);
   
  useEffect(()=>{

        if(status == 'opened'){
          ref_overlay.current.style.visibility = "visible";
          ref_overlay.current.style.opacity = "0.8";
        } else {
          ref_overlay.current.style.visibility = "hidden";
          ref_overlay.current.style.opacity = "0";
        }
      
   }, [status] )

     
/* Aux Functions 
+++++++++++++++++++++++++++++++++++++++*/

    //we use this function when the user clicks on the area outside the navigation bar to close it
    const dispatch = useAppDispatch()
    function handleOpacityAreaClick(){
      if(status == 'opened' ){
        dispatch(close())
      } else {
        dispatch(open());
      }
    }

    
/* JSX Return
+++++++++++++++++++++++++++++++++++++++*/
return ( 

<div className={styles.container}>

    <Loading/>
 
    {/* Top Section */}
    <div className={styles.top} ref={ref_top}>
      <div><PromoBar banners={banners && banners}/></div>
      <div className={`${styles.NavBarClosed}`}><NavBarClosed/></div>
    </div>
 
    
    {/* NavBar opened on the side */}
    <div className={styles.NavBarOpened}>
      <NavBarOpened categoriesList={categoriesList && categoriesList} socialMedias={siteSettings && siteSettings.socialMedias}/>
    </div>

    <div className={styles.content_containter}>

        {/* Left Side content (not navbar!) */}
        <div className={` ${styles.sides}`}>
        <nav className='worksans-sidebar'>
          <ul>
  
             {/* Load the Home Link */}
            <li  >
                <Link  href="/"><a>{categoriesList && categoriesList[0].title}</a></Link>
            </li>
        
              <hr/>{/* Divider */}
  
            <li><h3>Categories</h3></li>
  
            {/* Map all categories */}
            {categoriesList && categoriesList.map((item)=>{
  
              {/* Skip the home*/}
              if(item.position>0){
                return(
                  <li 
                      
                      key={item.handle}>
                    {/* The link path for dynamics routes in nexjs can be:
                      1) /Collection/${item.handle} --> if you are using getStaticProps()
                      2) /Collection/[${item.handle}].tsx --> if you are using getServerProps()
                    */}
                    <Link  href={`/Collection/${item.handle}`}><a>{item.title}</a></Link>
                  </li>
                )
              }
              })}

                <hr/> {/* Divider */}     
            
          </ul>

          {/* Media Pages*/}
          <ul>
              <li>
                <Link href="/Blog/Blog"><a>Blog</a></Link>
              </li>
  
              <li>
                <Link href="/DogsFriends/DogsFriends"><a>Lazy Dog Friends</a></Link>
              </li>
  
                {/* Map Social Media */}
                {siteSettings?.socialMedias?.length > 0 && siteSettings.socialMedias.map((item)=>{
                  return(
                    <li key={item.name}>
                      <a href={item.link} target='_blank' rel="noopener noreferrer">{item.name}</a>
                  </li>
                  )
                })}
  
              <li >
                <Link href="/Contact/Contact"><a>Contact</a></Link>
              </li> 
          </ul>

          <hr/>{/* Divider */}

      </nav>
        </div>

        {/* Page content */}
        <main>
            {children}
        </main>

        {/*Right Side content (not navbar!) */}
        <div className={` ${styles.sides}`}>
          <div></div>
        </div>
      
    </div>


    {/* Footer */}
    <footer>
      <Footer text={siteSettings && siteSettings.footerText}/>
    </footer>
    
    {/* Opacity overlay */}
    <div className='overlay' ref={ref_overlay} onClick={handleOpacityAreaClick}></div>

</div> 

) //return end
} //Layout end

export default Layout;





