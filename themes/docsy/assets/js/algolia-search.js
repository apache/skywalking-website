$(function () {
  var reg = /\/docs\/[a-zA-Z\-]+\/([\w|\.]+)\//;
  var res = reg.exec(location.href);
  var version = res && res[1] || "next";

  docsearch({
    container: '#docsearch',
    appId: 'X3PCA2KVGM',
    indexName: 'skywalking',
    apiKey: '061374998460e79f66774b9b6905a0dd',
    searchParameters: {
      facetFilters: ["version:" + version],
    },
  });
})
