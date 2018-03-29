<template>
    <div class="filter-container recordTeacher">
      <div class="search-select">
        <div class="fr">
          <el-input placeholder="实验名称" v-model="searchData.name">
            <i
            class="el-icon-search el-input__icon"
            slot="suffix"
            @click="getList">
            </i>
          </el-input>
        </div>
        <div class="fr selectwidth">
          <PlanSelect :year="searchData.termYear" @changePlan="changePlan"></PlanSelect>
        </div>
        <div class="fr selectwidth">
          <YearSelect @changeYear="changeYear"></YearSelect>
        </div>
      </div>
      <el-table :data="list" fit highlight-current-row style="width: 100%;">
        <el-table-column  prop="name" label="实验名称" min-width="200" show-overflow-tooltip></el-table-column>
        <el-table-column  prop="typeName" align="center" label="实验类型" min-width="120"></el-table-column>
        <el-table-column  prop="className" label="上课班级" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column  prop="updateTime" align="center" label="上课时间" min-width="160">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime.slice(0,10)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isVideo" align="left" label="查看" width="160" :filters="filters" :filter-method="filterMethod" filter-placement="bottom-end">
          <template slot-scope="scope">
            <a href='javascript:;' class ="el-button--text" @click="goDetail(scope.row)"><img src="../../../assets/img/user-log.png" class="img">日志</a>
            <a href='javascript:;' class ="el-button--text" v-if="scope.row.isVideo == 'true'"  @click="play(scope.row.videoUrl)"><img src="../../../assets/img/user-video.png" class="img">视频</a>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="!listLoading" class="pagination-container">
        <Pagination :pages="pages" :searchData="searchData" @getTableData="getList"></Pagination>
      </div>
      <el-dialog :visible.sync="dialogBook"  top="10%"  @close="closeDialog">
              <Nvideo :src="videoUrl"  v-if="dialogBook" ></Nvideo>
      </el-dialog>
    </div>
</template>

<script>
import { getRecordList } from 'api/arrange';
import YearSelect from 'views/components/select/yearSelect';
import PlanSelect from 'views/components/select/planSelect';
import Pagination from 'views/components/page/pagination';
import Nvideo from "views/components/newVideo";
import { getRecord } from 'api/count';
import {scrollTable} from "utils/index"
export default {
  components: {
     YearSelect,PlanSelect,Nvideo,Pagination
  },
  data() {
      return {
        listLoading: false,
        list:null,
        searchData: {
          subjectId:null,
            planId:null,
            gradeId: null,
            typeId: null,
            termYear:'',
            name:null,
            page: 1,
            size: 50
        },
        pages:{
          total:1,
          sizes:[10,20,30, 50]
        },
        filters:[
          { text: '日志', value: '日志' },
          { text: '视频', value: '视频' }
        ],
        videoUrl: '',
        dialogBook:false
      }
  },
  created() {
    this.getList()
  },
  methods: {
    filterMethod(value, row) {
      if(value == '视频'){
        return row.isVideo == 'true';
      }else{
        return row.isVideo == 'false';
      }
    },
    getList () {
      this.listLoading = true;
      getRecord(this.searchData).then(response => {
        this.list = response.data;
        this.pages.total = response.total;
        if(this.pages.total>this.searchData.size){
          this.listLoading = false;
        }
      }).catch(err => {
        this.listLoading = false;
      });
    },
    goDetail(row){
      this.$router.push({ name: 'RecordViewDetail', params:{id:row.courseId} });
    },
    changeYear(year){
      this.searchData.termYear = year;
      this.getList();
    },
    changePlan(plan){
      this.searchData.planId = plan;
      if(this.list == null){
        this.getList();
      }
    },
    play(row) {
      this.dialogBook = true;
      this.videoUrl = row;
    },
    closeDialog() {
      this.videoUrl = '';
    }
    // handleSizeChange(val) {
    //     this.searchData.size = val;
    //     this.getList();
    // },
    // handleCurrentChange(val) {
    //     this.searchData.page = val;
    //     this.getList();
    // }
  },
  mounted(){
    scrollTable('.recordTeacher');
  }
}
</script>

<style rel="stylesheet/scss" lang="less" scoped>
  .video {
    display: block;
    width:100%;
    max-width: 100%;
    max-height: 100%;
  }
  .img {
    padding-right: 4px;
    vertical-align: middle;
  }
</style>
