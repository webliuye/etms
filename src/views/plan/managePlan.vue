<template>
  <div class="filter-container">
    <div class="search-select">
      <el-button type="primary" class="fl" icon="el-icon-plus" @click="addPlan">新增计划</el-button>
    </div>
    <div class="table-div managePlan">
      <el-table :data="list" fit highlight-current-row style="width: 100%">
        <el-table-column label="计划名称" min-width="190" show-overflow-tooltip>
          <template slot-scope="scope">
            <router-link :to="{name: 'PlanDetail',params:{id:scope.row.id,name:scope.row.name}}" class="el-button--text"><span>{{scope.row.name}}</span></router-link>
          </template>
        </el-table-column>
        <el-table-column align="right" prop="showCount" label="演示实验" min-width="96"></el-table-column>
        <el-table-column align="right" prop="groupCount" label="分组实验" min-width="96"></el-table-column>
        <el-table-column align="center" prop="state" label="状态" min-width="96">
          <template slot-scope="scope">
            {{scope.row.state?'已发布':'未发布'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <a href='javascript:;' class ="el-button--text" v-if="!scope.row.state" @click="handlePlanList(scope.row.id,'edit')">编辑</a>
            <a href='javascript:;' class ="el-button--text" v-if="!scope.row.state && ((scope.row.groupCount != 0) || (scope.row.showCount != 0))" @click="handlePublish(scope.row.id)">发布</a>
            <a href='javascript:;' class ="el-button--text" v-if="!scope.row.state " @click="handlePlanList(scope.row.id,'delete')">删除</a>
            <a href='javascript:;' class ="el-button--text" v-if="scope.row.state" @click="cancelPublish(scope.row.id,scope.row.state)">撤销</a>
            <!-- <a href='javascript:;' class ="el-button--text" style="color:#ccc;" v-if="!scope.row.state&&((scope.row.groupCount != 0) || (scope.row.showCount != 0))"  >删除</a> -->
          </template>
        </el-table-column>
      </el-table>
      <div v-show="!listLoading" class="pagination-container">
        <Pagination :pages="pages" :searchData="listQuery" @getTableData="getList"></Pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import { getPlanList, deletePlan,publishPlan, deletePlanSure } from 'api/plan';
  import Pagination from 'views/components/page/pagination';
  import {scrollTable} from "utils/index"
  export default {
    components : {Pagination},
    data() {
      return {
        listLoading: false,
        list: null,
        listQuery: {
          page: 1,
          size: 50
        },
        pages:{
          total:null,
          sizes:[10,20,30, 50]
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() { // 获取表格数据
        this.listLoading = true;
        getPlanList(this.listQuery).then(response => {
          this.list = response.data;
          this.pages.total = response.total;
          if(this.pages.total>this.listQuery.size){
            this.listLoading = false;
          }
        }).catch(err => {
          this.listLoading = false;
        });
      },
      handlePublish(rowId){
        this.$confirm('您确认发布吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var query={
            id:rowId,
            state:1
          };
          publishPlan(query).then(response => {
            this.$message({
              message: '发布成功',
              type: 'success'
            });
            this.getList();
          }).catch(err => {
             console.log("发布失败");
          });
        })

      },
      cancelPublish(rowId,rowState){
        this.$confirm('您确认取消发布吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var query={
            id:rowId,
            state:0
          };
          rowState=0;
          publishPlan(query).then(response => {
            this.$message({
              message: '已取消发布',
              type: 'success'
            });
            this.getList();
          }).catch(err => {
             console.log("取消失败");
          });
        });
      },
      addPlan(){
        this.$router.push({ path: '/plan/add' });
      },
      handlePlanList(rowid,test){ // 表格编辑删除
        const vm = this;
        if(test==="edit"){// 点击编辑按钮
          this.$router.push({ name: 'PlanEdit', params: { id: rowid }})
        } else {
          this.$confirm('你确定要删除这些内容?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let del = new Promise( function(resolve, reject){
              deletePlan({'id':rowid}).then(res => {
                resolve(res);
              }).catch(err => {
                reject(err);
              });
            } );
            del
            .then(function(res){
              let cnt = '该计划';
              if (res){
                if (res === 'true' || res === true) {
                  vm.getList();
                  vm.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                  return null;
                } else {
                  if(res.bookingCount > 0){
                    cnt += '有日志预约' + res.bookingCount + '条,'
                  }
                  if(res.arrangeCount > 0){
                    cnt += '有日志安排' + res.arrangeCount + '条,'
                  }
                  if(res.finishedCount > 0){
                    cnt += '有登记日志' + res.finishedCount + '条,'
                  }
                  return cnt;
                }
              }
            })
            .then(function(msg){
              if (!msg) {
                return null;
              } else {
                vm.$confirm(msg + ',确认删除将清除以上数据并不可恢复','提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                })
                .then(() => {
                  deletePlanSure({'id':rowid}).then(reponse => {
                    if (reponse) {
                      vm.getList();
                      vm.$message({
                        type: 'success',
                        message: '删除成功!'
                      });
                    } else {
                      vm.$message.error('删除失败!');
                    }
                  }).catch(err => {
                    vm.$message.error('删除失败!');
                  });
                }); 
              }
            })
            .catch(() => {
              vm.$message.error('删除失败!');
            });
          });

        }
      }
    }
    ,mounted(){
      scrollTable('.managePlan')
    }
  }
</script>

