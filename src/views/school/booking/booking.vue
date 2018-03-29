<template>
<master-page title="我的预约">
    <div class="dashboard-container bookingmain">
      <div class="search-select">
        <div class="fr">
          <el-input
            placeholder="实验名称"
            v-model="searchData.name">
            <i
            class="el-icon-search el-input__icon"
            slot="suffix"
            @click="findItem">
            </i>
          </el-input>
        </div>
        <div class="fr selectwidth">
          <el-select v-model="searchData.state" clearable placeholder="安排状态">
            <el-option
              v-for="(item,index)  in stateDate"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="fr selectwidth">
          <MyclassSelect @changeClass="changeClass"></MyclassSelect>
        </div>
        <div class="fr selectwidth">
          <YearSelect @changeYear="changeYear"></YearSelect>
        </div>
      </div>
      <el-table :data="list" fit highlight-current-row style="width: 100%;" ref="editTable" :default-sort = "{prop: 'courCreateTime', order: 'descending'}">
        <el-table-column  align="left" label="实验名称" min-width="180" show-overflow-tooltip>
          <template slot-scope="scope">
              <router-link :to="{ name:'bookingPreview', params: {id: scope.row.planDetailId } }" class="el-button el-button--text">{{scope.row.courName}}</router-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="上课时间" min-width="140">
          <template slot-scope="scope">
            <span>{{scope.row.courDate.slice(0,10)}}</span>
          </template>
        </el-table-column>
        <el-table-column  prop="courClassName" align="center" label="上课班级" min-width="100"></el-table-column>
        <el-table-column  prop="timeLabel" align="center" label="上课节次" min-width="100"></el-table-column>
        <el-table-column  prop="roomName" align="center" label="上课地点" min-width="140"></el-table-column>
        <el-table-column  prop="feedBack" align="center" label="安排说明" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column  align="center" label="安排状态" min-width="100">
          <template slot-scope="scope">
            <span>{{['待安排','可以上课','不能上课','已完成'][scope.row.courState]}}</span>
          </template>
        </el-table-column>
        <el-table-column  align="center" label="操作" min-width="120">
          <template slot-scope="scope">
            <router-link v-if="scope.row.courState=='0'" :to="{ name:'RevisebookingInfo', params: {id: scope.row } }" class="el-button el-button--text">修改</router-link>
            <span v-if="scope.row.courState=='0'" class="el-button el-button--text" @click="deletePlan(scope.row)"> 删除</span>
            <router-link v-if="scope.row.courState=='2'" :to="{ name:'RevisebookingInfo', params: {id: scope.row } }" class="el-button el-button--text">重新申请</router-link>
            <span v-if="scope.row.courState=='2'" class="el-button el-button--text" @click="deletePlan(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="searchData.page" :page-sizes="pages.sizes"
          :page-size="searchData.size" layout="total, sizes, prev, pager, next, jumper" :total="pages.total">
        </el-pagination>
      </div>
    </div>
    </master-page>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { getBookingList, delBooking, reviseBooking, reviseEquipment } from 'api/booking';
    import { getPlansme } from 'api/booking';
    import YearSelect from 'views/components/select/yearSelect';
    import MyclassSelect from 'views/components/select/myclassSelect';
    import ClassTimeSelect from 'views/components/select/classTimeSelect';
    import MasterPage from 'views/layout/MasterPage';
    import {scrollTable} from "utils/index";
    export default {
      name: 'booking',
      components: { YearSelect, MyclassSelect, MasterPage, ClassTimeSelect},
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
            state:''
          },
          stateDate:[
            {
              value:'0',
              label:'待安排'
            },
            {
              value:'1',
              label:'可以上课'
            },
            {
              value:'2',
              label:'不能上课'
            },
            {
              value:'3',
              label:'已完成'
            }
          ]
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
              });
            }
          });
        });
        this.getList();
      },
      methods : {
        getList() { // 获取表格数据
          getBookingList(this.searchData).then(res => {
            this.list = res.data;
            this.pages.total = res.total;
            if(res.total == 0){
              this.listLoading = false;
            }
          })
        },
        handleSizeChange(val) { // 显示多少页
          this.searchData.size = val;
          this.getList();
        },
        handleCurrentChange(val) {  // 点击页数
          this.searchData.page = val;
          this.getList();
        },
        changeYear(year){
          this.searchData.year = year;
        },
        changeClass(myClass){
          this.searchData.classId = myClass;
        },
        findItem() {
          this.getList();
        },
        deletePlan(row) {
          this.$confirm('你确定删除此条预约信息吗', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            delBooking(row.courId).then(res => {
              this.getList();
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
      },
      mounted() {
        scrollTable('.bookingmain')
        this.searchData.year = this.$store.state.commonData.nowYear;
      }
    }
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.dashboard-container { font-family: '微软雅黑';
}
.right {
  float: right; display: inline;
}
.equipment-table tr th{
    background-color: #f0f7f5;
  }
  .equipment-table tr td, .equipment-table tr th{
    border: 1px solid #e2e2e2;
    padding: 4px 8px;
  }
</style>
