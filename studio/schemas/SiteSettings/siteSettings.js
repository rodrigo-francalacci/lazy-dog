// schemas/siteSettings.js
export default {
    name: 'siteSettings',
    title: 'Site Settings',
    type: 'document',
    fields: [
      {
        name: 'title',
        description: "This is what will appear in the brownser tabs",
        title: 'Site Title',
        type: 'string'
      },
      {
        name: 'description',
        title: 'Site Description',
        description: 'Description for SEO',
        type: 'text'
      },

      //Products data source
      {
        name: 'productsSource',
        title: 'Products Data Source',
        description: 'Sets the API source for the products data',
        type: 'string',
        validation: Rule => Rule.required(),
        options: {
            list: ["Sanity", "Shopify"]
        }
      },

      //Categories displayed in the navbar
      {
        name: 'categoriesList',
        title: 'Categories List',
        description: 'Categories displayed in the navigation bar',
        type: 'array',
        of: [
        {
          type: 'reference',
          to: [
            {type: 'categories'}
          ]
        }
        ]
      },


      //Contact list
      {
        name: 'contactsList',
        title: "Contacts List",
        type: "array",
        of: [
          {
            name:"contact",
            title:"Contact",
            type: "object",
            fields: [
                {
                    name: "type",
                    title: "Type",
                    type: "string",
                    description: "What is this contact ? (email, phone number, etc...)",
                    options: {
                      list: ["Email", "Phone Number", "Address"]
                    }
                },
                {
                    name: "contact",
                    title: "Contact",
                    type: "string"
                },
            ]
        },
        ]
      },

      //Social Media
      {
        name: 'socialMedias',
        title: "Social Medias References",
        type: "array",
        of: [
          {
            name:"media",
            title:"Media",
            type: "object",
            fields: [
                {
                    name: "name",
                    title: "Name",
                    type: "string",
                    description: "Social media name",
                },
                {
                    name: "link",
                    title: "Link",
                    type: "string",
                    description: "Social media description",
                },
            ]
        },
        ]
      },


      //About Us
      {
        name: 'aboutUs',
        title: "About Us",
        type: "object",
        description: "The about us section information",
        fields:[
          {
            name: "image",
            title: "Image",
            type: "image",
          },
          {
            name: 'text',
            title: "Text",
            type: "blockContent",
          },
        ]
      },

      //Footer
      {
        name: 'footerText',
        title: "Footer Text",
        type: "text",
      },
      
    ]
  }