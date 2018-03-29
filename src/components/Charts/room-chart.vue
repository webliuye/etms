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
      name: 'RoomChart',
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
          default: '600px'
        },
        height: {
          type: String,
          default: '400px'
        },
        title: {
          type: String,
          default: '湖南省功能室使用情况'
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
        Video(){
          if(this.Video){
            this.Pic=false;
          }
          
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
                text: this.title,
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x:'right',
                textAlign:'left'
            },
            series : [
                {
                    name: this.visitTitle,
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:this.dataNum,
                    color:['#00a0e9','#f7629e','#455366','#ff4949','#f7ba2a','#abcd03'],
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
<style rel="stylesheet/scss" lang="less" scoped>
.room-chart {
  margin: 40px auto 0;
}
</style>
