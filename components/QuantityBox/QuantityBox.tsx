/* React */
import React from 'react'

/* Style */
import styles from './QuantityBox.module.scss'

/* Redux */

/* Components */
import Box from '../Box/Box'

/* Types */
type QuantityBoxProps = {
    productID?: string;
    product?: string;
    className?: string;
}


const QuantityBox = ({productID, product, className}: QuantityBoxProps) => {

    className = `${styles.container} ${className}`

  return (
    <Box size='quantity-box-dimensions' className={className}>

        <div>-</div>
        <div>2</div>
        <div>+</div>

    </Box>
  )
}

export default QuantityBox