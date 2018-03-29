<template>
    <div :class="className" :id="id" :style="{height:height,width:width}" @click="send"></div>
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
      name: 'PieChart',
      props: {
        className: {
          type: String,
          default: 'room-chart'
        },
        id: {
          type: String,
          default: 'room-chart'
        },
        width: {
          type: String,
          default: '800px'
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
          chart: null,
          height:'580px'
        };
      },
      watch: {
        dataNum() {
          this.setOptions();

        }
      },
      mounted() {
        this.height = $(document.getElementById(this.id)).width()+50+'px';
        document.getElementById(this.id).style.height = this.height;
        this.initBar(); 
        // var vm = this;
        // window.onresize = function(){
        //   vm.initBar();
        // }
      },
      methods: {
        initBar() {
          this.height = $(document.getElementById(this.id)).width()+50+'px';
          document.getElementById(this.id).style.height = this.height;
          this.chart = echarts.init(document.getElementById(this.id));
          this.setOptions();
        },
        setOptions() {
          this.chart.setOption({
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {d}%"
            },
            title: this.titleObj,
            series : [
                {
                    name: this.visitTitle,
                    type: 'pie',
                    radius: [0, '50%'],
                    center: ['50%', '50%'],
                    data: this.dataNum,
                    color: ['#20A0FF','#ABCD03','#F7BA2A'],
                    label: {
                        normal: {
                            show:true,
                            position: 'inside',
                            formatter: '{b} {d}%'
                        }
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