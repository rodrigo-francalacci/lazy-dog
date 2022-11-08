export default {
    name: 'author',
    title: 'Author',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Author Name',
        type: 'string',
      },
      {
        name: 'image',
        title: 'Author Image',
        type: 'image',
        options: {
          hotspot: true,
        },  
      },
      {
        name: 'bio',
        title: 'Bio',
        type: 'text',
      },
      {
        name: 'website',
        title: 'Website',
        description: 'Author website, instagram, facebook page, etcs..',
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