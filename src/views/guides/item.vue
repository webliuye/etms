<template>
  <master-page title="批量新增目录">
    <div class="guidesItem">
      <div class="filter-container">
        <el-button class="pull-right main-return" type="text" @click="$router.go(-1);">返回</el-button>
        <el-row type="flex" justify="end" class="text-right">
          <el-col :span="24">
            <el-button class="fl" v-show="batchAddBtn" :loading="loading" type="primary" icon="plus" @click="addStandList('')">批量添加</el-button>
            <el-form :inline="true" :model="listQuery" class="demo-form-inline">
              <public-select ref="profile" @searchList="btnSearch" :showList="showSelect"></public-select>
            </el-form>
          </el-col>
        </el-row>
      </div>
        <el-table :data="list" v-loading.body="listLoading" fit highlight-current-row style="width: 100%" ref="editTable"  @selection-change="selectChange" @select-all="selectAll" @select="select">
          <el-table-column type="selection"  width="48" disabled="disabled"></el-table-column>
          <el-table-column label="实验名称" min-width="200">
            <template slot-scope="scope">
                <router-link class="el-button--text" :to="{ name:'GuidesItemPreview', params: {planId: scope.row.id } }" >{{scope.row.name}}</router-link>
            </template>
          </el-table-column>
          <el-table-column  prop="subjectLabel" align="center" label="科目" min-width="100">
          </el-table-column>
          <el-table-column  prop="gradeLabel" align="center" label="年级" min-width="100">
          </el-table-column>
          <el-table-column  prop="termLabel" align="center" label="学期" min-width="80">
          </el-table-column>
          <el-table-column  prop="teachingMaterialLabel" align="center" label="教材版本" min-width="100">
          </el-table-column>
          <el-table-column  align="center" label="是否必做" min-width="100">
            <template slot-scope="scope">
               {{ scope.row.isMust | statusFilter }}
            </template>
          </el-table-column>
          <el-table-column  prop="modeLabel" align="center" label="开课方式" min-width="100">
          </el-table-column>
          <el-table-column  prop="oper" align="center" label="操作" min-width="120">
            <template slot-scope="scope">
              <a href="javascript:;" v-show='scope.row.isUse == 0' class="el-button el-button--text" @click="addStandList(scope.row)">
                  <span>加入标准</span>
              </a>
              <a href="javascript:;" v-show='scope.row.isUse == 1' class="el-button el-button--text">
                  <span>已加入标准</span>
              </a>
            </template>
          </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="pages.sizes"
                         :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="pages.total">
          </el-pagination>
        </div>

    </div>

  </master-page>
</template>

<script>
    import MasterPage from '../layout/MasterPage';
    import PublicSelect  from '../components/select.vue';
    import store from 'store';
    import { addStandApi } from 'api/guides';
    import {scrollTable} from 'utils/index'

    export default {
        components: {
          MasterPage,
          PublicSelect
        },
        name: 'guides-item',
         data() {
            return {
                listQuery: {
                  page:1,
                  size:50
                },
                showSelect:['stand','subject','grade','term','material','course','search','isMust'],
                batchAddBtn: false,
                guidesId:undefined,
                list: null,
                pages:{
                  total:null,
                  sizes:[10,20,30, 50]
                },
                loading: false,
                listLoading: false,
                selectList: undefined
            }
        },
        created() {
            this.guidesId =  this.$route.params.id;
        },
        mounted(){
            scrollTable(".guidesItem");
        },
        filters: {
            statusFilter(status) {
                const statusMap = {
                    0: '否',
                    null: '否',
                    1: '是'
                };
                return statusMap[status]
            }
        },
        methods: {
            getList(data) {
              data.his_guideId = this.$route.params.id;
              this.listLoading = true;
              store.dispatch('getEdit', data).then(response => {
                this.list = response.data.map(v => {
                  v.isAdd = false;
                  return v ;
                });
                if (this.list.length > 1) {
                  this.batchAddBtn = true;
                }else {
                  this.batchAddBtn = false;
                };
                 this.listLoading = false;

              }).catch(err => {
                this.listLoading = true;
              });
            },
            select(selection,row){
            },
            selectChange (selection) {
              this.selectList = selection;
            },
            selectAll(selection) {
              this.selection = selection.filter(function(item,index,Array){
                return item.isUse != '1';
              });
            },
            btnSearch (data){
              data.page = 1;
              data.size = 10;
              this.getList(data);
            },
            addStandList (row) {
              const ids = [] ;
              if (row) {
                ids[0] = row.id ;
              } else {
                if(!this.selectList){
                  this.$message({
                    message: '请选择要加入的实验目录',
                    type: 'warning'
                  });
                  return;
                }
                if(this.selectList.length == 0){
                  this.$message({
                    message: '请选择未加入的实验目录',
                    type: 'warning'
                  });
                  return;
                }
                for (let i = 0; i < this.selectList.length; i++) {
                  ids[i] = this.selectList[i].id
                }
              }


              this.$confirm('你确认要加入此实验吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.loading = true;
                addStandApi({ids: ids, guidesId:this.guidesId}).then(response => {
                  this.loading = false;
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  });
                  if (row){
                     row.isUse = '1';
                  } else {
                    this.$store.commit('SET_PLANSELECT',null);
                    this.$router.push({ name: 'GuidesEdit', params: { id: this.guidesId }})
                  }
                }).catch(err => {
                  this.loading = false;
                  console.log(err);
                });

              });
            },
            handleSizeChange(val) {
              this.listQuery = jQuery.extend(this.$refs.profile.listQuery,this.listQuery);
              this.listQuery.size = val;
              this.listQuery.page = 1;
              this.getList(this.listQuery);
            },
            handleCurrentChange(val) {
              this.listQuery = jQuery.extend(this.$refs.profile.listQuery,this.listQuery);
              this.listQuery.page = val;
              this.getList(this.listQuery);
            }
        }
    }
</script>
