
export const environment = {
  production: false,
  defaultStaticContent:  {version: 'Version_1'},
  documentationRoot: 'markdown',
  versions: [
    {
      name: 'Version_1',
      id: 'Version_1',
      documents: ['Introduction.md', 'Getting_Started.md'],
      nodes: [
        {
          name: 'API_Endpoint_Reference',
          nodes: [
            {name: 'Albums', documents: ['Overview.md', 'Album.md', 'Albums.md']},
            {name: 'Artists', documents: ['Overview.md', 'Artist.md', 'Artists.md']}
          ]
        },
        {
          name: 'Guides',
          nodes: [
            {name: 'Authorization', documents: ['authorization.md']},
            {name: 'Configuration_&_Implementation', documents: ['configuration.md', 'implementation.md']},
          ]
        },
      ]
    },
    {
      name: 'Version_2',
      id: 'Version_2',
      documents: ['Introduction.md', 'Getting_Started.md'],
      nodes: [
        {
          name: 'API_Endpoint_Reference',
          nodes: [
            {name: 'Albums', documents: ['Overview.md', 'Album.md', 'Albums.md']},
            {name: 'Artists', documents: ['Overview.md', 'Artist.md', 'Artists.md']}
          ]
        },
        {
          name: 'Guides',
          nodes: [
            {name: 'Authorization', documents: ['authorization.md']},
            {name: 'Configuration_&_Implementation', documents: ['configuration.md', 'implementation.md']},
          ]
        },
      ]
    },
  ]
};
