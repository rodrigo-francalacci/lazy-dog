/* React */
import React, { useEffect, useState } from "react";
import Link from "next/link";

/* Style */
import styles from "./Orders.module.scss";
import "@aws-amplify/ui-react/styles.css";

/* Components */
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

/* Custom Hooks */
import { useProfile } from "../../context/profile-context";

/* Amplify */
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";

/* Amplify Configure */
Amplify.configure(JSON.parse(process.env.NEXT_PUBLIC_AMPLIFY_EXPORTS!));
/* import awsmobile from "../../aws-exports";
Amplify.configure(awsmobile); */

/* Types */
type Order = {
    date: string,
    total: string,
    link: string,
    id: string
};

/* 
===================================
PAGE COMPONENT
==================================*/
const Orders = () => {
  //States
  const user = useProfile().userData;
  const mode = useProfile().mode;
  const [orders, setOrders] = useState<Order[]>(null!)

  const actionRunning = useProfile().actionRunning;
  const list = useProfile().listStripeUserCheckouts
  
    useEffect(() => {
      
      if(mode === "EDIT"){getOrders();}

      async function getOrders() {
        const response = await list?.();
        console.log(response)

        let output: Order[] = [];
        response?.data?.length > 0 &&
          response.data.map((item: any) => {
            if(item.payment_intent){
              output.push({
                date: unixDateConverter(item.created),
                total: GBP.format(item.amount_total / 100),
                link: `/Success/Success?session_id=${item.id}&just_retriving=true`,
                id: item.id,
              });
            }
          });
        setOrders(output);
      }
    }, [mode]);

        /* Aux Functions 
  ==========================================================*/

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
 


  if(actionRunning){ return <div className={`${styles.loading} worksans-h2`}><div><LoadingSpinner size="100%"/></div></div>}

  /* JSX PAGE RETURN 
    ++++++++++++++++++++++++++++++++++++++++++++++++++++*/
  return (
    <div className={styles.container}>
      <h2 className="worksans-h2">
        {mode === "EDIT"
          ? `${user?.firstName} ${user?.lastName} Orders`
          : `${user?.username} Orders`}
      </h2>

      <table className={styles.GeneratedTable}>
        <thead>
          <tr>
            <th>DATE</th>
            <th>TOTAL AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {orders?.length > 0 &&
            orders.map((item: Order) => {
              return (
                <tr key={item.id}>
                  <td><Link href={item.link}><a>📄 {item.date}</a></Link></td>
                  <td>{item.total}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default withAuthenticator(Orders);
