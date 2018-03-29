<template>
  <div class="filter-container  teacherPlan">
    <div class="grid-content">
      <el-select v-model="listQuery.planId" @change="changePlan" class="plan-sele" placeholder="请选择实验计划">
        <el-option
          v-for="(item,index)  in planData"
          :key="index"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </div>
    <el-table :data="list" fit highlight-current-row style="width: 100%">
        <el-table-column label="实验名称" min-width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <router-link :to="{name: 'PlanDetailPreviewId', params:{planId:scope.row.planDetailId}}" class="el-button el-button--text"><span>{{scope.row.name}}</span></router-link>
          </template>
        </el-table-column>
        <el-table-column prop="grade" label="年级" min-width="100"></el-table-column>
        <el-table-column prop="term" label="学期" min-width="100"></el-table-column>
        <el-table-column prop="isMust" label="是否必做"></el-table-column>
        <el-table-column prop="type" label="实验类型"></el-table-column>
        <el-table-column align="right" prop="week" label="上课周次"></el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <Pagination :pages="pages" :searchData="listQuery" @getTableData="getList"></Pagination>
    </div>
  </div>
</template>

<script>
  import { getMyPlanDetails } from 'api/plan';
  import { getPlan } from 'api/index';
  import Pagination from 'views/components/page/pagination';
  import {scrollTable} from "utils/index"
  export default {
    components : {Pagination},
    data() {
      return {
        id:'',
        name:'',
        listLoading: false,
        list: null,
        listQuery: {
          page: 1,
          size: 50,
          planId:''
        },
        planData:[],
        pages:{
          total:1,
          sizes:[10,20,30, 50]
        }
      }
    },
    created() {
      getPlan().then(res => {
        this.planData = res;
        if(res[0]){
          this.listQuery.planId = res[0].id;
          this.getList();
        }
      });
    },
    methods: {
      changePlan() {
        this.getList();
      },
      getList() {
        this.listLoading = true;
        getMyPlanDetails(this.listQuery).then(res => {
          this.list = res.data;
          this.pages.total = res.total;
          if(this.pages.total>this.listQuery.size){
            this.listLoading = false;
          }
        }).catch(err => {
          this.listLoading = false;
        });
      }
    },
    mounted(){
      scrollTable('.teacherPlan');
    }
  }
</script>
<style type="text/css" scoped>
  .grid-content {
    padding-bottom: 16px;
  }
</style>

