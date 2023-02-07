// page.js

export default {
  
    // Setup a 'document' type to house the page builder field
    
    name: "page",
    type: "document",
    title: "Page",
    fields: [
      {
        name: 'pageBuilder',
        type: 'array',
        title: 'Page builder',
        of: [
          { type: 'hero' }, // hero.js (same applies for the other types)
          { type: 'textWithIllustration' },
          { type: 'callToAction' },
          { type: 'gallery' },
          { type: 'form' },
          { type: 'video' },
          // etc...
          ]
      }
    ]
  }