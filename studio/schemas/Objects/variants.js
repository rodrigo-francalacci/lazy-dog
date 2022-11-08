export default {
    name: 'variant',
    title: 'Variant',
    type: 'object',
    fields: [
      {
        name: 'name',
        title: 'Name',
        type: 'string',
      },
      {
          name: "options",
          title: "Options",
          type: "array",
          of: [{
              name: 'option',
              type: "object",
              fields: [
                  {
                    name: "option",
                    title: "Option",
                    type: "string"
                  },
                  {
                    name: "price",
                    title: "Price (Pounds)",
                    type: "number",
                    description: "If left blank, it will inherit the default price.",
                    validation: Rule => Rule.min(0)
                  },
                  {
                    name: "weight",
                    title: "Weight ( Kilograms)",
                    type: "number",
                    description: "If left blank, it will inherit the default weight.",
                    validation: Rule => Rule.min(0)
                  },
                  {
                    name: 'images',
                    title: 'Images',
                    type: 'array',
                    of: [{
                      type: 'image',
                      options: {
                        hotspot: true,
                      },  
                    }]
                  },
              ]
          }]
      }
      
    ]
  }