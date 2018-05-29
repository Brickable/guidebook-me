
export const environment = {
  production: false,
  defaultStaticContent:  {version: 'v1'},
  documentationRoot: 'markdown',
  versions: [
    {
      name: 'v1',
      id: 'v1',
      documents: ['Introduction.md', 'Getting_Started.md'],
      nodes: [
        {
          name: 'API_Endpoint_Reference',
          nodes: [
            {name: 'Dictionaries', documents: ['Overview.md', 'Album.md', 'Albums.md']},
            {name: 'Policies', documents: ['Overview.md', 'POST_Policy.md']},
            {name: 'Quotes', documents: ['Overview.md', 'POST_Quote.md']},
          ]
        },
        {
          name: 'Guides',
          nodes: [
            {name: 'Authorization', documents: ['authorization.md']},
            {name: 'Configuration & Implementation', documents: ['configuration.md', 'implementation.md']},
          ]
        },
      ]
    },
    {
      name: 'v2',
      id: 'v2',
      documents: ['Getting_Started.md'],
      nodes: [
        {
          name: 'API',
          nodes: [
            {name: 'Products', documents: ['product.md']},
            {name: 'Users', documents: ['user.md']},
            {name: 'Products', documents: ['product.md']},
            {name: 'Users', documents: ['user.md']},
          ]
        },
        {
          name: 'Guides',
          nodes: [
            {name: 'Authorization', documents: ['authorization.md']},
            {name: 'Configuration & Implementation', documents: ['configuration.md', 'implementation.md']},
          ]
        },
      ]
    },
  ]
};
