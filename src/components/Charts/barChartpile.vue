<template>
     <div :class="className" :id="id"    @click="send"></div> 
</template>
<script>
    // 引入 ECharts 主模块
    const echarts = require('echarts/lib/echarts');
    // 引入柱状图
    require('echarts/lib/chart/bar');
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/title');
     require('echarts/lib/component/legend');
    window.onresize = function () {
            //重置容器高宽
    };
    export default {
      name: 'BarChartpile',
      style:{
         width: {
          type: String,
          default: ''
        },
        height: {
          type: String,
          default: ''
        },

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
                    fontSize: '13'
                }
            };
          }
        }
      },
      data() {
        return {
          chart: null,
          colors: ['#20A0FF','#ABCD03','#F7BA2A']
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
        }
      },
      created() {
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
          this.chart.setOption( {
            tooltip : {
                trigger: 'axis',
                 formatter: "{b} <br/> {a0}: {c0}% <br/> {a1}: {c1}%",
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            color: ['#20A0FF','#ABCD03','#e4353c'],
            legend: {
              orient: 'horizontal',
              right:"0%",
              top: '5%',
              itemWidth:32,
              itemHeight:24,
              data: ['演示实验', '分组实验']
                
            },
            grid: {
                left: '3%',
                right: '4%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : ['小学科学','初中物理','初中化学','初中生物','高中物理','高中化学','高中生物']
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLabel:{
                      formatter:"{value}%"
                    }
                }
            ],
            series : [
                {
                    name:'演示实验',
                    type:'bar',
                    stack: '1',
                    // label: {
                    //   normal: {
                    //        show:true,
                    //         position: 'inside',
                    //         formatter:"{c}%"
                    //     }
                    // },
                    data:[82, 65, 42,38,34,30,26],
                    barGap:"0%",
                    barCategoryGap:"50%"

                },
                {
                    name:'分组实验',
                    type:'bar',
                    stack: '2',
                    // label: {
                    //   normal: {
                    //          show:true,
                    //         position: 'inside',
                    //         formatter: " {c}%"
                    //     }
                    // },
                    data:[84,32,15,76,65,86,32]
                     
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
