
import type { AppProps } from 'next/app'

//Redux
import { store } from '../store'
import { Provider } from 'react-redux'

//Styles
import '../styles/resets.css'
import '../styles/Theme/theme.scss'
import '../styles/globals.css'
import Layout from '../styles/Layout/Layout'
import Typography from '../styles/Typography/Typography'
import ClampedClasses from '../styles/Clamp/ClampedClasses'


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>


      
      <Typography/>
      <ClampedClasses/>

      <Layout>
        <Component {...pageProps} />
      </Layout>
      
    </Provider>
  )
}

export default MyApp
