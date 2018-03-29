<template>
<master-page title="我的预约">
    <div class="dashboard-container addBooking">
      <div class="search-select">
        <div class="fr">
          <el-button icon="el-icon-search" @click="findItem"></el-button>
        </div>
        <div class="fr selectwidth">
          <el-input placeholder="实验名称" v-model="searchData.name"></el-input>
        </div>
        <div class="fr selectwidth">
          <PlanSelect :year="searchData.year" @changePlan="changePlan"></PlanSelect>
        </div>
        <div class="fr selectwidth">
          <YearSelect @changeYear="changeYear"></YearSelect>
        </div>
      </div>
      <el-table :data="list"  border fit highlight-current-row style="width: 100%;" ref="editTable">
        <el-table-column  align="left" label="实验名称" min-width="140">
          <template slot-scope="scope">
              <router-link :to="{ name:'addBookingPreview', params: {id: scope.row.planDetailId } }" class="el-button el-button--text">{{scope.row.planDetailName}}</router-link>
          </template>
        </el-table-column>
        <el-table-column  prop="gradeLabel" align="center" label="年级" min-width="100"></el-table-column>
        <el-table-column  prop="termLabel" align="center" label="学期" min-width="80"></el-table-column>
        <el-table-column  prop="planDetailMust" align="center" label="是否必做" min-width="100"></el-table-column>
        <el-table-column  prop="modeLable" align="center" label="开课方式" min-width="100"></el-table-column>
        <el-table-column  prop="planDetailEquipment" align="center" label="实验仪器" min-width="120"></el-table-column>
        <el-table-column  prop="planDetailWeek" align="center" label="上课周次" min-width="100"></el-table-column>
        <el-table-column  prop="statistics" align="center" label="已预约次数" min-width="120">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="bookingInform(scope.row)">{{scope.row.statistics}}</el-button>
          </template>
        </el-table-column>
        <el-table-column  prop="edit" align="center" label="操作" min-width="80">
          <template slot-scope="scope">
            <router-link :to="{ name:'BookingInfo', params: {id: scope.row } }" class="el-button el-button--text">预约</router-link>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="searchData.page" :page-sizes="pages.sizes"
          :page-size="searchData.size" layout="total, sizes, prev, pager, next, jumper" :total="pages.total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="预约信息" :visible.sync="dialogBook" width="30%" class="dialogBook" :modal-append-to-body="false">
      <el-row :gutter="8">
        <el-form label-width="120px">
          <el-col :span="24" v-for="(item,index)  in bookInfor" :key="index" class="col-bottom">
            <el-form-item label="班级:">
              <span>{{item.classId}}</span>
            </el-form-item>
            <el-form-item label="上课时间:">
              <span>{{item.classDate.slice(0,10)}}</span>
            </el-form-item>
            <el-form-item label="申请时间:">
              <span>{{item.createTime.slice(0,10)}}</span>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </el-dialog>
</master-page>
</template>

<script>
    import { mapGetters } from 'vuex';
    import MasterPage from 'views/layout/MasterPage';
    import YearSelect from 'views/components/select/yearSelect';
    import PlanSelect from 'views/components/select/planSelect';
    import { getPlanDetail, getClassInfos, getAllBooking } from 'api/booking';
    import {scrollTable} from "utils/index"
    export default {
      name: 'addBooking',
      components: { MasterPage, YearSelect, PlanSelect},
      data() {
        return {
          listLoading: true,
          list: null,
          listQuery: {
            page: 1,
            size: 10
          },
          pages:{
            total:1,
            sizes:[10,20,30]
          },
          searchData:{
            page: 1,
            size: 50,
            year:'',
            planId:''
          },
          dialogBook:false,
          bookInfor:[]
        }
      },
      watch: {
        year() {
          this.getPlanData();
        }
      },
      methods: {
        getPlanData(){
          getPlanDetail(this.searchData).then(res => {
            this.list = res.data;
            this.pages.total = res.total;
          });
        },
        changeYear(year){
          this.searchData.year = year;
        },
        changePlan(plan){
          this.searchData.planId = plan;
          if(this.list == null){
            this.getPlanData();
          }
        },
        handleSizeChange(val) { // 显示多少页
          this.searchData.size = val;
          this.getPlanData();
        },
        handleCurrentChange(val) {  // 点击页数
          this.searchData.page = val;
          this.getPlanData();
        },
        findItem() {
          this.getPlanData();
        },
        bookingInform(row) {
          if(row.statistics == 0){
            this.$message('暂无预约信息');
            return;
          }
          this.dialogBook = true;
          getAllBooking(row.planDetailId).then(res => {
            this.bookInfor = res;
          });
        }
      },
      mounted(){
        scrollTable(".addBooking")
      }
    }
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.dashboard-container { font-family: '微软雅黑';
  .router-a { padding-right: 8px;}
  .return { cursor: pointer; float: right; display: inline;}
}
.equipment-table tr th{
    background-color: #f0f7f5;
  }
  .equipment-table tr td, .equipment-table tr th{
    border: 1px solid #e2e2e2;
    padding: 4px 8px;
  }
  .col-bottom {
    border-bottom: 1px dashed #ccc;
    margin-bottom: 20px;
  }
  .dialogBook {
    max-height: 520px;
    overflow-y: scroll;
  }
</style>
