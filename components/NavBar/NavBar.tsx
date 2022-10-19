import React from 'react'
//React
import Link from 'next/link'
import { useRef, useEffect } from 'react'

//Redux
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store' //to get the correct types
import { open, close } from '../../slices/navbarSlice';

//Components
import Logo from '../Logo/Logo'
import NavBarToggle from '../NavBar_Toggle/NavBar_Toggle'
import {FaShoppingCart} from 'react-icons/fa'
import {HiUser} from 'react-icons/hi'


//Styles
import styles from './NavBar.module.scss'
import { Clamp, ClampX_Builder, ClampY } from '../../styles/Clamp/Clamp'



//===========================================================================================================================
//COMPONENT => Closed NavBar -------------------------------
export const NavBarClosed = () => {
  return (
    <div className={`${styles.navBarClosed_container}`}>
        <div className={styles.toggle_container}><NavBarToggle/></div>
        <div className={styles.logo_container}><Logo/></div>
        <div className={styles.member_cart_container}>
            <div><FaShoppingCart size="1.4rem"/></div>
            <div><HiUser size="1.4rem"/></div>
        </div>
    </div>
  )
}

//===========================================================================================================================
//COMPONENT => Opened NavBar --------------------------------
export const NavBarOpened = () => {
  
  //HTML refs
  const ref_navBarOpened_container = useRef<HTMLDivElement>(null!);

  //States
  const status = useSelector<RootState>(state => state.navbar_state.status);
  const dispatch = useDispatch();

  //UseEffect
  useEffect(()=>{

    if(status == 'opened'){
      /* console.log(ref_navBarOpened_container.current) */
      console.log("opened")
      ref_navBarOpened_container.current.style.transform = "translateX(0)"

    } else {
      console.log("closed")
      ref_navBarOpened_container.current.style.transform = "translateX(-100%)"

    }

  }, [status] )

  //Aux Funcs
  function handleClick(){
    dispatch(close())
  }

  //Return
  return (
    <div className={`${styles.navBarOpened_container}`} ref={ref_navBarOpened_container}>
    <div className={styles.head_container}><NavBarClosed/></div>
      <nav className='worksans-navbar'>
        <div className={`${styles.categories_container}`} 
              style={ClampY(
                "paddingTop", 640, 1424, 50, 200, "clamp"
                )}
              >
            <h3 className={styles.categories_header}>Categories</h3>
            <ul className={styles.categories_items}>

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
        <ul className={styles.otherItems_container}>
   
            <li className={styles.otherItems_item} onClick={handleClick}>
              <Link href='/Cart/Cart'><a>Your Cart</a></Link>
            </li>
            <li className={styles.otherItems_item} onClick={handleClick}>
              <Link href="/"><a>Profile</a></Link>
            </li>
            <li className={styles.otherItems_item} onClick={handleClick}>
              <Link href="/"><a>Q and A's</a></Link>
            </li>
            <li className={styles.otherItems_item} onClick={handleClick}>
              <Link href="/"><a>Instagram</a></Link>
            </li>
            <li className={styles.otherItems_item} onClick={handleClick}>
              <Link href="/"><a>Contact</a></Link>
            </li>
            <li className={styles.otherItems_item} onClick={handleClick}>
              <Link href="/"><a>Lazy Dog Friends</a></Link>
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






