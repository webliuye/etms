<template>
  <master-page title="实验计划详情">
    <div class="planDetail">
      <div class="filter-container">
        <span>{{name}}</span>
        <el-button class="pull-right main-return" type="text" @click="$router.go(-1);">返回</el-button>
      </div>
      <el-table :data="list" highlight-current-row style="width: 100%" >
          <el-table-column label="实验名称"  min-width="190" show-overflow-tooltip>
            <template slot-scope="scope">
              <router-link :to="{name: 'PlanDetailPreview', params:{planId:scope.row.id}}" class="el-button--text"><span>{{scope.row.name}}</span></router-link>
            </template>
          </el-table-column>
          <el-table-column prop="isOwn" label="实验分类" min-width="110">
            <template slot-scope="scope">
              <span>{{scope.row.isOwn==0?'校本实验':'标准实验'}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="typeLabel" label="实验类型" min-width="96" ></el-table-column>
          <el-table-column align="center" prop="isMust" label="是否必做" min-width="96" >
            <template slot-scope="scope">
              <span>{{scope.row.isMust==1?'是':'否'}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column align="center" prop="equipment" label="实验器材"></el-table-column> -->
          <el-table-column align="center" prop="unitName" label="制定单位"  min-width="140" ></el-table-column>
          <el-table-column align="center" label="上课周次"  min-width="96" >
            <template slot-scope="scope">
              <span>第{{scope.row.week}}周</span>
            </template>
          </el-table-column>
      </el-table>
      <div v-show="!listLoading" class="pagination-container">
        <Pagination :pages="pages" :searchData="listQuery" @getTableData="getList"></Pagination>
        <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="pages.sizes"
          :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="pages.total">
        </el-pagination> -->
      </div>

    </div>

  </master-page>
</template>

<script>
  import MasterPage from '../layout/MasterPage';
  import { getPlanDetails } from 'api/plan';
  import Pagination from 'views/components/page/pagination';
  import {scrollTable} from 'utils/index'
  export default {
    components: {
      MasterPage,
      Pagination
    },
    data() {
      return {
        id:'',
        name:'',
        listLoading: false,
        show:false,
        list: null,
        listQuery: {
          page: 1,
          size: 50
        },
        pages:{
          total:1,
          sizes:[10,20,30, 50]
        }
      }
    },
    created() {
      this.id = this.$route.params.id;
      this.name = this.$route.params.name;
      this.getList();
    },
    methods: {
      getList() { // 获取表格数据
        this.listLoading = true;
        getPlanDetails(this.id,this.listQuery).then(response => {
          this.list = response.data;
          this.pages.total = response.total;
            if(response.total>this.listQuery.size){
               this.listLoading = false;
            }
        }).catch(err => {
          this.listLoading = false;
        });
      }
      // handleSizeChange(val) { // 显示多少页
      //   this.listQuery.size = val;
      //   this.getList();
      // },
      // handleCurrentChange(val) {  // 点击页数
      //   this.listQuery.page = val;
      //   this.getList();
      // }
    },
    mounted(){
      //固定表头
     scrollTable('.planDetail');

    }
  }
</script>
<style lang="less" >


</style>


