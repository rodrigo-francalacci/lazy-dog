/* React/Next */
import { useState, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { fetchGetJSON } from "../../utils/stripe-api-helpers";

/* Styles */
import styles from "./Success.module.scss";

/* Context Profile */
import { useProfile } from "../../context/profile-context";

/* Redux */
import { useAppDispatch } from "../../redux/hooks";
import { loadCart } from "../../redux/slices/cartSlice";


const Success: NextPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const stripeCustomer_id = useProfile().userData?.stripeData

  // Fetch CheckoutSession from static page via
  // https://nextjs.org/docs/basic-features/data-fetching#static-generation
  const [data, setData] = useState<any>(null!);

  useEffect(() => {
    const apiRoute = router.query.session_id
      ? `/api/checkout_sessions/success?session_id=${router.query.session_id}`
      : null;

      //check if it the user is just trying to retrive an information so we don't have to empty the cart
      const just_retriving = router.query.just_retriving;

    getData();
    async function getData() {
      let response = null;

      //if apiRout is valid
      if (apiRoute) {
        
        //if is canceling we show up the "oops message..."
        if (router.query.session_id === "canceled") {
          setData("canceled");

        //if its not canceling
        } else {
          //we fetch the data
          response = await fetchGetJSON(apiRoute);

          //if this customer cannot access the data
          if(response.checkout_session?.customer !== stripeCustomer_id){
            setData("access_denied");
          
          // if the data belongs to the current customer
          } else {
            setData(response);
          }
          
          //we don't have to reset the cart if we are jus retriving data
          if(just_retriving !== "true"){dispatch(loadCart(`{"cart":[],"subtotal":0,"numberOfItems":0}`));}
          
        }
      }
    }

  }, [router.isReady]);


  if (data === null)
    return <h2 className={`${styles.notice} worksans-h2`}>Loading...</h2>;

 if (data === "canceled")
   return (
     <h2 className={`${styles.notice} worksans-h2`}>
       Ooops...Something went wrong please try again
     </h2>
   );

   if (data === "access_denied")
   return (
     <h2 className={`${styles.notice} worksans-h2`}>
       Access denied !
     </h2>
   );


  /* Aux Functions 
  ==========================================================*/
  function shippingAdressBuilder(address: any) {
    let out = "";
    out = `${out} ${address.line1 && address.line1}`;
    out = `${out}${address.line2 ? ` ,${address.line2}` : ""}`;
    out = `${out}, ${address.postal_code && address.postal_code}`;
    out = `${out}, ${address.city && address.city}`;
    return out;
  }

  //Format the price above to USD using the locale, style, and currency.
  let GBP = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  });

  //Format date
  function unixDateConverter(unixDate: number) {
    let date = new Date(unixDate * 1000);
    return `${date.toLocaleDateString("en-GB")} ${date.toLocaleTimeString(
      "en-GB"
    )}`;
  }

  /* JSX return 
  ==========================================================*/
  return (
    <div className={`${styles.container} worksans-paragraph`}>
      <h2 className="worksans-h2">Checkout Sumary</h2>
      <hr />

      <ul>
        <li>
          <strong>STATUS:</strong>{" "}
          {data?.checkout_session?.payment_intent?.status ?? "loading..."}
        </li>
        <li>
          <strong>CUSTOMER ID:</strong>{" "}
          {data?.checkout_session?.customer }
        </li>
        <li>
          <strong>PAYMENT INTENT:</strong>{" "}
          {data?.checkout_session?.payment_intent?.id }
        </li>
        <li>
          <strong>DATE:</strong>{" "}
          {unixDateConverter(data?.checkout_session?.created)}
        </li>
        <li>
          <strong>NAME:</strong> {data?.checkout_session?.customer_details.name}
        </li>
        <li>
          <strong>EMAIL:</strong>{" "}
          {data?.checkout_session?.customer_details.email}
        </li>
        <li>
          <strong>SHIPPING ADDRESS:</strong>{" "}
          {shippingAdressBuilder(
            data?.checkout_session?.shipping_details?.address
            ?
            data?.checkout_session?.shipping_details.address
            :
            data?.checkout_session?.customer_details.address
          )}
        </li>
        <li>
          <strong>BILLING ADDRESS:</strong>{" "}
          {shippingAdressBuilder(
            data?.checkout_session?.customer_details?.address
            ?
            data?.checkout_session?.customer_details?.address
            :
            data?.checkout_session?.shipping_details.address
          )}
        </li>
      </ul>
      <hr />
      <div>
        <table className={styles.GeneratedTable}>
          <thead>
            <tr>
              <th>Description</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {data?.sessionItems?.data?.length > 0 &&
              data.sessionItems.data.map((item: any) => {
                return (
                  <tr key={item.id}>
                    <td>{item.description}</td>
                    <td style={{ textAlign: "center" }}>
                      {GBP.format(item.price.unit_amount / 100)}
                    </td>
                    <td style={{ textAlign: "center" }}>{item.quantity}</td>
                    <td style={{ textAlign: "center" }}>
                      {GBP.format(item.amount_total / 100)}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Success;
