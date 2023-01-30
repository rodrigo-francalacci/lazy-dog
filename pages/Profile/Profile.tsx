/* React */
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

/* Style */
import styles from "./Profile.module.scss";
import "@aws-amplify/ui-react/styles.css";

/* Custom Hooks */
import { useProfile } from "../../context/profile-context";

/* Components */
import CheckoutButton from "../ProceedCheckout/CheckoutButton";

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
const Profile = () => {
  //States
  const user = useProfile().userData;
  const mode = useProfile().mode;
  const greeting = useProfile().greeting;
  const action = useRouter().query.action;
  const user_address = user?.adress && JSON.parse(user?.adress!);
  const actionRunning = useProfile().actionRunning;
  const updateUser = useProfile().UpdateUser;
  const signout = useProfile().signOutHandler;
  const [requiredFields, setRequiredFields] = useState({result: false, display: "none"})
  
  
  //Refs
  const ref_firstName = useRef<HTMLInputElement>(null!);
  const ref_lastName = useRef<HTMLInputElement>(null!);
  const ref_city = useRef<HTMLInputElement>(null!);
  const ref_line1 = useRef<HTMLInputElement>(null!);
  const ref_line2 = useRef<HTMLInputElement>(null!);
  const ref_postal_code = useRef<HTMLInputElement>(null!);
  const ref_state = useRef<HTMLInputElement>(null!);
  const ref_phone = useRef<HTMLInputElement>(null!);
  const ref_requiredNotice = useRef<HTMLParagraphElement>(null!);


  //UseEffect
  useEffect(()=>{
    checkFields();
  },[user])

  //Aux Functions
  function handleUpdate(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.preventDefault();

    if(checkFields() === true){
      const input: any = {
        firstName: ref_firstName.current.value.trim(),
        lastName: ref_lastName.current.value.trim(),
        line1: ref_line1.current.value.trim(),
        line2: ref_line2.current.value.trim(),
        postal_code: ref_postal_code.current.value.trim(),
        state: ref_state.current.value.trim(),
        city: ref_city.current.value.trim(),
        phone: ref_phone.current.value.trim(),
      };
      updateUser?.(input);
    } 
    
  }
  
  function checkFields(){
    if(
      (ref_firstName.current.value.trim() === "") ||
      (ref_lastName.current.value.trim() === "") ||
      (ref_line1.current.value.trim() === "") ||
      (ref_postal_code.current.value.trim() === "") ||
      (ref_city.current.value.trim() === "")
      ){ 
        setRequiredFields({result: false, display: "block"});
        window.scrollTo(0, 0);
        return false
      }else{
        setRequiredFields ({result: true, display: "none"});
        return true
      }
  }



  /* JSX PAGE RETURN 
    ++++++++++++++++++++++++++++++++++++++++++++++++++++*/
  return (
    <div className={styles.container}>
      <h2 style={{display:`${ (action === "checkout") ? "none" : "block"}`}}>
        {greeting} {mode === "EDIT" ? user?.firstName : user?.username}
      </h2>

      <div className={styles.userDataContainer} style={{display:`${ (action === "checkout") ? "none" : "flex"}`}}>
        <div>
          <p>Username: {user?.username}</p>
          <p>Email: {user?.email}</p>
        </div>
        <Link href="/Orders/Orders">
          <a>My Orders</a>
        </Link>
      </div>

      <p
        className={styles.notice}
        style={{ display: `${requiredFields.display}` }}
        ref={ref_requiredNotice}
      >
        {requiredFields.result === false &&
          "Please fill out all required fields!"}
      </p>

      {/* Profile Form Container */}
      <form className={styles.formContainer}>
        {/*  If you are unable to type in Input field issue in React [Solved] #
         - To solve the issue of being unable to type in an input field in React, 
         make sure to use the "defaultValue" prop instead of "value" 
         for uncontrolled input fields. */}
        <label htmlFor="firstName">
          First name <p style={{ color: `var(--red)` }}>{`(required)`}</p>
        </label>
        <input
          type="text"
          id="firstName"
          tabIndex={-1}
          defaultValue={user?.firstName}
          ref={ref_firstName}
        />

        <label htmlFor="lastName">
          Last name <p style={{ color: `var(--red)` }}>{`(required)`}</p>
        </label>
        <input
          type="text"
          id="lastName"
          tabIndex={1}
          defaultValue={user?.lastName}
          ref={ref_lastName}
        />

        <h3>Billing Address</h3>

        <label htmlFor="city">
          City <p style={{ color: `var(--red)` }}>{`(required)`}</p>
        </label>
        <input
          type="text"
          id="city"
          tabIndex={2}
          placeholder="City, district, suburb, town, or village"
          defaultValue={user_address && user_address.city}
          ref={ref_city}
        />

        <label htmlFor="line1">
          Address line 1 <p style={{ color: `var(--red)` }}>{`(required)`}</p>
        </label>
        <input
          id="line1"
          type="text"
          tabIndex={3}
          placeholder="e.g., street, PO Box, or company name"
          defaultValue={user_address?.line1 && user_address?.line1}
          ref={ref_line1}
        />

        <label htmlFor="line2">
          Address line 2 <p>{`(optional)`}</p>
        </label>
        <input
          id="line2"
          type="text"
          tabIndex={4}
          placeholder="apartment, suite, unit, or building"
          defaultValue={user_address?.line2 && user_address?.line2}
          ref={ref_line2}
        />

        <label htmlFor="postalCode">
          Postal Code <p style={{ color: `var(--red)` }}>{`(required)`}</p>
        </label>
        <input
          id="postalCode"
          type="text"
          tabIndex={5}
          placeholder="ZIP or postal code"
          defaultValue={user_address?.postal_code && user_address?.postal_code}
          ref={ref_postal_code}
        />

        <label htmlFor="state">
          State <p>{`(optional)`}</p>
        </label>
        <input
          id="state"
          type="text"
          tabIndex={6}
          placeholder="State, county, province, or region"
          defaultValue={user_address?.state && user_address?.state}
          ref={ref_state}
        />

        <label htmlFor="phone">
          Phone <p>{`(optional)`}</p>
        </label>
        <input
          id="phone"
          type="text"
          tabIndex={7}
          placeholder="A valid phone number without country code"
          defaultValue={user_address?.phone && user_address?.phone}
          ref={ref_phone}
        />

        <div className={styles.buttonsContainer}>
          {/* Select the buttons according to the action (profile or checkout) */}
          {action === "checkout" ? (
            <CheckoutButton
              checkForm={checkFields}
              handleUpdate={handleUpdate}
            />
          ) : (
            <>
              <button
                type="submit"
                className={styles.submit}
                onClick={(event) => {
                  handleUpdate(event);
                }}
              >
                {actionRunning === false ? "Update" : "Updating..."}
              </button>

              <button
                className={styles.signout}
                type="button"
                onClick={signout}
              >
                SignOut
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default withAuthenticator(Profile);
