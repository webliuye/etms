<template>
    <div :class="className" :id="id"  style="width:100%;"></div>
</template>
<script>
// 引入 ECharts 主模块
const echarts = require("echarts/lib/echarts");
// 引入柱状图
require("echarts/lib/chart/bar");
// 引入提示框和标题组件
require("echarts/lib/component/tooltip");
import { openCountAll} from 'api/sourceIndex';
export default {
  name: "barPercent",
  props: {
    className: {
      type: String,
      default: "barPercent"
    },
    id: {
      type: String,
      default: "barPercent"
    },
    width: {
      type: String,
      default: "200px"
    },
    height: {
      type: String,
      default: "200px"
    },
    unitId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      chart: null,
      stageData:[]
    };
  },
  watch: {
    unitId() {
      const vm=this;
      this.getsubCount();
    },
    stageData(val){
      const vm=this;
      if(val.length>0){
         vm.initBar();
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
    getsubCount(){
       const vm=this;
          var colors=["#6359db","#fadb14","#fa8c16"];
          vm.stageData=[];
          openCountAll({unitId:vm.unitId,groups:'stage'}).then(res => {
            if(res && res.length > 0){
              res.forEach((e,index)=>{
                var percent;
                var color=colors[index];
                if(!e.finalAmount||e.finalAmount==0){
                   percent=0;
                }else if(!e.totalAmount||e.totalAmount==0){
                     percent=100;
                }else{
                  percent=Math.round(e.finalAmount/e.totalAmount*100);
                }
                var subOb={
                  name:e.stageName,
                  value:percent,
                   itemStyle:{color:color}
                }
                vm.stageData.push(subOb);
              });
            }
          });
    },
    setOptions() {
      const vm= this;
      this.chart.setOption({
        tooltip: {
          trigger: "axis",
           formatter: "{b} <br/> {a0}: {c0}% ",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        color:["#6359db","#fadb14","#fa8c16"],
        grid: {
          left: 64,
          right: 32,
          top: 32,
          bottom: 32
        },
        xAxis: [
          {
            type: "category",
            data: ["小学", "初中", "高中"],
            axisTick: {
              alignWithLabel: true
            },
            axisLine: { lineStyle: { color: "#a6e1ff" } },
            axisLabel: {
              color: "#a6e1ff"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLine: { lineStyle: { color: "#a6e1ff" } },
            axisLabel: {
              color: "#a6e1ff"
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "开出率",
            type: "bar",
            barWidth: "40%",
            data:vm.stageData
          }
        ]
      });
    }
  }
};
</script>
