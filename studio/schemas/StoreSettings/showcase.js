export default {
    name: 'showcase',
    title: 'Showcase',
    type: 'document',
    fields: [
        {
            name: "products",
            title: "Showcase Products",
            type: "array",
            of: [
                {
                    type: "reference",
                    to: [{type: "products"}],
                },
            ]
        },
        {
            name: 'heroTitle',
            title: 'Hero Title',
            type: 'string',
        },
        {
            name: 'heroImage',
            title: 'Hero Image',
            type: 'image',
              options: {
                hotspot: true,
              },  
        },
        {
            name: 'heroDescription',
            title: 'Hero Description',
            type: 'simpleBlockContent',
        },

    ]
  }