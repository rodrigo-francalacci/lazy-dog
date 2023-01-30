/* React */
import React, { useEffect, useState, useContext, useRef } from "react";
import { useRouter } from "next/router";

/* Amplify */
import { Amplify, Auth, API, graphqlOperation } from "aws-amplify";
import { Hub } from "aws-amplify";
import { createUser, updateUser } from "../utils/graphql/mutations";
import { getUser, listUsers } from "../utils/graphql/queries";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/auth";

/* Redux */
import { useAppSelector, useAppDispatch } from "../hooks";
import { loadCart } from "../slices/cartSlice";

/* Sanity */
import { format_productsInCategory } from "../utils/sanity_queries";
import { mySanityClient } from "../lib/sanityClient";

/* Stripe */
import getStripe from "../lib/getStripe";
import { fetchPostJSON, fetchGetJSON } from "../utils/api-helpers";

/* Types */
import { productProps } from "../utils/shopify_colllection_query";

/* Amplify Configure */
/* import awsmobile from "../aws-exports";
Amplify.configure(awsmobile); */
Amplify.configure(JSON.parse(process.env.NEXT_PUBLIC_AMPLIFY_EXPORTS!));

export type UserData = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  adress: string;
  stripeData: string;
  stripeOrders: string[];
  wishlist: string[];
  cartState: string;
  createdAt: string;
  updatedAt: string;
};

type Mode = "EDIT" | "ADD" | "GUEST";

export type Profile = {
  userData: UserData;
  mode: Mode;
  signOutHandler: () => void;
  UpdateUser: (input: UserData) => void;
  UpdateWishlist: (wishlist: string[]) => void;
  listStripeUserCheckouts: () => any;
  updateStripeUser: (input: string) => void;
  wishlist: productProps[];
  greeting: string;
  actionRunning: boolean;
};

