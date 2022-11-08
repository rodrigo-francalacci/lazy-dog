// /schemas/schema.js
import createSchema from 'part:@sanity/base/schema-creator'
import schemaTypes from 'all:part:@sanity/base/schema-type'

//Site Settings Section
import siteSettings from './SiteSettings/siteSettings'

//Store Settings Section
import categories from './StoreSettings/categories'
import banner from './StoreSettings/banners'
import giftCards from './StoreSettings/giftCards'
import showcase from './StoreSettings/showcase'

//Products Section
import products from './Products/products'

//Blog Section
import author from './Blog/author'
import tags from './Blog/tags'
import post from './Blog/posts'

//Dogs Friends Section
import dogFriend from './DogsFriends/dogFriend'

//Objects
import vendor from './vendor'
import blockContent from './Objects/blockContent'
import simpleBlockContent from './Objects/simpleBlockContent'
import variant from './Objects/variants'

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  name: 'default',
  types: schemaTypes.concat([
    
    //Site Settings
    siteSettings,

    //Store Settings
    categories,
    showcase,
    banner,
    giftCards,


    //Products
    products,

    //Blog 
    post,
    author,
    tags,

    //Dogs Friends
    dogFriend,

    //Objects
    blockContent,
    simpleBlockContent,
    variant,
    
    vendor
  ]),
})