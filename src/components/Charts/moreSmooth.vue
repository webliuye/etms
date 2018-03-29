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
export default {
  name: "moreLine",
  props: {
    className: {
      type: String,
      default: "moreLine"
    },
    id: {
      type: String,
      default: "moreLine"
    },
    width: {
      type: String,
      default: "500px"
    },
    height: {
      type: String,
      default: "500px"
    },
    dataNum: {
     type: Array,
      default:()=>[]
    }
  },
  data() {
    return {};
  },
  mounted() {

  },
  watch:{
    dataNum(){
      //避免数据延迟的影响
      if(this.dataNum.length>0){
          this.initChart();
      }
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id));
      const vm = this;
      var nameData = [];
      var monthData=vm.dataNum[0].month;
      vm.dataNum.forEach(e => {
        var data = {
          name: e.name,
          icon: "rect"
        };
        nameData.push(data);
      });
      this.chart.setOption({
        tooltip: {
          trigger: "axis"
        },
        color: [
          "#f5222d",
          "#fa8c16",
          "#fadb14",
          "#13c2c2",
          "#722ed1",
          "#eb2f96"
        ],
        legend: {
          data: nameData,
          textStyle: {
            color: "#fff"
          },
          inactiveColor: "rgba(6,6,6,0.5)"
        },
        grid: {
          left: 32,
          right: 32,
          top: 64,
          bottom: 32,
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLine: { lineStyle: { color: "#a6e1ff" } },
          data: monthData,
          axisLabel: {
            color: "#a6e1ff"
          }
        },
        yAxis: {
          type: "value",
          axisLine: { lineStyle: { color: "#a6e1ff" } },
          axisLabel: {
            color: "#a6e1ff"
          },
          splitLine: {
            show: false
          }
        },
        series: vm.dataNum
      });
    }
  }
};
</script>
<style lang="less" scoped>
  div{
    margin-top:20px;
  }
</style>

