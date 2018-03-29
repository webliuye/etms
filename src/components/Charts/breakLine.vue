<template>
    <div :class="className" :id="id" :style="{height:height,width:width}" @click="send"></div>
</template>
<script>
    // 引入 ECharts 主模块
    const echarts = require('echarts/lib/echarts');
    // 引入柱状图
    require('echarts/lib/chart/line');
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/legend');
    // 引入提示框和标题组件
    require('echarts/lib/component/title');
    export default {
      name: 'breakLineChart',
      props: {
        className: {
          type: String,
          default: 'breakLineChart'
        },
        id: {
          type: String,
          default: 'breakLineChart'
        },
        width: {
          type: String,
          default: '800px'
        },
        height:{
          type: String,
          default: '300px'
        },
        title: {
          type: String,
          default: ''
        },
        visitTitle: {
          type: String,
          default: ''
        },
        dataNum: {
          type: Object,
          default: {}
        },
        titleObj: {
          type: Object,
          default: function () {
            return {
                text: this.title,
                left: 'center',
                bottom: 0,
                textStyle: {
                    fontWeight: 'normal',
                    fontSize: '13'
                }
            };
          }
        }
      },
      data() {
        return {
          chart: null
        };
      },
      computed: {
          _dataList() {
            return this.dataNum
          },
        //  dataList:res.datalist,
        //  monthList:res.monthList,
        //  seriesList:res.seriesList
      },
      watch: {
        dataNum() {
          this.setOptions();
        }
      },
      mounted() {
        this.initBar();
        // var vm = this;
        // window.onresize = function(){
        //   vm.initBar();
        // }
      },
      methods: {
        initBar() {
          this.chart = echarts.init(document.getElementById(this.id));
          this.setOptions();
        },
        setOptions() {
          this.chart.setOption({
              // title: {
              //     text: '资源使用趋势图'
              // },
              tooltip: {
                  trigger: 'axis'
              },
              color: ['#20A0FF','#ABCD03','#e4353c', "#25bf95", "#f59964"],
              legend: {
                  right:'5%',
                  data: this._dataList.dataList
              },
              grid: {
                  left: '2%',
                  right: '4%',
                  bottom: '10%',
                  containLabel: true
              },
              toolbox: {
                  feature: {
                      saveAsImage: {}
                  }
              },
              xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: this._dataList.monthList
              },
              yAxis: {
                  type: 'value'
              },
              series:this._dataList.seriesList
          });
        },
        send() {
          this.$emit('clickChart');
        }
      }
    }
</script>
