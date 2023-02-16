//React
import React from 'react'
import Link from 'next/link'
import { useRef, useEffect } from 'react'

//Redux
import { useAppSelector } from '../../redux/hooks';
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../redux/store' //to get the correct types
import { close, setTransitionOff } from '../../redux/slices/navbarSlice';

//Components
import Logo from '../Logo/Logo' 
import NavBarToggle from '../NavBar_Toggle/NavBar_Toggle'
import {FaShoppingCart} from 'react-icons/fa'
import {HiUser} from 'react-icons/hi'
import { FaDog } from 'react-icons/fa';


//Context and hooks
import { useProfile } from '../../context/profile-context';

//Styles
import styles from './NavBar.module.scss'

/* Types */
import {collectionsListProps} from '../../utils/shopify_colllection_query' //to fill the navbar
type socialMedias = {
  name: string;
  link: string;
}

//===========================================================================================================================
//COMPONENT => Closed NavBar -------------------------------
export const NavBarClosed = () => {
    //HTML refs
    const ref_cartNumberContainer = useRef<HTMLSpanElement>(null!);
    const cartNumber = useAppSelector(state => state.cart.numberOfItems);
    const nameOfuser = useProfile().userData?.firstName; 
    const username = useProfile().userData?.username;
    const greeting = useProfile().greeting;

    useEffect(()=>{
      if(cartNumber === 0){
        ref_cartNumberContainer.current.style.display = 'none';
      } else {
        ref_cartNumberContainer.current.style.display = 'flex';
      }
     
    },[cartNumber])

  //Aux Funcs
  const dispatch = useDispatch();
  

  return (
    <div className={`${styles.navBarClosed_container}`}>
        <div className={styles.toggle_container}><NavBarToggle/></div>
        <Link href={'/'}>
          <div className={styles.logo_container} onClick={()=>{dispatch(setTransitionOff()); dispatch(close())}}><Logo/></div>
        </Link>
        <div className={styles.member_cart_container}>
            <div className={styles.userName}>
              <span>{greeting && greeting}</span>
              <span>{(nameOfuser) ? nameOfuser : username}</span>
            </div>
            
            <Link href={'/Cart/Cart'} >
              <div className={styles.cart} onClick={()=>{dispatch(setTransitionOff()); dispatch(close())}}>
                <FaShoppingCart size="1.4rem"/>
                <span ref={ref_cartNumberContainer}>{cartNumber}</span>
              </div>
            </Link>
            <Link href={'/Profile/Profile'}>
              <div onClick={()=>{dispatch(setTransitionOff()); dispatch(close())}}>
                <HiUser size="1.4rem"/>
              </div>
            </Link>
        </div>
    </div>
  )
}

//===========================================================================================================================
//COMPONENT => Opened NavBar --------------------------------
export const NavBarOpened = ({categoriesList, socialMedias}:{categoriesList: collectionsListProps[], socialMedias: socialMedias[]}) => {
  
  //HTML refs
  const ref_navBarOpened_container = useRef<HTMLDivElement>(null!);
  const cartNumber = useAppSelector(state => state.cart.numberOfItems)

  //States
  const status = useSelector<RootState>(state => state.navbar_state.status);
  const transition =  useSelector<RootState>(state => state.navbar_state.transition);
  const nameOfuser = useProfile().userData?.firstName; 
  const username = useProfile().userData?.username;
  const greeting = useProfile().greeting;
  
  
  //UseEffect
  useEffect(()=>{

    if(status == 'opened'){
      ref_navBarOpened_container.current.style.transform = "translateX(0)"

    } else {
      ref_navBarOpened_container.current.style.transform = "translateX(-100%)"
    }


  }, [status] )

  //Aux Funcs
  const dispatch = useDispatch();
  function handleClick(){
    dispatch(setTransitionOff());
    dispatch(close());
  }

  //Return
  return (
    <div className={`navbar-opened-width ${styles.navBarOpened_container} ${transition ? "" : styles.is_changin_page }`} ref={ref_navBarOpened_container}>
    <div className={styles.head_container}><NavBarClosed/></div>
      <nav className='worksans-navbar'>
          <ul>
            
             {/* Load the Home Link */}
            <li  onClick={handleClick} >
                <Link  href="/"><a>Home</a></Link>
            </li>

            <hr/>{/* Divider */}
            { (username) && <li><h3>{greeting} {(nameOfuser) ? nameOfuser : username}</h3></li>}

            {/* Load the user Profile Page */}
            <li onClick={handleClick}>
                <Link  href="/Profile/Profile"><a>Account</a></Link>
            </li>
            {/* Load the wishlist  Page */}
            <li onClick={handleClick}>
                <Link  href="/Wishlist/Wishlist"><a>Wishlist</a></Link>
            </li>
            <li  onClick={handleClick}>
              <Link href='/Cart/Cart'><a>{`Cart (${cartNumber})`}</a></Link>
            </li>
  
              <hr/>{/* Divider */}
  
            <li><h3>Categories</h3></li>
  
            {/* Map all categories */}
            {categoriesList && categoriesList.map((item)=>{
  
              {/* Skip the home*/}
              if(item.position>0){
                return(
                  <li 
                      onClick={handleClick} 
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
              <li onClick={handleClick}>
                <Link href="/Blog/Blog"><a>Blog</a></Link>
              </li>
  
              <li onClick={handleClick}>
                <Link href="/DogsFriends/DogsFriends"><a>Lazy Dog Friends</a></Link>
              </li>
  
                {/* Map Social Media */}
                {socialMedias?.length > 0 && socialMedias.map((item)=>{
                  return(
                    <li onClick={handleClick} key={item.name}>
                      <a href={item.link} target='_blank' rel="noopener noreferrer">{item.name}</a>
                  </li>
                  )
                })}
  
              <li onClick={handleClick} className={styles.lastItem}>
                <Link href="/Contact/Contact"><a>Contact</a></Link>
              </li>

          </ul>

          

      </nav>
    </div>
  )
}



//===========================================================================================================================
export const SVGCart: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
  style = {{ width: "inherit", height:"inherit"}}
  viewBox="0 0 31.921 36.45"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M21.822 7.431A1 1 0 0 0 21 7H7.333L6.179 4.23A1.994 1.994 0 0 0 4.333 3H2v2h2.333l4.744 11.385A1 1 0 0 0 10 17h8c.417 0 .79-.259.937-.648l3-8a1 1 0 0 0-.115-.921z" />
    <circle cx={10.5} cy={19.5} r={1.5} />
    <circle cx={17.5} cy={19.5} r={1.5} />
  </svg>
);

//===========================================================================================================================
export const SVGUser:React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg

    fill="none"
    style = {{ width: "inherit", height:"inherit"}}
    viewBox="0 0 31.921 36.45"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path 
      d="M8.51553 7.38015C8.51553 10.1971 10.8079 12.4895 13.6249 12.4895C16.4418 12.4895 18.7342 10.1971 18.7342 7.38015C18.7342 4.5632 16.4418 2.27081 13.6249 2.27081C10.8079 2.27081 8.51553 4.5632 8.51553 7.38015ZM22.7081 23.8436H23.8435V22.7082C23.8435 18.3266 20.2772 14.7603 15.8957 14.7603H11.354C6.97137 14.7603 3.40619 18.3266 3.40619 22.7082V23.8436H22.7081Z"
      fill="black"
    />
  </svg>
);

export default SVGUser;






