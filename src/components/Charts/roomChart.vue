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
      name: 'roomChart',
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
          default: '400px'
        },
        height: {
          type: String,
          default: '400px'
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
          this.setOptions()
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
                text: '南宁市功能室使用情况',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                data: ['多媒体教室','计算机教室','音乐教室','美术教室','舞蹈教室'],
                x:'right',
                textAlign:'left'
            },
            series : [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:this.dataNum,
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
        }
      }
    }
</script>