/* 
===================================
COMPONENT
==================================*/
const ProfileContext = React.createContext<Partial<Profile>>(null!);
const ProfileProvider = ({ children }: { children: React.ReactNode }) => {

  /* STATES AND REFS */
  const currentCartState = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData>(userDataBuilder(null, null, "GUEST"));
  const [mode, setMode] = useState<Mode>("GUEST");
  const [greeting, setGreeting] = useState<string>(findPhrase());
  const [wishlist, setWishlist] = useState<productProps[]>([]);
  const [actionRunning, setActionRunning] = useState<boolean>(false);
  const [action, setAction] = useState<string>("loadingPage");

  /* LOADING PAGE HANDLER
================================================= */

  //(1) Loading useEffect
  useEffect(() => {
    setAction("loadLocalStorage");
  }, []);

  useEffect(() => {
    //Listen to auth events singIn and singOut
    const cancelSignInListen = Hub.listen("auth", (data) => {
      //Event = signIn
      if (data.payload.event === "signIn") {
        console.log("SingIn => loading user data...");
        setAction("signInLoadData");
      }
    });

    switch (action) {
      case "loadLocalStorage":
        loadLocalStorage();
        break;

      case "signInLoadData":
        signInLoadData();
        break;

      case "signOutCleaner":
        signOutCleaner();
        break;

      default:
        break;
    }

    return () => {
      //Clear the auth listening event
      cancelSignInListen();
    };
  }, [action]);

  //(2) Check local storage
  function loadLocalStorage() {
    console.log("Checking local storage...");
    const storage_userData = JSON.parse(
      localStorage.getItem("lazyDogUserData")!
    );

    //Case local storage is empty
    if (storage_userData === null) {
      console.log("No local storage detected...");
      console.log("Creating local storage with default data...");
      localStorage.setItem("lazyDogUserData", JSON.stringify(userData)); //Local Storage
      localStorage.setItem("lazyDogUserMode", JSON.stringify(mode)); //Local Storage
    }

    //Case local storage has data
    else {
      console.log("Local storage detected!");
      console.log("Retriving data from localstorage...");

      //LOAD THE STATE
      const lastUserData: UserData = JSON.parse(localStorage.getItem("lazyDogUserData")!);
      const lastMode: any = JSON.parse(localStorage.getItem("lazyDogUserMode")!);
      setUserData(lastUserData);
      setMode(lastMode);
      get_wishlist_items_from_sanity(lastUserData.wishlist); //Fetch wishlist items from sanity

      //LOAD THE REDUX STATE
      dispatch(loadCart(lastUserData.cartState));

      //End of this action
      setAction("none");
    }
  }

  //(3) Load after SignIn
  async function signInLoadData() {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const userInfo: any = await API.graphql({
        query: getUser,
        variables: { id: user.attributes.sub },
        authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
      });
      let currentUserData: UserData;

      /* EDIT MODE 
    we don't need to create a dynamoDB table and we are gonna 
    recall information from this user database (dynamoDB table)*/
      if (userInfo.data.getUser) {
        console.log("EDIT mode running");

        //Load User Data
        currentUserData = userDataBuilder(user, userInfo.data.getUser, "EDIT");
        setUserData(currentUserData); //Local state
        dispatch(loadCart(userInfo.data.getUser.cartState)); //Local state Redux
        localStorage.setItem("lazyDogUserData", JSON.stringify(currentUserData)); //Local Storage
        setMode("EDIT"); //Local State
        localStorage.setItem("lazyDogUserMode", JSON.stringify("EDIT")); //Local Storage
        get_wishlist_items_from_sanity(currentUserData.wishlist); //Fetch wishlist items from sanity

        /* ADD MODE 
        It's the first time the user login 
        so we need to create a dynamoDB table*/
     } else {
        console.log("ADD mode running");
        const stripeData = await createStripeUser(user);
        

        //Create the dynamoDB table for the first time
        const send = {
          id: user.attributes.sub,
          username: user.username,
          firstName: "",
          lastName: "",
          stripeOrders: [],
          adress: "",
          stripeData: stripeData?.id,
          wishlist: [],
          cartState: JSON.stringify(currentCartState),
        };

        await API.graphql(graphqlOperation(createUser, { input: send }));
        console.log("DynamoDB table has been created")

        //Load User Data
        currentUserData = userDataBuilder(user, stripeData?.id, "ADD");
        setUserData(currentUserData); //Local State
        localStorage.setItem(
          "lazyDogUserData",
          JSON.stringify(currentUserData)
        ); //Local Storage
        setMode("EDIT"); //Local State --> Once the table is created we set the mode='EDIT'
        localStorage.setItem("lazyDogUserMode", JSON.stringify("EDIT")); //Local Storage
      }

      //Here is when the user does not have an account
    } catch (err) {
      console.log("loading in mode GUEST");
      console.log(err);
    }

    //End of this action
    setAction("none");
  }

  //(4) SignOut -> clean and reset data
  function signOutCleaner() {
    setMode("GUEST"); // Reset mode state
    setUserData(userDataBuilder(null, null, "GUEST")); //Reset User Data
    dispatch(loadCart(`{"cart":[],"subtotal":0,"numberOfItems":0}`)); //Clean Redux
    localStorage.removeItem("lazyDogUserData");
    localStorage.removeItem("lazyDogUserMode");

    //End of this action
    setAction("none");
  }

 /* ++++++++++++++++++++++++++++++++++++++ UPDATE FUNCTIONS +++++++++++++++++++++++++++++++++++++*/

  /* UPDATE CART 
  Track and update the changes in the cart*/
  useEffect(() => {
    if (action === "none") {
      updateUserCart();
    }
  }, [currentCartState]);

  function updateUserCart() {
    console.log("Updating the cart state...");

    let currentUserState = userData;
    let newCart = JSON.stringify(currentCartState);
    currentUserState.cartState = newCart;
    setUserData(currentUserState); //Local State
    localStorage.setItem("lazyDogUserData", JSON.stringify(currentUserState)); //Local Storage
    if (mode === "EDIT") {
      updateCart_in_DynamoDB(newCart);
    }

    async function updateCart_in_DynamoDB(newCart: string) {
      console.log("mode = EDIT => Updating cart in DynamoDB...");
      const currentUser = await Auth.currentAuthenticatedUser();
      const send = {
        id: currentUser.attributes.sub,
        cartState: newCart,
      };
      await API.graphql(graphqlOperation(updateUser, { input: send }));
    }
  }

  /* SIGN OUT
  Sign the iser out and call the functions to 
  clear data and redirect to the home page*/
  async function signOutHandler() {
    try {
      await Auth.signOut();
      console.log("SingOut => Cleaning data...");
      setAction("signOutCleaner");
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  }

  /* UPDATE USER 
  Track and update the changes in the user data*/
  async function UpdateUser(input: any) {
    setActionRunning(true);

    const currentUser = await Auth.currentAuthenticatedUser();

    const send_to_DynamoDB = {
      id: currentUser.attributes.sub,
      username: currentUser.username,
      firstName: input.firstName,
      lastName: input.lastName,
      adress: JSON.stringify({
        city: input.city,
        country: "GB",
        line1: input.line1,
        line2: input.line2,
        postal_code: input.postal_code,
        state: input.state,
        phone: input.phone
      }),
      stripeData: input.stripeData,
      stripeOrders: input.stripeOrders,
      cartState: JSON.stringify(currentCartState),
    };

    //Updata the local state
    let currentUserDataState = userData;
    currentUserDataState.firstName = input.firstName;
    currentUserDataState.lastName = input.lastName;
    currentUserDataState.adress = JSON.stringify({
      city: input.city,
      country: "GB",
      line1: input.line1,
      line2: input.line2,
      postal_code: input.postal_code,
      state: input.state,
      phone: input.phone
    });
    currentUserDataState.cartState = JSON.stringify(currentCartState);

    //Update the dynamoDB table
    await API.graphql(graphqlOperation(updateUser, { input: send_to_DynamoDB }));

    //Update the state
    setUserData(currentUserDataState);

    //Update localstorage
    localStorage.setItem(
      "lazyDogUserData",
      JSON.stringify(currentUserDataState)
    );

    //Update User in Stripe
    const send_to_stripe = {
      description: `${input.firstName} ${input.lastName}`,
      email: userData.email,
      phone: input.phone,
      name: `${input.firstName} ${input.lastName}`,
      address:{
        city  : input.city,
        country: "GB",
        line1: input.line1,
        line2: input.line2,
        postal_code: input.postal_code,
        state: input.state,
      },
  }
    await updateStripeUser(send_to_stripe)

    setActionRunning(false);
    console.log("User information has been updated");
  }

  /* UPDATE THE WISHLIST ITEMS */
  async function UpdateWishlist(input: string[]) {
    setActionRunning(true);

    //If it's a GUEST user, we send to the profile page to create an accont
    if (mode === "GUEST") {
      router.push("/Profile/Profile");

      //If it already has an account
    } else {
      const currentUser = await Auth.currentAuthenticatedUser();

      //And if this account has a dynamoDB table
      if (mode === "EDIT") {
        const send = {
          id: currentUser.attributes.sub,
          wishlist: input,
        };
        await API.graphql(graphqlOperation(updateUser, { input: send }));
      }

      //Update the wishlist items state
      let currentUserDataState = userData;
      currentUserDataState.wishlist = input;
      setUserData(currentUserDataState);

      //Update localstorage
      localStorage.setItem(
        "lazyDogUserData",
        JSON.stringify(currentUserDataState)
      );

      //Load the items from sanity
      get_wishlist_items_from_sanity(input);
    }

    setActionRunning(false);
  }

  /* +++++++++++++++++++++++++++++++++++++++ AUX FUNCTIONS ++++++++++++++++++++++++++++++++++++++*/

  /* Build the userData with the right type and
  acording to the mode (GUEST, EDIT or ADD) */
  function userDataBuilder(
    user: any,
    userInfo: any,
    builderMode: Mode
  ): UserData {
    let output = {
      id: "",
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      adress: "{}",
      stripeData: "",
      stripeOrders: [],
      wishlist: [],
      cartState: JSON.stringify(currentCartState),
      createdAt: "",
      updatedAt: "",
    };

   
    switch (builderMode) {
      case "EDIT":
        output = {
          id: userInfo.id,
          username: userInfo.username,
          email: user.attributes.email,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          adress: userInfo.adress,
          stripeData: userInfo.stripeData,
          stripeOrders: userInfo.stripeOrders,
          wishlist: userInfo.wishlist,
          cartState: userInfo.cartState,
          createdAt: userInfo.createdAt,
          updatedAt: userInfo.updatedAt,
        };
        break;

      case "ADD":
        output.id = user.attributes.id;
        output.email = user.attributes.email;
        output.username = user.username;
        output.stripeData = userInfo;
        output.cartState = userData
          ? userData.cartState
          : JSON.stringify(currentCartState);
        break;

      case "GUEST":
        break;
    }

    return output;
  }

  /* Fetch from Sanity the items in the wishlist
  and let them ready to be used */
  async function get_wishlist_items_from_sanity(list: string[]) {
    //We only fetch data from Sanity if there is data to fetch.
    if (list.length > 0) {
      let productsQuery = "";

      //If we have only one item in the wishlist
      if (list?.length === 1) {
        productsQuery = `slug.current == '${list[0]}'`;
      } else {
        //If we have more than one item
        list?.length > 0 &&
          list.map((item: string, index: number) => {
            switch (index) {
              case 0:
                productsQuery = `slug.current == '${item}' ||`;
                break;

              case list.length - 1:
                productsQuery = `${productsQuery} slug.current == '${item}'`;
                break;

              default:
                productsQuery = `${productsQuery} slug.current == '${item}' ||`;
                break;
            }
          });
      }

      const query = `${"*[_type == 'products' && ("}${productsQuery.trim()}
                ${")]{"}
                ${"title, slug{current}, images[0], price, shortDescription, categories[0]->{_id, slug}"}}`;

      try {
        console.log("Fetching wishlist data from Sanity...")
        const products = await mySanityClient.fetch(query);
        const output: productProps[] = format_productsInCategory({ products });
        setWishlist(output);
      } catch (err) {
        console.log(err);
        setWishlist([]);
      }

      //If there is nothing to fetch we simply setWishlist([])
    } else {
      setWishlist([]);
    }
  }

  /* Greeting function generator 
  ===============================================================================================*/
  function findPhrase() {
    const time = new Date().getHours();
    if (time >= 0 && time < 6) {
      return "Good night";
    }
    if (time >= 6 && time < 12) {
      return "Good morning";
    }
    if (time >= 12 && time < 16) {
      return "Good afternoon";
    }
    if (time >= 16 && time < 21) {
      return "Good evening";
    }
    if (time >= 21 && time < 24) {
      return "Good night";
    }
    return "Hello";
  }

  // Trigger the update interval on startup (mount)
  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(findPhrase());
    }, 300000);

    return () => clearInterval(interval);
  }, []); // Empty dependencies array, so it will run once at mount and keep running 'in the background'


  /* +++++++++++++++++++++++++++++++++++ STRIPE OPERATIONS +++++++++++++++++++++++++++++++++++++*/
  
  //Create Stripe User
  async function createStripeUser(cognitoUser: any) {

  const params = {
      description: cognitoUser.attributes.email,
      email: cognitoUser.attributes.email,
      metadata: {
        dynamoDB_id: cognitoUser.attributes.sub
    },
  }
    
  // Create a User on Stripe
  const response = await fetchPostJSON("/api/customer/create", params);

  
  if (response.statusCode === 500) {
    console.error(response.message);
    return;
  }
  console.log("Stripe customer has been created")

  return response;
};

  // Update a User on Stripe
  async function updateStripeUser(input: any) {

    const params = {
        description: input.description,
        email: userData.email,
        phone: input.phone,
        name: input.name,
        address:{
          city: input.address.city,
          country: input.address.country,
          line1: input.address.line1,
          line2: input.address.line2,
          postal_code: input.address.postal_code,
          state: input.address.state,
          phone: input.address.phone
        },
    }
    
 
  const response = await fetchPostJSON(`/api/customer/update/?costumer_id=${userData.stripeData}`, params);

  
  if (response.statusCode === 500) {
    console.error(response.message);
    return;
  }
  console.log("Stripe customer has been updated")

};

  //List Stripe User Sessions Checkouts
  async function listStripeUserCheckouts() {
    
      
    if(mode === 'EDIT'){
    
    const response = await fetchGetJSON(
      `/api/customer/list_checkout_sessions?costumer_id=${userData.stripeData}`
      );
  
    
    if (response.statusCode === 500) {
      console.error(response.message);
      return;
    }
    console.log("List of the costumer's checkouts has been loaded")
  
    return response;

    }

 
    
  };

  /* +++++++++++++++++++++++++++++++++++++++ JSX CONTEXT RETURN ++++++++++++++++++++++++++++++++*/
  return (
    <ProfileContext.Provider
      value={{
        userData,
        greeting,
        actionRunning,
        mode,
        signOutHandler,
        UpdateUser,
        UpdateWishlist,
        listStripeUserCheckouts,
        wishlist
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

/* EXPORTING
============================================== */
//Export Provider to wrap the components
export { ProfileProvider };

//Use Profile Hook
export function useProfile() {
  return useContext(ProfileContext);
}
