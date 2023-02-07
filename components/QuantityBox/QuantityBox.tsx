/* React */
import React from 'react'

/* Style */
import styles from './QuantityBox.module.scss'

/* Redux */
import {useAppSelector, useAppDispatch} from '../../redux/hooks';
import { incrementQuantity, decrementQuantity } from '../../redux/slices/cartSlice';

/* Components */
import Box from '../Box/Box'

/* Types */
type QuantityBoxProps = {
    use: 'productPage' | 'cartPage';
    productID: string;
    handleClick?: (action: 'add' | 'subtract' ) => void;
    counter?: number;
    className?: string;
    
}

const QuantityBox = ({productID, className, use, handleClick, counter}: QuantityBoxProps) => {

//States
const itemCart = useAppSelector(state => state.cart.cart.find((item) => (item.id === productID) ));
const dispatch = useAppDispatch();


 //CSS class setup
 className = `${styles.container} ${className}`
 
/* Select where the component is being used */
 //If I'm using it inside the product page
if(use === 'productPage'){

  return(
  <Box size='quantity-box-dimensions' className={className}>

    <div className={styles.wrapper}>
      <div
        className={styles.decrementBot}
        onClick={()=>{handleClick!('subtract')}}>-</div>
      <div className={styles.quantity}>{counter}</div>
      <div
        className={styles.incrementBot}
        onClick={()=>{handleClick!('add')}}>+</div>
    </div>
      
  </Box>


  )

}

//If I'm using inside the cartPage...
else {
  
  return (
    <Box size='quantity-box-dimensions' className={className}>

    <div className={styles.wrapper}>
      <div
        className={styles.decrementBotCartPage}
        onClick={()=>{dispatch(decrementQuantity({id: productID}))}}>-</div>
      <div className={styles.quantity}>{itemCart!.quantity}</div>
      <div
        className={styles.incrementBotCartPage}
        onClick={()=>{dispatch(incrementQuantity({id: productID}))}}>+</div>
    </div>
      
  </Box>
  )
}

}

export default QuantityBox