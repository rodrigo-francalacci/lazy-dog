export default {
    name: 'giftCards',
    title: 'Gift Cards',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
        validation: Rule => Rule.required()
      },
      {
        name: 'description',
        title: 'Description',
        type: 'string',
      },
      {
        name: 'code',
        title: 'Card Code',
        type: 'string',
        validation: Rule => Rule.required()
      },
      {
        name: 'discount',
        title: 'Discount (percentage)',
        type: 'number',
        validation: Rule => Rule.required().min(0).max(100)
      },
      {
        name: "products",
        title: "Products",
        description: "Choose the products that the discount applies to or leave blank to apply the discount to all products in the shop",
        type: "array",
        of: [{type: 'string'}]
      }
      
    ]
  }