$(function () {
  var reg = /\/docs\/[a-zA-Z\-]+\/([\w|\.]+)\//;
  var res = reg.exec(location.href);
  var version = res && res[1] || "latest";
  // docsearch({
  //   apiKey: 'a0589fc2fb9cc4876b9443b2911221bc',
  //   indexName: 'skywalking',
  //   inputSelector: '#algolia-search-input',
  //   algoliaOptions: {
  //     'facetFilters': ["version:" + version],
  //     hitsPerPage: 8
  //   },
  //   debug: false
  // });

  docsearch({
    container: '#docsearch',
    appId: 'X3PCA2KVGM',
    indexName: 'skywalking',
    apiKey: '061374998460e79f66774b9b6905a0dd',
    searchParameters: {
      // facetFilters: ["version:" + 'latest'],
    },
  });
})
