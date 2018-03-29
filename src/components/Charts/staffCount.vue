<template>
    <div :class="className" :id="id" :style="{height:height,width:width}"></div>
</template>
<script>
    // 引入 ECharts 主模块
    const echarts = require('echarts/lib/echarts');
    // 引入柱状图
    require('echarts/lib/chart/pie');
    // 引入提示框和标题组件
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/title');
    export default {
      name: 'StaffChart',
      props: {
        className: {
          type: String,
          default: 'staff-chart'
        },
        id: {
          type: String,
          default: 'staff-chart'
        },
        width: {
          type: String,
          default: '600px'
        },
        height: {
          type: String,
          default: '400px'
        },
        title: {
          type: String,
          default: '所有教师开出情况'
        },
        visitTitle: {
          type: String,
          default: '功能室使用情况'
        },
        dataNum: {
          type: Array,
          default: [
            {
              value:200,
              name:'多媒体教室'
            },
            {
              value:200,
              name:'计算机教室'
            },
            {
              value:200,
              name:'音乐教室'
            },
            {
              value:200,
              name:'美术教室'
            },
            {
              value:200,
              name:'舞蹈教室'
            }
            ]
        }
      },
      data() {
        return {
          chart: null
        };
      },
      watch: {
        dataNum() {
          this.setOptions();
        }
      },
      mounted() {
        this.initBar();
      },
      methods: {
        initBar() {
          this.chart = echarts.init(document.getElementById(this.id));
          this.setOptions();
        },
        setOptions() {
          this.chart.setOption({
              title : {
                  text: '所有教师开出情况',
                  x:'center',
                  textAlign:'left'
              },
              tooltip : {
                  trigger: 'axis'
              },
              legend: {
                  data:['分组实验','演示实验'],
                  x:'right',
                  textAlign:'left'
              },
              // toolbox: {
              //     show : true,
              //     feature : {
              //         dataView : {show: true, readOnly: false},
              //         magicType : {show: true, type: ['line', 'bar']},
              //         restore : {show: true},
              //         saveAsImage : {show: true}
              //     }
              // },
              calculable : true,
              xAxis : [
                  {
                      type : 'category',
                      data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
                  }
              ],
              yAxis : [
                  {
                      type : 'value'
                  }
              ],
              series : [
                  {
                      name:'分组实验',
                      type:'bar',
                      data:[10, 10, 20, 50, 10, 0, 0, 0, 20, 20, 50, 60],
                      color: ['#1aabec'],
                      barGap:'0'
                      // markPoint : {
                      //     data : [
                      //         {type : 'max', name: '最大值'},
                      //         {type : 'min', name: '最小值'}
                      //     ]
                      // },
                      // markLine : {
                      //     data : [
                      //         {type : 'average', name: '平均值'}
                      //     ]
                      // }
                  },
                  {
                      name:'演示实验',
                      type:'bar',
                      data:[10, 10, 20, 50, 10, 0, 0, 0, 20, 20, 50, 60],
                      color: ['#49c65b']

                      // markPoint : {
                      //     data : [
                      //         {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183},
                      //         {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3}
                      //     ]
                      // },
                      // markLine : {
                      //     data : [
                      //         {type : 'average', name : '平均值'}
                      //     ]
                      // }
                  }
              ]
          });
        }
      }
    }
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.room-chart {
  margin: 40px auto 0;
}
</style>
