<template>
    <div :class="className" :id="id"  @click="send"></div>
</template>
<script>
    // 引入 ECharts 主模块
    const echarts = require('echarts/lib/echarts');
    // 引入柱状图
    require('echarts/lib/chart/pie');
    require('echarts/lib/component/tooltip');
    // 引入提示框和标题组件
    require('echarts/lib/component/title');
    export default {
      name: 'PieChartone',
      style:{

          width: {
            type: String,
            default: ''
          },
          height: {
            type: String,
            default: ''
          }
      },
      props: {
        className: {
          type: String,
          default: 'room-chart'
        },
        id: {
          type: String,
          default: 'room-chart'
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
          type: Array,
          default: function () {
            return [
            ];
          }
        },
        titleObj: {
          type: Object,
          default: function () {
            return {
                text: this.title,
                left: 'center',
                bottom: 'center',
                textStyle: {
                    fontWeight: 'normal',
                    fontSize: '16'
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
      watch: {
        dataNum() {
          this.setOptions();

        }
      },
      mounted() {
        document.getElementById(this.id).style.height = this.height;
        this.initBar(); 
        // var vm = this;
        // window.onresize = function(){
        //   vm.initBar();
        // }
      },
      methods: {
        initBar() {
          document.getElementById(this.id).style.height = this.height;
          this.chart = echarts.init(document.getElementById(this.id));
          this.setOptions();
        },
        setOptions() {
          this.chart.setOption({
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}%"
            },
            title: this.titleObj,
            color: ['#20A0FF','#ABCD03','#e4353c'],
            series : [
                {
                    name: this.visitTitle,
                    name:'访问来源',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    labelLine: {
                      normal: {
                        show: true,
                        smooth: 0.2,
                        length: 5,
                        length2: 10
                      }
                    },
                    data: this.dataNum,
                    label: {
                      normal: {
                        show: true,
                        formatter: "{b} : {c}%"
                      }
                    },
                    lableLine: {
                      normal: {
                        show: true
                      }
                    },
                    grid: {
                      left: '8%',
                      right: '8%',
                      bottom:"8%",
                      top:"8%",
                      containLabel: true
                    },
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
          });
        },
        send() {
          this.$emit('clickChart');
        }
      }
    }
</script>