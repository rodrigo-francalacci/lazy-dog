export default {
    name: 'post',
    title: 'Post',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Post Title',
        type: 'string',
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        validation: Rule => Rule.required(),
        options: {
          source: 'title',
          maxLength: 96,
        },
      },
      {
        name: "author",
        title: "author",
        validation: Rule => Rule.required(),
        type: "reference",
        to: [{type: "author"}],
      },
      {
        name: "tags",
        title: "Tags",
        validation: Rule => Rule.required(),
        type: "array",
        of: [
            {
                type: "reference",
                to: [{type: "tags"}],
            },
        ]
      },
      {
        name: 'publishedAt',
        title: 'Published at',
        type: 'datetime',
      },
      {
        name: 'thumbnail',
        title: 'Thumbnail',
        type: 'image',
        options: {
          hotspot: true,
        },  
      },
      {
        name: 'description',
        title: 'Description',
        description: 'Brief description for SEO purposes', 
        type: 'string',
      },
      {
        name: 'body',
        title: 'Body',
        type: 'blockContent',
      },
      
      
    ],
    preview: {
      select: {
        title: 'title',
        media: 'thumbnail',
      },
    },
  }