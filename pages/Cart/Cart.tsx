/* React */
import React from 'react'

/* Styles */
import styles from './Cart.module.scss'

/* Components */
import Box from '../../components/Box/Box'
import Buttom from '../../components/Buttom/Buttom'

const Cart = () => {
  return (
    <div className={styles.wrapper}>
        <h2 className='worksans-h2'>Check Your Cart</h2>

        {/* Cart items */}
        <div className={`worksans-cart-items ${styles.col1}`}>

            <div className={styles.item}>
                <Box size='cart-item-picture-box'></Box>
                <h3>Name of the Product</h3><p>£12.00</p>
            </div>

            <div className={styles.item}>
                <Box size='cart-item-picture-box'></Box>
                <h3>Name of the Product</h3><p>£12.00</p>
            </div>

            <div className={styles.item}>
                <Box size='cart-item-picture-box'></Box>
                <h3>Name of the Product</h3><p>£12.00</p>
            </div>

            
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
                        <p>GBP 38.00</p>
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