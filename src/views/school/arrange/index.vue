<template>
  <master-page title="实验安排">
    <div class="arrangeIndex">
        <div class="clearfix">
        <div class="search-select">
          <div class="fr">
            <el-input
              placeholder="实验名称"
              v-model="listQuery.name">
              <i
              class="el-icon-search el-input__icon"
              slot="suffix"
              @click="findItem">
              </i>
            </el-input>
          </div>
          <div class="fr selectwidth">
            <el-select clearable v-model="listQuery.applyId" placeholder="申请人" @change="findItem">
              <el-option v-for="(item,index)  in teacherInform" :key="index" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <el-table :data="list" fit highlight-current-row style="width: 100%">
          <el-table-column label="实验名称" min-width="140" show-overflow-tooltip>>
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="classDate" label="预约上课时间" min-width="120" align="center"></el-table-column>
          <el-table-column prop="className" label="上课班级" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="classTime" label="上课节次" min-width="100" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.classTime | changeClassTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="bookingUserName" label="申请人" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="state" label="操作" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.state==0" > <a href="javascript:;" class="el-button--text" @click="goArrange(scope.row)">安排</a></span>
                <span v-if="scope.row.state==1" >可以上课 </span>
                <span v-if="scope.row.state==2" >不能上课 </span>
                <span v-if="scope.row.state==3" >已登记 </span>
            </template>
          </el-table-column>
      </el-table>
      <div v-show="!listLoading" class="pagination-container">
        <Pagination :pages="pages" :searchData="listQuery" @getTableData="getList"></Pagination>
      </div>

    </div>

  </master-page>
</template>

<script>
  import MasterPage from '../../layout/MasterPage';
  import { getClassTime } from 'api/common';
  import { reviseEquipment } from 'api/booking';
  import { getArrangeList, getunitStaff } from 'api/arrange';
  import { parseTime } from '../../../filters';
  import Pagination from 'views/components/page/pagination';
  import {scrollTable} from "utils/index"
  export default {
    components: {
        MasterPage, Pagination
    },
    data() {
      return {
        teacherInform:[],
        listLoading: false,
        list: null,
        listQuery: {
          applyId:'',
          page: 1,
          size: 50
        },
        pages:{
          total:1,
          sizes:[10,20,30, 50]
        },
        loading: false,
        aptClassTime:[]
      }
    },
    created() {
      this.getFormData();
      this.getList();
    },
    methods: {
      getFormData () {
        getunitStaff().then(response => {
          this.teacherInform = response;
        });
        getClassTime().then(response => {
          this.aptClassTime = response;
        });
      },
      getList() { // 获取表格数据
        this.listLoading = true;
        getArrangeList(this.listQuery).then(response => {
          this.list = response.data;
          this.list.forEach(function(item){
            item.className = item.classNames.join(",");
          })
          this.pages.total = response.total;
          if(this.pages.total>this.listQuery.size){
            this.listLoading = false;
          }
        }).catch(err => {
          this.listLoading = true;
        });
      },
      findItem() {
        this.listQuery.page = 1;
        this.getList();
      },
      // handleSizeChange(val) { // 显示多少页
      //   this.listQuery.size = val;
      //   this.listQuery.page = 1;
      //   this.getList();
      // },
      // handleCurrentChange(val) {  // 点击页数
      //   this.listQuery.page = val;
      //   this.getList();
      // },
      goArrange(item) {
        item.planDetailName=item.name;
        item.tercherName=item.bookingUserName;
        this.$router.push({ name: 'ReviseArrange', params: { planDetailId: item.planDetailId, bookingId: item.bookingId, row: item } });
      }
    },
    mounted(){
     scrollTable('.arrangeIndex')
    }
  }
</script>
<style type="text/css" >
 .pull-right{ float: right; }
 .icon-state { display: inline-block; width: 10px; height: 10px; font-size: 0; margin-right: 5px; border-radius: 20px; }
 .icon-state-0{ background-color: #f7ba2a; }
 .icon-state-1{ background-color: #abcd03; }
 .icon-state-2{ background-color: #ff4949; }
 .icon-state-3{ background-color: #50bfff; }
</style>
