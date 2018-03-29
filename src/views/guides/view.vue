<template>
  <master-page title="目录标准查看">
    <div class="guidesView">
      <div class="filter-container">
        <el-row type="flex" justify="end" class="text-right">
          <el-col :span="24">
            <el-form :inline="true" :model="listQuery" class="demo-form-inline">
              <public-select @searchList="searchTable" :showList="showSelect"></public-select>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <el-table :data="list"  fit highlight-current-row style="width: 100%">
        <el-table-column  align="left" label="实验名称" min-width="200">
          <template slot-scope="scope">
              <router-link class="el-button el-button--text" :to="{ name:'GuidesItemPreview', params: {planId: scope.row.id } }" >{{scope.row.name}}</router-link>
          </template>
        </el-table-column>
        <el-table-column  prop="subjectLabel" align="center" label="科目" min-width="100">
        </el-table-column>
        <el-table-column  prop="gradeLabel" align="center" label="年级" min-width="100">
        </el-table-column>
        <el-table-column  prop="termLabel" align="center" label="学期" min-width="100">
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
        <el-table-column  prop="unitName" align="center" label="制作单位" min-width="150">
        </el-table-column>
      </el-table>
      <div v-show="!listLoading" class="pagination-container">
        <Pagination :pages="pages" :searchData="listQuery" @getTableData="getList"></Pagination>
        <!--  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="pages.sizes"
                      :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="pages.total">
        </el-pagination>  -->
      </div>

    </div>

  </master-page>
</template>

<script>
  import MasterPage from '../layout/MasterPage';
  import store from 'store';
  import PublicSelect  from '../components/select.vue';
  import Pagination from 'views/components/page/pagination';
  import {scrollTable} from "utils/index"
    export default {
        components: {
          MasterPage,
          PublicSelect,
          Pagination
        },
         data() {
            return {
                options:'',
                subject: '',
                term: '',
                list: null,
                listLoading: false,
                showSelect:['standState','subject','grade','term','material','course','search','isMust'],
                listQuery: {
                    page: 1,
                    size: 50,
                    sort: '+id',
                    guidesId:''
                },
                pages:{
                  total:null,
                  sizes:[10,20,30, 50]
                },

            }
        },
        created() {
            this.listQuery.guidesId = this.$route.params.id;
            this.getList();
        },

        filters: {
            statusFilter(status) {
                const statusMap = {
                    0: '否',
                    1: '是'
                };
                return statusMap[status]
            }
        },
        methods: {

            getList() {
                this.listLoading = true;
                store.dispatch('getEdit', this.listQuery).then(response => {
                    this.list = response.data;
                    this.pages.total = response.total;
                    if (response.total > this.listQuery.size) {
                      this.listLoading = false;
                    };
                }).catch(err => {
                    this.listLoading = true;
                });
            },
            searchTable(data){
              this.listQuery =  data;
              this.listQuery.guidesId = data.id;

              if (!data.id) {

                this.$message({
                  message: '请选择标准目录',
                  type: 'warning'
                });
                return false;
              }

              this.getList();
            },
            handleFilter () {
              this. getList();
            }
            // handleSizeChange (val) {
            //   this.listQuery.size = val;
            //   this.getList();
            // },
            // handleCurrentChange (val) {
            //   this.listQuery.page = val;
            //   this.getList();
            // }
        },
        mounted(){
          scrollTable('.guidesView')
        }
    }
</script>


