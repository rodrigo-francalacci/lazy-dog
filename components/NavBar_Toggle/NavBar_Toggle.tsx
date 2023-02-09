/* React */
import React from 'react'
import { useRef } from "react";
import styles from './NavBar_Toggle.module.scss'

/* Redux */
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../redux/store' //to get the correct types
import { open, close, setTransitionOn } from '../../redux/slices/navbarSlice';

//===========================================================================================================================
//COMPONENT => NavBar ToggleButton
const NavBarToggle = () => {

    //States
    /* const [open, setOpen] = useState<boolean>(false); */
    const status = useSelector<RootState>(state => state.navbar_state.status);
    const dispatch = useDispatch();
    var statusClass = "";

    //HTML refs
    const ref_icon =useRef<HTMLSpanElement>(null!);
    const ref_toggle =useRef<HTMLButtonElement>(null!);


    if(status == 'opened'){
      statusClass = styles.hamburger__icon2;
    } else {
      statusClass = styles.hamburger__icon;
    }


    function handleClick(){

      if(status == 'opened' ){
        ref_icon.current.className = styles.hamburger__icon;
        dispatch(setTransitionOn());
        dispatch(close())
      } else {
        ref_icon.current.className = styles.hamburger__icon2;
        dispatch(setTransitionOn());
        dispatch(open());
      }

    }

    return (
      <button className={`navbar-toggle-dimentions ${styles.hamburger__toggle}`} ref={ref_toggle} onClick={handleClick}>
          <span className={statusClass} ref={ref_icon}></span>
      </button>
    )
  }

export default NavBarToggle

