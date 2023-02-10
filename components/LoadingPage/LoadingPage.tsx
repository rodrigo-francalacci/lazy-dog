/* React */
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';

/* Styles */
import styles from './LoadingPage.module.scss'


const Loading = () => {

  //States
  const [loading, seLoading] = useState<boolean>(false)
  const path = useRouter()

  //check this link to understant the route events
  //https://blog.logrocket.com/next-js-routechangestart-router-events/
  //These functions are monitoring when the path changes to trigger the loading page
  useEffect(()=>{

    path.events.on('routeChangeStart', (url, { shallow }) => {
      seLoading(true)
    });

    path.events.on('routeChangeComplete', (url) => {
      seLoading(false)
    });

  },[path.events])

  //if loading is true we return the component
  if(loading === true ){
    return ( 
      <div className={styles.loadingPageContainer}  >
          <div className={styles.loadingPage} >
              <div className={`gooddog-logo prevent-select ${styles.logovibe}`}>
                  <span className={styles.vibe1}>L</span>
                  <span className={styles.vibe2}>a</span>
                  <span className={styles.vibe3}>z</span>
                  <span className={styles.vibe4}>y</span>
                  <span>{` `}</span>
                  <span className={styles.vibe5}>D</span>
                  <span className={styles.vibe6}>o</span>
                  <span className={styles.vibe7}>g</span>
              </div>
{/*               <div className={styles.loader}>
                  <div/>
                  <div/>
              </div> */}
          </div>
      </div>
  )
    }

//else, we return nothing
  else{
      return null
    }

}

export default Loading