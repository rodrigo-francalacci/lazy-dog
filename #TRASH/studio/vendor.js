export default {
  name: 'vendor',
  title: 'Vendor',
  type: 'document',

  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',      
    },
    {
      name: 'logo',
      title: 'logo',
      type: 'image',
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'logo',
    },
  },
}
