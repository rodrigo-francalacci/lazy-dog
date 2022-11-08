export default {
    name: 'categories',
    title: 'Categories',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Category Name',
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
        name: 'description',
        title: 'Page Description',
        type: 'simpleBlockContent',
      },
      {
        name: 'SEO_description',
        title: 'Description for the Search Engine (SEO)',
        type: 'string',
      },
      {
        name: 'heroTitle',
        title: 'Hero Title',
        type: 'string',
      },
      {
        name: "heroImage",
        title: "Hero Image",
        type: 'image',
        options: {
          hotspot: true,
        },  
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
        type: 'array',
        of: [{type: 'string'}]
      },
      {
        name: 'contentMaterials',
        title: 'Content and Materials',
        type: 'array',
        of: [{type: 'string'}]
      },
      {
        name: 'careIntructions',
        title: 'Care Instructions',
        type: 'array',
        of: [{type: 'string'}]
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
      
    ],
    preview: {
      select: {
        title: 'title',
        media: 'heroImage',
      },
    },

    
  }