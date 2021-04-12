(function () {
  docsearch({
    apiKey: 'a0589fc2fb9cc4876b9443b2911221bc',
    indexName: 'skywalking',
    inputSelector: '#algolia-search-input',
    algoliaOptions: {
      'facetFilters': ["version:latest"],
      hitsPerPage: 8
    },
    debug: false
  });
})()
