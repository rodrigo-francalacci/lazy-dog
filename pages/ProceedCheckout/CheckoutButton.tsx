/* React */
import React, { useEffect, useRef } from "react";

/* Style */
import "@aws-amplify/ui-react/styles.css";

/* Components */
import Buttom from "../../components/Buttom/Buttom";

/* Custom Hooks */
import { useProfile } from "../../context/profile-context";

/* Redux */
import { useAppSelector } from "../../redux/hooks";

/* Stripe */
import getStripe from "../../lib/getStripe";
import { fetchPostJSON } from "../../utils/stripe-api-helpers";


/* 
===================================
PAGE COMPONENT
==================================*/
const CheckoutButton = ({
  checkForm,
  handleUpdate,
}: {
  checkForm: () => boolean;
  handleUpdate: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) => {
  //States
  const customer_id = useProfile().userData?.stripeData;
  const cartItems = useAppSelector((state) => state.cart.cart);

  /* HANDLE CHECKOUT FUNCTION
  We're gonna make an API request to our own next.js backend!!*/
  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = async (
    e
  ) => {
    e.preventDefault();

    if ((checkForm()) && (cartItems.length > 0)) {
      // Update the customer data
       handleUpdate(e);

      // Create a Checkout Session.
      const response = await fetchPostJSON("/api/checkout_sessions/cart", {
        cart: cartItems,
        customer_id: customer_id,
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
    }
  };

  /* JSX PAGE RETURN 
    ++++++++++++++++++++++++++++++++++++++++++++++++++++*/
  return (
    <button onClick={handleSubmit} type="submit">
    <Buttom bkgColor="bkg-blue-velvet" size="big" fontColor="font-white">
        Checkout
    </Buttom>
    </button>
  );
};

export default CheckoutButton;
