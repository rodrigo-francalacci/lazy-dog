/* React */
import React from 'react'
import Image from 'next/image';

/* Styles */
import styles from './Cart.module.scss'

/* Redux */
import {useAppSelector, useAppDispatch} from '../../hooks';
import { removeItem } from '../../slices/cartSlice';

/* Components */
import Box from '../../components/Box/Box'
import Buttom from '../../components/Buttom/Buttom'
import QuantityBox from '../../components/QuantityBox/QuantityBox';

const Cart = () => {

/* Get items from redux */
const cartItems = useAppSelector((state)=> state.cart.cart);
const subtotal = useAppSelector((state) => state.cart.subtotal);

/* States */


/* Aux Functions */
const dispatch = useAppDispatch(); 

  return (
    <div className={styles.wrapper}>
        <h2 className='worksans-h2'>Check Your Cart</h2>

        {/* Cart items */}
        <div className={`worksans-cart-items ${styles.col1}`}>

            {cartItems?.length > 0 && cartItems.map((item) =>{
                let title: string = item.title;
                if(item.personalized === 'yes'){title = `${title} Personalized with ${item.dogName}'s Name`}

                return(
                    <div className={styles.item} key={item.id}>
                        <Box size='cart-item-picture-box' className={styles.box}>
                            <div className={styles.thumbnailContainer}>
                                <Image src={item.imgURL} layout='fill' objectFit='cover' alt={item.title}/>
                            </div>
                        </Box>
                        <div className={styles.text_info}>
                            <div>
                                <h3>{title}</h3><p><span>£</span>{(item.price*item.quantity).toFixed(2)}</p>
                            </div>
                            <div>
                                <QuantityBox use='cartPage' productID={item.id}/>
                                <span onClick={()=>{ dispatch(removeItem({id: item.id}))}}>Remove</span>
                            </div>
                        </div>
                        
                    </div>   
                )
            })} 
        </div>


        {/*     Col2 - Summary and buttons */}
        <div className={`worksans-cart-summary ${styles.col2}`}>

                <div className={styles.summary_top_buttoms}>
                    <Buttom bkgColor='bkg-green' size='small' fontColor='font-white'>
                            <p>Delivery</p>
                            <p>Method</p>
                    </Buttom>
                    <Buttom bkgColor='bkg-gold' size='small' fontColor='font-black'>
                            <p>Continue</p>
                            <p>Shopping</p>
                    </Buttom>
                </div>

                {/* Summary box */}
                <Box  size='cart-summary-dimensions' bkgColor='bkg-orange' className={styles.summary}>
                    <div className={styles.summary_top}>
                        <p>Delivery Charge</p>
                        <p>GBP 4.00</p>
                        <div></div>
                    </div>
                    
                    <div className={styles.summary_bottom}>
                        <p>Total Amount</p>
                        <p>GBP {subtotal.toFixed(2)}</p>
                    </div>
                </Box>

                <Buttom bkgColor='bkg-blue-velvet' size='big' fontColor='font-white' className={styles.checkout_buttom}>
                    <p>Checkout</p>
                </Buttom>

            </div>

    </div>
  )
}

export default Cart
