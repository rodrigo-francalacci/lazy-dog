export default {
    name: 'dogFriend',
    title: 'Dogs Friends',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Dog Name',
        type: 'string',
      },
      {
        name: 'image',
        title: 'Dog Image',
        type: 'image',
        options: {
          hotspot: true,
        },  
      },
      {
        name: 'bio',
        title: 'Dog Bio',
        type: 'text',
      },
      {
        name: 'instagram',
        title: 'Dog Instagram Link',
        type: 'string',
      },
    ],

    preview: {
      select: {
        title: 'name',
        media: 'image',
      },
    },
  }