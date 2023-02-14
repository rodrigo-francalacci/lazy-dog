/* React */
import React from 'react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link'; 
import { useRouter } from 'next/router';

/* Redux */
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { open, close } from '../../redux/slices/navbarSlice';

/* Components */
import { NavBarOpened, NavBarClosed } from '../../components/NavBar/NavBar';
import { PromoBar } from '../../components/PromoBar/PromoBar';
import Footer from '../../components/Footer/Footer';
import Loading from '../../components/LoadingPage/LoadingPage';

/* Queries */
import { getLayoutProps } from '../../utils/layout_fetch_function'; //get the layout props, site settings, promo top bar banners

/* Formating Functions 
to type and format the response of the following queries
I am getting the queries response through pageProps (see _app.js)*/
import {formatSiteSettings, formatBannerItems} from '../../utils/sanity_queries'

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
  const [siteSettings, setSiteSettings] = useState<siteSettingsProps>(null!);
  const [categoriesList, setCategoriesList] = useState<collectionsListProps[]>(null!);
  const [banners, setBanners] = useState<bannerItemProps[]>(null!);
  const route = useRouter().asPath;



  //This useEfffect loads the Layout Data
  useEffect(() => {
    loadData();
    /* Remember to include this page on Sanity CORS origins Hosts so you can connect to the project API. */
    async function loadData() {
      const data = await getLayoutProps();
      setBanners(formatBannerItems(data.sanityLayoutItems.banners));
      setSiteSettings(formatSiteSettings(data.sanityLayoutItems.sitesettings));
      setCategoriesList(data.collectionsResponse);
    }
  }, []);

  //This useEffect remove the layout padding when we are seeing a product page. So we have more space for the photos
  useEffect(() => {
    const productPage = layoutProps.product ? true : false;
    if (productPage) {
      ref_main.current.style.paddingLeft = "0rem";
      ref_main.current.style.paddingRight = "0rem";
    } else {
      ref_main.current.style.paddingLeft = "1.3rem";
      ref_main.current.style.paddingRight = "1.3rem";
    }
  }, [layoutProps]);

  /* +++++++++++++++++++++++++++++++ */

  //HTML refs
  const ref_overlay = useRef<HTMLDivElement>(null!);
  const ref_top = useRef<HTMLDivElement>(null!);
  const ref_main = useRef<HTMLDivElement>(null!);

  //States
  const status = useAppSelector((state) => state.navbar_state.status);

  useEffect(() => {
    if (status == "opened") {
      ref_overlay.current.style.visibility = "visible";
      ref_overlay.current.style.opacity = "0.8";
      document.body.style.overflow = "hidden";
    } else {
      ref_overlay.current.style.visibility = "hidden";
      ref_overlay.current.style.opacity = "0";
      document.body.style.overflow = "unset";
    }
  }, [status]);

  /* Aux Functions 
+++++++++++++++++++++++++++++++++++++++*/

  //we use this function when the user clicks on the area outside the navigation bar to close it
  const dispatch = useAppDispatch();
  function handleOpacityAreaClick() {
    if (status == "opened") {
      dispatch(close());
    } else {
      dispatch(open());
    }
  }


  /* JSX Return
+++++++++++++++++++++++++++++++++++++++*/
  return (
    <div className={styles.container}>
      <Loading />

      {/* Top Section */}
      <div className={styles.top} ref={ref_top}>
        <div>
          <PromoBar banners={banners && banners} />
        </div>
        <div className={`${styles.NavBarClosed}`}>
          <NavBarClosed />
        </div>
      </div>

      {/* NavBar opened on the side */}
      <div className={styles.NavBarOpened}>
        <NavBarOpened
          categoriesList={categoriesList && categoriesList}
          socialMedias={siteSettings && siteSettings.socialMedias}
        />
      </div>

      <div className={styles.content_containter}>
        {/* Left Side content (not navbar!) */}
        <div className={` ${styles.sides}`}>
          <nav className="worksans-sidebar">
            <ul>
              {/* Load the Home Link */}
              <li>
                <Link href="/">
                  <a className={(route === "/") ? `${styles.active}` : ""}>Home</a>
                </Link>
              </li>
              {/* Load the user Profile Page */}
              <li>
                <Link href="/Profile/Profile">
                  <a className={
                    (route.includes("/Profile/Profile") ||
                    route.includes("/Orders/Orders") ||
                    route.includes("/Success/Success") ||
                    route.includes("/Cart/Cart"))
                    ? 
                    `${styles.active}` 
                    : 
                    ""}
                    >Account</a>
                </Link>
              </li>
              {/* Load the wishlist  Page */}
              <li>
                <Link href="/Wishlist/Wishlist">
                  <a className={route.includes("/Wishlist/Wishlist") ? `${styles.active}` : ""}>My Wishlist</a>
                </Link>
              </li>
              <hr />
              {/* Divider */}
              <li>
                <h3>Categories</h3>
              </li>
              {/* Map all categories */}
              {categoriesList &&
                categoriesList.map((item) => {
                  {
                    /* Skip the home*/
                  }
                  if (item.position > 0) {
                    return (
                      <li key={item.handle}>
                        {/* The link path for dynamics routes in nexjs can be:
                      1) /Collection/${item.handle} --> if you are using getStaticProps()
                      2) /Collection/[${item.handle}].tsx --> if you are using getServerProps()
                    */}
                        <Link href={`/Collection/${item.handle}`}>
                          <a className={route.includes(`/Collection/${item.handle}`) ? `${styles.active}` : ""}>{item.title}</a>
                        </Link>
                      </li>
                    );
                  }
                })}
              <hr /> {/* Divider */}
            </ul>

            {/* Media Pages*/}
            <ul>
              <li>
                <Link href="/Blog/Blog">
                  <a className={route.includes("/Blog/") ? `${styles.active}` : ""}>Blog</a>
                </Link>
              </li>

              <li>
                <Link href="/DogsFriends/DogsFriends">
                  <a className={route.includes("/DogsFriends/DogsFriends") ? `${styles.active}` : ""}>Lazy Dog Friends</a>
                </Link>
              </li>

              {/* Map Social Media */}
              {siteSettings?.socialMedias?.length > 0 &&
                siteSettings.socialMedias.map((item) => {
                  return (
                    <li key={item.name}>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.name}
                      </a>
                    </li>
                  );
                })}

              <li>
                <Link href="/Contact/Contact">
                  <a className={route.includes("/Contact/Contact") ? `${styles.active}` : ""}>Contact</a>
                </Link>
              </li>
            </ul>

            <hr />
            {/* Divider */}
          </nav>
        </div>

        {/* Page content */}
        <main ref={ref_main}>{children}</main>

        {/*Right Side content (not navbar!) */}
        <div className={` ${styles.sides}`}>
          <div></div>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <Footer text={siteSettings && siteSettings.footerText} />
      </footer>

      {/* Opacity overlay */}
      <div
        className="overlay"
        ref={ref_overlay}
        onClick={handleOpacityAreaClick}
      ></div>
    </div>
  ); //return end
} //Layout end

export default Layout;





