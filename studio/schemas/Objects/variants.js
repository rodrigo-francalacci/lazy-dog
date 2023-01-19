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
                    type: "string",
                    validation: Rule => Rule.required()
                  },
                  {
                    name: "price",
                    title: "Price Increment/Decrement (Pounds)",
                    type: "number",
                    description: "Set the price increment or decrement for this option.",
                    validation: Rule => Rule.required()
                  },
                  {
                    name: "weight",
                    title: "Weight ( Kilograms)",
                    type: "number",
                    description: "Left it blank if this option does not affect the weight.",
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