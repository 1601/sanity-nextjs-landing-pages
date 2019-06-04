export default {
  widgets: [
    {
      name: 'sanity-tutorials',
      options: {
        templateRepoId: 'sanity-io/sanity-template-nextjs-landing-pages'
      }
    },
    {name: 'structure-menu'},
    {
      name: 'project-info',
      options: {
        __experimental_before: [
          {
            name: 'netlify',
            options: {
              description:
                'NOTE: Because these sites are static builds, they need to be re-deployed to see the changes when documents are published.',
              sites: [
                {
                  buildHookId: '5cf60740c35d3ecde4a48d00',
                  title: 'Sanity Studio',
                  name: 'sanity-nextjs-landing-pages-studio-gv5p95p2',
                  apiId: '0365c503-346d-47ca-9157-03872a7ea61a'
                },
                {
                  buildHookId: '5cf60740f217007b111fe608',
                  title: 'Landing pages Website',
                  name: 'sanity-nextjs-landing-pages-web-bjfaohyi',
                  apiId: 'c2b250bc-2884-4af5-b9a1-b98226fafbcf'
                }
              ]
            }
          }
        ],
        data: [
          {
            title: 'GitHub repo',
            value: 'https://github.com/1601/sanity-nextjs-landing-pages',
            category: 'Code'
          },
          {title: 'Frontend', value: 'https://sanity-nextjs-landing-pages-web-bjfaohyi.netlify.com', category: 'apps'}
        ]
      }
    },
    {name: 'project-users', layout: {height: 'auto'}},
    {
      name: 'document-list',
      options: {title: 'Recently edited', order: '_updatedAt desc', limit: 10, types: ['page']},
      layout: {width: 'medium'}
    }
  ]
}
