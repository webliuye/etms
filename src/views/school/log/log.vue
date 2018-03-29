<template>
<master-page title="实验登记">
  <div class="dashboard-container">
    <div class="search-select">
      <div class="fr">
        <el-button icon="search" @click="getHeader"></el-button>
      </div>
      <div class="fr selectwidth">
        <el-input placeholder="请输入实验名称" v-model="listQuery.name"></el-input>
      </div>
      <div class="fr selectwidth">
        <PlanSelect :year="listQuery.year" :planId="listQuery.planId" @changePlan="changePlan"></PlanSelect>
      </div>
      <div class="fr selectwidth">
        <YearSelect :year="listQuery.year" @changeYear="changeYear"></YearSelect>
      </div>
    </div>
  <table class="el-table el-table--border text-center" style="width: 100%;">
    <thead>
      <tr>
        <th class="is-center" rowspan="2" width="30%">实验名称</th>
        <th class="classname is-center">班级名称</th>
      </tr>
      <tr>
        <th class="is-center" v-for="(item,index)  in tableHeader" :key="index">{{item.classname}}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item,index)  in list" :key="index">
        <td>
          <router-link :to="{path: '/log/preview/'+item.PLANID}" class="el-button el-button--text"><span>{{item.NAME}}</span></router-link>
        </td>
        <td v-for="(items,index) in item.FIELD" :key="'01'+index">
          <router-link :to="{name: 'LogAdd', params:{id: items.field,catalogueId:item.CATALOGUEID,subject:item.SUBJECTID, state: items.state, bookingState: items.bookingState, data: item, class: tableHeader[index]},query:queryRouter}" class="el-button el-button--text btn-field"><span v-if="items.state == 3 && items.field != 0"><img src="../../../assets/img/yes.png"></span><!-- <span v-else>+</span> --></router-link>
          </a>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="pagination-container">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="pages.sizes"
      :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="pages.total">
    </el-pagination>
  </div>
  </div>
</master-page>
</template>

<script>
  import MasterPage from '../../layout/MasterPage';
  import { getYear, getMineYear } from 'api/common';
  import YearSelect from 'views/components/select/yearSelect';
  import PlanSelect from 'views/components/select/planSelect';
  import { getPlansMe, getLogHeader, getLogList} from 'api/log';
  import { getPlansme } from 'api/booking';
  export default {
    components: {
      MasterPage,YearSelect,PlanSelect
    },
    data() {
      return {
        mineYears:[],
        planList:[],
        tableHeader:[],
        list: [],
        listQuery: {
          year:'',
          planId:'',
          page: 1,
          size: 50,
          name:''
        },
        queryRouter:{},
        pages:{
          total:1,
          sizes:[10,20,30, 50]
        }
      }
    },
    created() {
      this.$store.dispatch('GetNowYear').then(response => {
        getPlansme(response).then(res => {
          if(res.length == 0){
            this.$confirm('暂无实验计划信息，请先制定实验计划并关联班级', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$router.push({ name: 'PlanView' });
            })
          }
        });
      });
    },
    mounted() {
      if(this.$route.query.planId){
        this.listQuery.planId = this.$route.query.planId;
      }
      if(this.$route.query.year){
        this.listQuery.year = this.$route.query.year;
      }
      if(this.$route.query.name){
        this.listQuery.name = this.$route.query.name;
      }
      this.getHeader();
    },
    methods: {
      getHeader(){
        getLogHeader(this.listQuery).then(response => {
          this.tableHeader = response;
          jQuery(".classname").attr("colspan", response.length);
          this.getList();
        });
      },
      changeYear(year){
        this.listQuery.year = year;
      },
      changePlan(plan){
        this.listQuery.planId = plan;
        if(this.list.length == 0){
          this.getHeader();
        }
      },
      getList() { // 获取表格数据
        this.queryRouter.year = this.listQuery.year;
        this.queryRouter.planId = this.listQuery.planId;
        this.queryRouter.name = this.listQuery.name;
        if(!this.listQuery.planId){
          return;
        }
        getLogList(this.listQuery).then(response => {
          var listArray = [];
          const result = response.data;
          result.forEach( item =>{
            let obj = {};
            obj.PLANID = item.PLANID;
            obj.NAME = item.NAME;
            obj.CATALOGUEID = item.CATALOGUEID;
            obj.SUBJECTID = item.SUBJECTID;
            obj.FIELD = [];
            for (let i = 0; i < this.tableHeader.length; i++) {
              let fieldList = item["FIELD_" + i].split(",");
              obj.FIELD.push({state: fieldList[0], field: fieldList[2], bookingState: fieldList[1]});
            }
            listArray.push(obj);
          });
          this.list = listArray;
          this.pages.total = response.total;
        });
      },
      handleSizeChange(val) { // 显示多少页
        this.listQuery.size = val;
        this.getList();
      },
      handleCurrentChange(val) {  // 点击页数
        this.listQuery.page = val;
        this.getList();
      },
      handleList(text, rowData){

      }
    }
  }
</script>
<style type="text/css" media="screen">
  .btn-field{display: block;}
</style>
