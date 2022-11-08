export default {
    name: 'products',
    title: 'Products',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Product Name',
        type: 'string',
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: {
          source: 'title',
          maxLength: 96,
        },
      },
      {
        name: "categories",
        title: "Categories",
        type: "array",
        validation: Rule => Rule.required(),
        of: [
            {
                type: "reference",
                to: [{type: "categories"}],
            },
        ]
      },
      {
        name: 'shortDescription',
        title: 'Short Description',
        type: 'string',
      },
      {
        name: 'SEO_description',
        title: 'Description for the Search Engine (SEO)',
        type: 'string',
      },
      {
        name: "price",
        title: "Price",
        type: "number",
        description: "Prince in pounds",
        validation: Rule => Rule.required().min(0)
      },
      {
        name: "weight",
        title: "Weight",
        type: "number",
        description: "Weight in Kilograms",
        validation: Rule => Rule.required().min(0),
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
      {
        name: 'details',
        title: 'Details',
        type: 'array',
        of: [{type: 'string'}]
      },
      {
        name: 'dimensions',
        title: 'Dimensions',
        description: "If left blank, it will inherit the dimensions of its category.",
        type: 'array',
        of: [{type: 'string'}]
      },
      {
        name: 'contentMaterials',
        title: 'Content and Materials',
        description: "If left blank, it will inherit the dimensions of its category.",
        type: 'array',
        of: [{type: 'string'}]
      },
      {
        name: 'careIntructions',
        title: 'Care Instructions',
        description: "If left blank, it will inherit the dimensions of its category.",
        type: 'array',
        of: [{type: 'string'}]
      },
      {
        name: "variants",
        title: "Variants",
        type: "array",
        of:  [{type: "variant"}]
      },
      
    ],
    preview: {
      select: {
        title: 'title',
        media: 'images.0',
      },
    },
  }