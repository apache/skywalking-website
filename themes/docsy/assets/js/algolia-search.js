$(function () {
  var reg = /\/docs\/[a-zA-Z\-]+\/([\w|\.]+)\//;
  var res = reg.exec(location.href);
  var version = res && res[1] || "latest";

  docsearch({
    container: '#docsearch',
    appId: 'X3PCA2KVGM',
    indexName: 'skywalking',
    apiKey: '061374998460e79f66774b9b6905a0dd',
    // apiKey: 'd8a1be78df7ed6c81d5a8de3714cad31',
    "hitsPerPage": 10,
    searchParameters: {
      facetFilters: [["version:" + version]],

      hitsPerPage: 8
    },
  });
})
