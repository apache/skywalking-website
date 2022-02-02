function initMergedGraph() {
  var chartDom = document.getElementById('mergedGraph');
  var myChart = echarts.init(chartDom);

  var option = {
    title: {
      left: 'center',
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: mergedData.date
    },
    yAxis: {
    },
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
        name: 'Merged Data',
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
