/* React */
import React from 'react'

/* Style */
import styles from './Contact.module.scss'

/* Types */
import { format_contactList, contactListProps } from '../../utils/sanity_queries'

const Contact = ({sanityContacts}: any) => {

//Format, Type and sort the contacts List
const contacts: contactListProps[] = format_contactList(sanityContacts).sort((a, b) => (a.type < b.type) ? 1 : -1);

  return (
    <div className={`worksans-contacts ${styles.container}`}>
       {/*  Mapping and grouping the contacts by type (email, phone number, etc...) */}
        {contacts?.length > 0 && contacts.map((item, index)=>{
            
            if(index==0){
                return (
                <>
                  <h2 key={item.type}>{item.type}</h2>
                  <p key={item.key}>{item.contact}</p>
                </>)
            }

            if(contacts[index].type != contacts[index-1].type){
                return (
                <>
                  <h2 key={item.type} className={styles.titles}>{item.type}</h2>
                  <p key={item.key}>{item.contact}</p>
                </>)
            } else {
                return <p key={item.key}>{item.contact}</p>
            }

        }) }
    </div>
  )
}

export default Contact

/* 
==================================================================================
DATA FETCHING
==================================================================================
*/

/* API */

import { mySanityClient } from '../../lib/sanityClient';
import { contactListQuery } from '../../utils/sanity_queries'


export async function getStaticProps() {

    //FROM SANITY
    //Get the list of contacts from sanity
    const sanityContacts = await mySanityClient.fetch(contactListQuery);
    
  
  return {
   props: {
    sanityContacts: sanityContacts,
  }

 }
};