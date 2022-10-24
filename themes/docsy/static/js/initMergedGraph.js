function initMergedGraph() {
  if (window.location.hostname.indexOf('.netlify.app') > -1) {
    var previewTips = "<p>This part doesn't show up in preview mode.</p>";
    $('.contributors-wrapper').html(previewTips);
    $('#mergedGraph').html(previewTips);
    return
  }

  var chartDom = document.getElementById('mergedGraph');
  var myChart = echarts.init(chartDom);

  var option = {
    title: {
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: mergedData.date
    },
    yAxis: {},
    grid: {
      x: 40,
      y: 25,
      x2: 30,
      y2: 35
    },
    series: [
      {
        lineStyle: {
          width: 1
        },
        name: 'Contributions',
        type: 'line',
        symbol: 'none',
        sampling: 'lttb',
        itemStyle: {
          color: 'rgb(105,183,112)'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(138,197,138)'
            },
            {
              offset: 1,
              color: 'rgb(237,243,237)'
            }
          ])
        },
        data: mergedData.data
      }
    ]
  };

  option && myChart.setOption(option);
  window.onresize = myChart.resize;
}

initMergedGraph();
