# Lazy Dog Company

## Overview
This project aimed to create an Ecommerce for Lazy Dog Company based in Swindon UK. The idea was to create a fast website with a good SEO performance. To do this it has been used Next JS due to its ability to render the pages on the server making them visible to search engines. Using dynamic routes we can managed to make each product visible to the search engine. 
This is a dynamic page, since the user can login and save personal data, however, the data of the static part of the site is stored in Sanity while the dynamic part is stored in a DynamoDB table from Amazon AWS, and Stripe. The application is also equipped to import data from Shopify, in case the site administrator prefers to store his products there instead of in Sanity.
The checkout system is all handled by Stripe. This makes the site very reliable for payment systems.
The authentication system is Cognito from Amazon AWS.
Typescript was used to ensure consistency and agility in maintenance. 
All components of this project were built from scratch. Swipers, sliders and everything else. The idea was to rely less on plugins and better understand the React technology. 
It's worth checking inside the "/styles/Clamp" folder the function system developed to calculate both Typography and classes that adapt perfectly, speeding up the website stylization process. 

## References

Some useful references used in this project

### Shopify
- https://youtu.be/md98Phfnyt4
- https://www.youtube.com/watch?v=-XdLG4evyQw
- https://www.sanity.io/exchange/integration=shopify
- https://blog.logrocket.com/build-ecommerce-app-nextjs-shopify/
- https://blog.logrocket.com/building-a-next-js-shopping-cart-app/
- https://www.commoninja.com/blog/build-an-e-commerce-app-with-shopify-and-next-js#Connecting-Nextjs-App-With-Shopify
- https://youtu.be/QF4Y7RHJ3m4
- https://www.telerik.com/blogs/build-fast-ecommerce-site-nextjs-shopify
- https://youtu.be/ut80vIHj_g8

### Stripe
- https://vercel.com/guides/getting-started-with-nextjs-typescript-stripe
- https://blog.logrocket.com/integrating-stripe-react-stripe-js/
- https://stripe.com/docs/payments
- https://stripe.com/docs/api/charges/create
- https://www.youtube.com/watch?v=e-whXipfRvg&t=230s
- https://enlear.academy/complete-guide-to-amplify-and-next-js-7dd2b683282a
- https://github.com/vercel/next.js/tree/canary/examples/with-stripe-typescript

### Sanity
- https://youtu.be/yhfGEpGalSg
- https://www.sanity.io/docs/manually-group-items-in-a-pane
- https://youtu.be/AaKfuhndEf8
- https://www.sanity.io/guides/parent-child-taxonomy
- https://www.youtube.com/watch?v=woA5MKmARNU
- https://github.com/sanity-io/sanity-template-kitchen-sink
- https://www.sanity.io/docs/overview-structure-builder
- https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
- https://stackoverflow.com/questions/58837375/old-records-still-showing-on-sanity
- https://focusreactive.com/sanity-customization/
- https://css-tricks.com/recreating-the-codepen-gutenberg-embed-block-for-sanity-io/
- https://christianlobaugh.com/blog/2020/01/how-to-add-custom-icons-to-your-sanity-io-studio-s-portable-text/
- https://www.sanity.io/schemas/mutate-set-or-change-values-deep-within-documents-psPXQ26_wA_i

### Typescript
- https://stackoverflow.com/questions/68606844/second-parameter-type-depends-on-first-param-in-typescript

### Next JS
- Image Optimization (https://youtu.be/R4sdWUI3-mY)
- https://stackoverflow.com/questions/66914855/next-js-opt-out-of-layout-component-for-specific-pages-from-app-js
- https://nextjs.org/docs/basic-features/layouts
- https://www.sanity.io/plugins/next-sanity-image
- https://stackoverflow.com/questions/70867969/page-loader-on-nextjs
- https://blog.bitsrc.io/nextjs-splash-screen-7c8b528c69a2
- https://mediajams.dev/post/[object%20Object]
- https://www.youtube.com/watch?v=fWoI9DXmpdk&t=887s
- https://doc.sitecore.com/xp/en/developers/hd/190/sitecore-headless-development/component-level-data-fetching-in-jss-next-js-apps.html
- https://stackoverflow.com/questions/71059620/reusing-getstaticprops-in-next-js
- https://stackoverflow.com/questions/60899880/next-js-reduce-data-fetching-and-share-data-between-pages
- https://jamesperkins.dev/post/page-to-page-loading-in-next/
- https://vercel.com/templates/next.js/blog-next-sanity
- https://nextjs.org/blog/next-12-1#on-demand-incremental-static-regeneration-beta

### React 
- https://www.codedaily.io/tutorials/Creating-a-Reusable-Window-Event-Listener-Hook-with-useEffect-and-useCallback
- https://stackoverflow.com/questions/64200602/how-to-reset-the-timer-using-useeffect-react-hooks
- https://medium.com/programming-essentials/how-to-access-the-state-in-settimeout-inside-a-react-function-component-39a9f031c76f
- https://stackoverflow.com/questions/48714602/how-can-i-create-a-style-element-and-append-to-head-in-react
- https://snipcart.com/blog/react-nextjs-single-page-application-seo
- https://www.techomoro.com/render-dynamic-title-and-meta-tags-in-a-next-js-app/
- https://devtrium.com/posts/async-functions-useeffect
- https://dominicarrojado.com/posts/how-to-create-your-own-swiper-in-react-and-typescript-with-tests-part-1/
- https://www.sitepoint.com/community/t/can-you-have-addeventlistener-within-another-addeventlistener/382252
- https://blog.logrocket.com/using-localstorage-react-hooks/
- https://auth0.com/blog/complete-guide-to-react-user-authentication/
- https://stackoverflow.com/questions/32370994/how-to-pass-props-to-this-props-children
- https://stackoverflow.com/questions/64732498/how-to-pass-a-prop-to-children-in-react
- https://atomizedobjects.com/blog/quick-fixes/how-to-pass-props-to-children-in-react/


### Redux
- https://javascript.plainenglish.io/step-by-step-tutorial-react-redux-2022-with-hooks-3b5d63b18be9
- https://blog.openreplay.com/building-a-shopping-cart-in-react-with-redux-toolkit-and-redux-persist
- https://www.commoninja.com/blog/guide-to-state-management-in-next-js#Redux
- https://www.geeksforgeeks.org/how-to-persist-redux-state-in-local-storage-without-any-external-library/amp/

### Css
- https://blog.logrocket.com/css-transitions-animating-hamburger-menu-button/
- https://fossheim.io/writing/posts/css-text-gradient/
- https://stackoverflow.com/questions/43381730/how-to-get-a-border-around-body-tag-without-it-cutting-off
- https://www.kirupa.com/canvas/creating_animations_canvas.htm#
- https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/
- https://cssgrid-generator.netlify.app/
- https://grid.layoutit.com/
- https://gnowland.medium.com/simple-scss-autoprefixer-setup-4749a9327b1a
- https://www.w3schools.com/CSSref/css3_pr_pointer-events.php
- https://stackoverflow.com/questions/28345222/css3-keyframe-animation-which-runs-on-hover
- https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_typewriter
