export default {
    name: 'banners',
    title: 'Banners',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
      },
      {
        name: 'text',
        title: 'Banner Text',
        type: 'string',
        description: "This is the text that will be displayed on the banner"
      },
      {
        name: 'color',
        title: 'Color',
        type: 'string',
        validation: Rule => Rule.required(),
        options: {
            list: ["Orange", "Blue", "Green"]
        }
      },
      {
        name: 'timer',
        title: 'Timer (seconds)',
        type: 'number',
        validation: Rule => Rule.required().min(1).max(60)
      },
      {
        name: 'link',
        title: 'Link',
        type: 'string',
      },
    
    ]
  }