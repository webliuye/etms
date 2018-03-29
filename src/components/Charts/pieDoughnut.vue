<template>
    <div :class="className" :id="id" :style="{height:height,width:width}" @click="send"></div>
</template>
<script>
// 引入 ECharts 主模块
const echarts = require("echarts/lib/echarts");
// 引入柱状图
require("echarts/lib/chart/pie");
require("echarts/lib/component/tooltip");
// 引入提示框和标题组件
require("echarts/lib/component/title");
export default {
  name: "PieChart",
  props: {
    className: {
      type: String,
      default: "src-count"
    },
    id: {
      type: String,
      default: "src-count"
    },
    width: {
      type: String,
      default: "100%"
    },
    dataNum: {
      type:Array,
      default:()=>[]
    }

  },
  data() {
    return {
      chart: null,
      height: "100%"
    };
  },
   watch:{
    dataNum(val){
      if(val.length>0){
         this.initBar();
      }
    }
  },
  mounted() {

  },
  methods: {
    initBar() {
      this.chart = echarts.init(document.getElementById(this.id));
      this.setOptions();
    },
    setOptions() {
      const vm =this;
      this.chart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c} ({d}%)"
        },
         grid: {
          left: 64,
          right: 32,
          top: 32,
          bottom: 32,
          containLabel: true
        },
        series: [
          {
            name:'资源统计',
            type:'pie',
            radius: ['30%', '50%'],
            color: ['#f5222d','#fa8c16','#fadb14','#13c2c2','#722ed1','#eb2f96','#2f54eb','#52c41a'],
            label: {
                normal: {
                    formatter: '{b|{b}：}{c} ',
                    // backgroundColor: '#eee',
                    rich: {
                        b: {
                            fontSize: 12
                        }
                    }
                }
            },
            labelLine:{
                length:5,
                length2:10
            },
            data:vm.dataNum
          }
        ]
      });
    },
    send() {
      this.$emit("clickChart");
    }
  }
};
</script>
