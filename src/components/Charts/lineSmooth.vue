<template>
    <div :class="className" :id="id" :style="{height:height,width:width}"></div>
</template>
<script>
// 引入 ECharts 主模块
const echarts = require("echarts/lib/echarts");

require("echarts/lib/chart/line");
// 引入提示框和标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/legend");
require("echarts/lib/component/markPoint");
export default {
  name: "barPercent",
  props: {
    className: {
      type: String,
      default: "smoothChart"
    },
    id: {
      type: String,
      default: "smoothChart"
    },
    width: {
      type: String,
      default: "500px"
    },
    height: {
      type: String,
      default: "500px"
    }
    ,
    dataNum: {
      type: Object,
      default:()=>{}
    }
  },
  data() {
    return {};
  },
  watch:{
    dataNum(val){
      if(val.months.length>0){
         this.initChart();
      }
    }
  },
  mounted() {

  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id));
      const vm=this;
      this.chart.setOption({
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLine:{lineStyle:{color:'#a6e1ff'}},
          data: vm.dataNum.months
          ,axisLabel:{
            color:'#a6e1ff'
          }
        },
          tooltip: {
          trigger: "axis"
        },
        yAxis: {
          type: "value",
          axisLine:{lineStyle:{color:'#a6e1ff'}},
          axisLabel:{
            color:'#a6e1ff'
          },
          splitLine: {
                show: false
            }
        },
         grid: {
              left: 64,
              right: 32,
              top: 64,
              bottom: 32
            },
        series: [
          {
            data: vm.dataNum.datas,
            type: "line",
            smooth: true,
            showSymbol: false,
            // markPoint: {
            //   data: [
            //           {type: 'max', name: '最大值'}
            //       ]
            // },
            areaStyle: {
              // color: {
              //   type: "linear",
              //   x: 0,
              //   y: 0,
              //   x2: 0,
              //   y2: 1,
              //   colorStops: [
              //     {
              //       offset: 0,
              //       color: "rgba(149,74,76,1)" // 0% 处的颜色
              //     },
              //     {
              //       offset: 1,
              //       color: "rgba(149,74,76,0.1)" // 100% 处的颜色
              //     }
              //   ],
              //   globalCoord: false// 缺省为 false
              // }
            }
          }
        ]
      });
    }
  }
};
</script>
