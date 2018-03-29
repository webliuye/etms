<template>
 <master-page title="功能室使用统计">
    <div class="dashboard-container funcCount">
      <div class="search-select">
        <div class="fr selectwidth1">
          <YearSelect @changeYear="changeYear"></YearSelect>
        </div>
      </div>
      <div class="charts-contain">
        <div :class="className" :id="id" :style="{height:height}"></div>
      </div>
      <el-table :data="listData" fit highlight-current-row style="width: 100%; margin-top:16px;" ref="editTable">
        <el-table-column  prop="roomName" label="功能室类别" min-width="240" show-overflow-tooltip></el-table-column>
        <el-table-column  prop="classCount" align="right" label="间数" min-width="100" sortable></el-table-column>
        <el-table-column  prop="useCount" align="right" label="使用次数" min-width="100" sortable></el-table-column>
        <el-table-column  prop="useAvgCount" align="right" label="间均使用次数" min-width="140" sortable></el-table-column>
      </el-table>
    </div>
    </master-page>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { getFuncCount } from 'api/count';
    import { getFuncRommTable } from 'api/index';
    import MasterPage from 'views/layout/MasterPage';
    import YearSelect from 'views/components/select/yearSelect';
    import { scrollTable } from 'utils/index'
    // 引入 ECharts 主模块
    const echarts = require('echarts/lib/echarts');
    // 引入柱状图
    require('echarts/lib/chart/bar');
    require('echarts/lib/chart/line');
    // 引入提示框和标题组件
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/title');
    export default {
      name: 'booking',
      components: {
          MasterPage,YearSelect
        },
      data() {
        return {
          searchData:{
            year:null
          },
          list:[],
          listData:[],
          className:'chart',
          id:'chart',
          height:'260px'
        };
      },
      created() {
        this.$store.dispatch('GetNowYear');
      },
      methods : {
        analysis(data) {
          const end_obj = [];
          for(let i in data){
            const obj = {name:'', datas:[]};
            obj.name = data[i].classTypeName;
            obj.value = data[i].total;
            obj.datas = data[i].mulRoomReportVos;
            end_obj.push(obj);
          }
          return end_obj;
        },
        initBar(data) {
          this.chart = echarts.init(document.getElementById(this.id));
          const name = [];
          const value = [];
          for(let i in data){
            name.push(data[i].classTypeName);
            value.push(data[i].total);
          }
          const abc = this.analysis(data);
          const option = {
            title:{
              text: '功能室使用统计',
              x:'center'
              //textAlign:'left'
            },
            tooltip: {
              trigger: 'item',
              formatter: function(a){
                var item = abc[a.dataIndex];
                var itemArray = item.datas;
                var html = '';
                for(let i=0;i<itemArray.length;i++){
                  html += '<br/>'+itemArray[i].className + ' : ' +itemArray[i].useCount + '次';
                }
                return ('总共预约'+a.data+'次'+html);
              },
              axisPointer: {
                type: 'shadow'
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              data: name
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                name: '数量',
                type: 'bar',
                barWidth: '40%',
                data: value
              }
            ],
            color: ['#1D8CE0']
          };
          option.yAxis.data = name;
          this.chart.setOption(option);
        },
        getData() {
          const that = this;
          getFuncCount().then(res => {
            that.list = res;
            that.initBar(res);
          });
          getFuncRommTable(this.searchData).then(res => {
            that.listData = res;
          });
        },
        changeYear(year){
          this.searchData.year = year;
          this.findItem();
        },
        findItem() {
          const that = this;
          getFuncCount(this.searchData).then(res => {
            that.list = res;
            that.initBar(res);
          });
          getFuncRommTable(this.searchData).then(res => {
            that.listData = res;
          });
        }
      },
      mounted() {
        scrollTable('.funcCount');
        this.searchData.year = this.$store.state.commonData.nowYear;
        this.getData();
      }
    }
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.dashboard-container { font-family: '微软雅黑';
}
.home-p {
  width: 100%;
  border-bottom: 1px solid #e1e4e3;
  line-height: 1.6em;
  font-size: 14px;
}
.chart {
  width: 100%;
}
.charts-contain {
  width: 100%;
  margin: 0 auto;
}
</style>
