/* React */
import React from "react";
import Image from "next/image";
import Link from "next/link";

/* Styles */
import styles from "./Cart.module.scss";

/* Redux */
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { removeItem } from "../../redux/slices/cartSlice";

/* Components */
import Box from "../../components/Box/Box";
import Buttom from "../../components/Buttom/Buttom";
import QuantityBox from "../../components/QuantityBox/QuantityBox";


const Cart = () => {
  /* Get items from redux */
  const cartItems = useAppSelector((state) => state.cart.cart);
  const subtotal = useAppSelector((state) => state.cart.subtotal);
  const dispatch = useAppDispatch();

  return (
    <div className={styles.wrapper}>
      <h2 className="worksans-h2">Check Your Cart</h2>

      {/* Cart items */}
      <div className={`worksans-cart-items ${styles.col1}`}>
        {cartItems?.length > 0 &&
          cartItems.map((item) => {
            let title: string = item.title;
            if (item.personalized === "yes") {
              title = `${title} Personalized with ${item.dogName}'s Name`;
            }

            return (
              <div className={styles.item} key={item.id}>
                <Box size="cart-item-picture-box" className={styles.box}>
                  <div className={styles.thumbnailContainer}>
                    <Image
                      src={item.imgURL}
                      layout="fill"
                      objectFit="cover"
                      alt={item.title}
                    /> 
                  </div>
                </Box>
                <div className={styles.text_info}>
                  <h3>{title}</h3>
                  <div className={styles.info}>
                    <p>
                      <span>£</span>
                      {(item.price * item.quantity).toFixed(2)}
                    </p>
                    <QuantityBox use="cartPage" productID={item.id} />
                    <span
                      onClick={() => {
                        dispatch(removeItem({ id: item.id }));
                      }}
                    >
                      Remove
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/*     Col2 - Summary and buttons */}
      <div className={`worksans-cart-summary ${styles.col2}`}>
        <div className={styles.summary_top_buttoms}>
          <Link href="/Profile/Profile">
            <a>
              <Buttom bkgColor="bkg-green" size="small" fontColor="font-white">
                <p>CHECK MY</p>
                <p>PROFILE</p>
              </Buttom>
            </a>
          </Link>
          <Link href="/">
            <a>
              <Buttom bkgColor="bkg-gold" size="small" fontColor="font-black">
                <p>Continue</p>
                <p>Shopping</p>
              </Buttom>
            </a>
          </Link>
        </div>

        {/* Summary box */}
        <Box
          size="cart-summary-dimensions"
          bkgColor="bkg-orange"
          className={styles.summary}
        >
          <div className={styles.summary_top}>
            <p>Shipping Rate</p>
            <p>GBP 2.95</p>
            <div></div>
          </div>

          <div className={styles.summary_bottom}>
            <p>Total Amount</p>
            <p>GBP {(subtotal + 2.95).toFixed(2)}</p>
          </div>
        </Box>

        <Link href={"/Profile/Profile?action=checkout"}>
          <a>
            <Buttom
              bkgColor="bkg-blue-velvet"
              size="big"
              fontColor="font-white"
              className={styles.checkout_buttom}
            >
                Checkout
            </Buttom>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Cart;
