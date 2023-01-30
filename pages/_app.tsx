//React
import type { AppProps } from 'next/app'

//Redux
import { store } from '../store'
import { Provider } from 'react-redux'

//Context
import { ProfileProvider } from '../context/profile-context'

//Styles
import '../styles/resets.css'
import '../styles/Theme/theme.scss'
import '../styles/globals.css'
import Layout from '../styles/Layout/Layout'
import Typography from '../styles/Typography/Typography'
import ClampedClasses from '../styles/Clamp/ClampedClasses'





function MyApp({ Component, pageProps}: AppProps) {

  const currentPage: any = pageProps;

  return (
    <Provider store={store}>

      <Typography/>
      <ClampedClasses/>
        {/* Send pageProps to the layout component to pass the 
        data getServerSideProps or getStaticProps data of the current page
        to the layout component. That way I can pass the properties to fill the navbar
        footer, and other parts of the layout. 
          */}
        
        
        <ProfileProvider>
          <Layout layoutProps={currentPage}>
            <Component {...pageProps} />
          </Layout>
        </ProfileProvider>


    </Provider>
  )
}

export default MyApp





