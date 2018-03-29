<template>
    <div :class="className" :id="id" :style="{height:height,width:width}" @click="send"></div>
</template>
<script>
    // 引入 ECharts 主模块
    const echarts = require('echarts/lib/echarts');
    // 引入柱状图
    require('echarts/lib/chart/bar');
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/title');
    window.onresize = function () {
            //重置容器高宽
    };
    export default {
      name: 'BarChart',
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
        // height: {
        //   type: String,
        //   default: '580px'
        // },
        title: {
          type: String,
          default: ''
        },
        visitTitle: {
          type: String,
          default: ''
        },
        dataX: {
          type: Array,
          default: function () {
            return [
            ];
          }
        },
        dataNum: {
          type: Array,
          default: function () {
            return [
            ];
          }
        },
        
        labelText: {
            type: String,
            default: ''
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
                    fontSize: '12'
                }
            };
          }
        }
      },
      data() {
        return {
          chart: null,
          colors: ['#20A0FF','#ABCD03','#F7BA2A'],
          height:'580px'
        };
      },
      computed: {
          _dataNum() {
              let $this = this;
              return this.dataNum.map(function(dataItem, index) {
                    let itemIndex = (index+1)%$this.dataNum.length;
                    dataItem.itemStyle = {
                            normal: {
                                color: $this.colors[itemIndex]
                            }
                        };
                        return dataItem;
              });
          }
      },
      watch: {
        dataNum() {
          this.setOptions();
        },
        height() {
          this.setOptions();
        }
      },
      created() {
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
                trigger: 'axis',
                formatter: '{b}: {c}',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            title: this.titleObj,
            color: ['#20A0FF','#ABCD03','#F7BA2A'],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '10%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : this.dataX,
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis : [
                {
                    show: false,
                    type : 'value',
                    splitLine:{ 
                      show:false 
                    }
                }
            ],
            label: {
                normal: {
                    show: true,
                    position: 'top',
                    formatter: '{c}' + this.labelText
                },
                emphasis: {
                    show: true,
                    position: 'top',
                    formatter: '{c}' + this.labelText
                },
            },
            series : [
                {
                    name: '直接访问',
                    type: 'bar',
                    barWidth: '50%',
                    data: this._dataNum
                }
            ]
          });
        },
        send() {
          this.$emit('clickChartTwo');
        }
      }
    }
</script>
