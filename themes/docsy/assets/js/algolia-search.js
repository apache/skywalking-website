$(function () {
  var reg = /\/docs\/[a-zA-Z\-]+\/([\w|\.]+)\//;
  var res = reg.exec(location.href);
  var version = res && res[1] || "latest";
  docsearch({
    apiKey: 'a0589fc2fb9cc4876b9443b2911221bc',
    indexName: 'skywalking',
    inputSelector: '#algolia-search-input',
    algoliaOptions: {
      'facetFilters': ["version:" + version],
      hitsPerPage: 8
    },
    debug: false
  });
})
