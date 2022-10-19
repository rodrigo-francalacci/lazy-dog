/* React */
import React from 'react';
import Head from 'next/head';
import { useEffect, useRef } from 'react';
import Link from 'next/link';

import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store' //to get the correct types
import { open, close } from '../../slices/navbarSlice';

/* Components */
import { NavBarOpened, NavBarClosed } from '../../components/NavBar/NavBar';
import { PromoBar } from '../../components/PromoBar/PromoBar';
import Footer from '../../components/Footer/Footer';


/* Styles */
import styles from './layout.module.scss';


/* Types */
interface Props {
  children: React.ReactNode,
  page?: string,
}

//===========================================================================================================================
const Layout: React.FunctionComponent<Props> = ({children, page}:Props) =>{


  //HTML refs
const ref_overlay = useRef<HTMLDivElement>(null!);
const ref_top = useRef<HTMLDivElement>(null!);

//States
const status = useSelector<RootState>(state => state.navbar_state.status);
const dispatch = useDispatch();


useEffect(()=>{

  if(status == 'opened'){
    ref_overlay.current.style.visibility = "visible";
    ref_overlay.current.style.opacity = "0.8";

  } else {
    ref_overlay.current.style.visibility = "hidden";
    ref_overlay.current.style.opacity = "0";
  }

}, [status] )


//Aux Functions
function handleClick(){
  if(status == 'opened' ){
    dispatch(close())
  } else {
    dispatch(open());
  }
}

/* function elementsOverlap(el1, el2) {
  const domRect1 = el1.getBoundingClientRect();
  const domRect2 = el2.getBoundingClientRect();

  return !(
    domRect1.top > domRect2.bottom ||
    domRect1.right < domRect2.left ||
    domRect1.bottom < domRect2.top ||
    domRect1.left > domRect2.right
  );
} */

return(

<>
    <Head>
      <title>The Lazy Dog Company</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>


<div className={styles.container}>
    
    {/* Top Section */}
    <div className={styles.top} ref={ref_top}>
      <div><PromoBar/></div>
      <div className={`${styles.NavBarClosed}`}><NavBarClosed/></div>
    </div>
 

    {/* NavBar opened on the side */}
    <div className={styles.NavBarOpened}>
      <NavBarOpened/>
    </div>

    <div className={styles.content_containter}>

        {/* Left Side content (not navbar!) */}
        <div className={` ${styles.sides}`}>

              <div className={`worksans-navbar ${styles.categories}`}>

                
                <ul>
                    <li><h3>Categories</h3></li>
                    <li className={styles.category_item} onClick={handleClick}>
                      <Link  href="/"><a>Single Dog Duvet Sets</a></Link>
                    </li>
                    <li className={styles.category_item} onClick={handleClick}>
                      <Link  href="/"><a>Double Dog Duvet Sets</a></Link>
                    </li>
                    <li className={styles.category_item} onClick={handleClick}>
                      <Link  href="/"><a>Bag Bundle and Bags</a></Link>
                    </li>
                    <li className={styles.category_item} onClick={handleClick}>
                      <Link  href="/"><a>Extra Duvets and Pillow</a></Link>
                    </li>                              
              </ul>

              </div>
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
      <Footer/>
    </footer>
    
    {/* Opacity overlay */}
    <div className='overlay' ref={ref_overlay} onClick={handleClick}></div>

</div> 
</>
) //return end
} //Layout end

export default Layout;





