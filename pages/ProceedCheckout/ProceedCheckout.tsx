/* React */
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";


/* Style */
import styles from "./ProceedCheckout.module.scss";
import "@aws-amplify/ui-react/styles.css";

/* Components */
import Buttom from "../../components/Buttom/Buttom";

/* Custom Hooks */
import { useProfile } from "../../context/profile-context";

/* Redux */
import { useAppSelector } from "../../hooks";

/* Stripe */
import getStripe from "../../lib/getStripe";
import { fetchPostJSON } from "../../utils/api-helpers";

/* Amplify */
import { Authenticator, withAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";

/* Amplify Configure */
Amplify.configure(JSON.parse(process.env.NEXT_PUBLIC_AMPLIFY_EXPORTS!));
/* import awsmobile from "../../aws-exports";
Amplify.configure(awsmobile); */

/* 
===================================
PAGE COMPONENT
==================================*/
const ProceedCheckout = () => {
  //States
  const user = useProfile().userData;
  const address = JSON.parse(useProfile().userData?.adress!);
  const customer_id = useProfile().userData?.stripeData
  const mode = useProfile().mode;
  const cartItems = useAppSelector((state) => state.cart.cart);
  const router = useRouter();
 

  
  /* HANDLE CHECKOUT FUNCTION
  We're gonna make an API request to our own next.js backend!!*/
  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    // Create a Checkout Session.
    const response = await fetchPostJSON("/api/checkout_sessions/cart", {
      cart: cartItems,
      customer_id: customer_id
    });

    if (response.statusCode === 500) {
      console.error(response.message);
      return;
    }

    // Redirect to Checkout.
    const stripe = await getStripe();
    const { error } = await stripe!.redirectToCheckout({
      // Make the id field from the Checkout Session creation API response
      // available to this file, so you can provide it as parameter here
      // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
      sessionId: response.id,
    });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    console.warn(error.message);
  };

  if(user?.firstName === null || user?.firstName === ""){
    router.push("/Profile/Profile");
  }


  /* JSX PAGE RETURN 
    ++++++++++++++++++++++++++++++++++++++++++++++++++++*/
  return (
    <div className={styles.container}>
      <h2 className={`worksans-h2`}>
        Please check your contact information before proceed to checkout
      </h2>

      <ul className={`worksans-paragraph`}>
        <li>
          <strong>NAME:</strong> {user?.firstName} {user?.lastName}
        </li>
        <li><strong>EMAIL:</strong> {user?.email}</li>
        <li><strong>PHONE:</strong> {address?.phone}</li>
        <li>
          <strong>CONTACT ADDRESS:</strong>
          <div className={styles.note}>
              <p>This is address for contact not your shipping address.</p>
              <p>The shipping address will be set on the next screen.</p>
          </div>
          <p><strong>City:</strong> {address.city}</p>
          <p><strong>Line 1:</strong> {address.line1}</p>
          <p><strong>Line 2:</strong> {address.line2}</p>
          <p><strong>Post Code:</strong> {address.postal_code}</p>
          <p><strong>State:</strong> {address.state}</p>
        </li>
      </ul>

      <div className={styles.buttomContainer}>
        <Link href="/Profile/Profile">
          <a>
              <Buttom
                bkgColor="bkg-white"
                size="big"
                fontColor="font-black"
                className={styles.buttom}
              >
                {`Review Information `}
              </Buttom>
          </a>
        </Link>

        <Buttom
          bkgColor="bkg-blue-velvet"
          size="big"
          fontColor="font-white"
          className={styles.buttom}
        >
          <button onClick={handleSubmit} type="submit">
            Checkout
          </button>
        </Buttom>
      </div>
    </div>
  );
};

export default withAuthenticator(ProceedCheckout);
