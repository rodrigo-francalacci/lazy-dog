// deskStructure.js
//check documentation here: https://www.sanity.io/docs/overview-structure-builder
import S from '@sanity/desk-tool/structure-builder'


export default () =>


  S.list()
    .title('Lazy Dog Company')
    .items([
      
      //SITE SETTINGS
      S.listItem()
        .title('Site Settings')
        .child(
          S.document()
            .title('Site Settings')
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
        
        S.divider(),

         //STORE SETTINGS
         S.listItem()
         .title('Store Settings') // in the "folder"
         .child(
           S.list()
             .title('Store Settings') // "in the collumn header"
             .items([
                 /* ...S.documentTypeListItems().filter(item => !['siteSettings', 'vendor'].includes(item.getId())) */
                 ...S.documentTypeListItems().filter(item => ['categories'].includes(item.getId())),
                 ...S.documentTypeListItems().filter(item => ['banners'].includes(item.getId())),
                 ...S.documentTypeListItems().filter(item => ['giftCards'].includes(item.getId())),
                 S.listItem()
                 .title('Showcase')
                 .child(
                   S.document()
                      .title('Showcase')
                     .schemaType('showcase')
                     .documentId('showcase')
                 ),

             ]),             
         ),


        S.divider(),


        //PRODUCTS
        S.listItem()
        .title('Products') // in the "folder"
        
        .child(
          S.documentTypeList('categories')
          .title('Products')
          .child(categoryId =>
            S.documentList()
              .title('Posts')
              .filter('_type == "products" && $categoryId in categories[]._ref')
              .params({ categoryId })
          )
        ),

  
        //BLOG
        S.listItem()
        .title('Blog')
        .child(
          S.list()
            // Sets a title for our new list
            .title('Blog Stuff')
            .items([
                
              ...S.documentTypeListItems().filter(item => ['post'].includes(item.getId())),
              ...S.documentTypeListItems().filter(item => ['author'].includes(item.getId())),
              ...S.documentTypeListItems().filter(item => ['tags'].includes(item.getId())),
                  

                
            ]),             
        ),

        //DOGS FRIENDS
        ...S.documentTypeListItems().filter(item => ['dogFriend'].includes(item.getId())),

        

    
        ...S.documentTypeListItems().filter(item => !['siteSettings', 'vendor', 'categories', 'banners', 'giftCards', 'products', 'showcase', 'tags', 'author', 'post', 'dogFriend'].includes(item.getId()))
    ])

 