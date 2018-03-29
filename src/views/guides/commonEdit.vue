<template>
  <div class="filter-container">
    <el-button class="pull-right main-return" type="text" @click="returnBefore">返回</el-button>
    <div class="version-div">
      <div class="left-tree">
        <el-button type="primary" class ="allSource" @click="allVersion">{{versionTitle}}</el-button>
        <el-tree :data="treeData" :props="matrialProps" :default-expanded-keys="defaultExpand" accordion node-key="nodeId" :current-node-key="currentNode" @node-click="handleNodeClick"></el-tree>
      </div>
      <div class="right-content">
        <div class="search-select">
          <el-button type="primary" icon="el-icon-plus" v-if="isNotPreview" @click="addItems" :disabled="operateBoolean">新增实验</el-button>
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
            <el-select clearable  v-model="searchData.isMust"  placeholder="是否必做" @change="findItem">
              <el-option v-for="(item,index)  in isMustList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="fr selectwidth">
            <TypeSelect @changeType="changeType"></TypeSelect>
          </div>
        </div>
        <div class="table-div commonEdit">
          <el-table :data="list" fit highlight-current-row style="width: 100%" ref="editTable">
            <el-table-column label="实验名称" min-width="200" show-overflow-tooltip>
              <template slot-scope="scope">
                  <router-link v-if="isNotPreview" class="el-button--text" :to="{ name:'GuidesEditPreview', params: {planId: scope.row.id } }" >{{scope.row.name}}</router-link>
                  <router-link v-if="!isNotPreview" class="el-button--text" :to="{ name:'GuidesPreviewItem', params: {planId: scope.row.id } }" >{{scope.row.name}}</router-link>
              </template>
            </el-table-column>
            <el-table-column  prop="type" align="center" label="实验类型" min-width="100">
              <template slot-scope="scope">
                <span v-for="(item,index)  in typeData" :key="index" v-if="item.value == scope.row.type">{{item.label}}</span>
              </template>
            </el-table-column>
            <el-table-column  prop="isMust" align="center" label="是否必做" min-width="100">
              <template slot-scope="scope">
                <span v-for="(item,index)  in isMustList" :key="index" v-if="item.value == scope.row.isMust">{{item.label}}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="isNotPreview" prop="oper" label="操作" width="110">
              <template slot-scope="scope">
                <router-link v-if="scope.row.editable" :to="{name:'GuidesItemEdit' , params:{ guideId: scope.row.id, isEdit: true}}" class="el-button--text">
                  编辑
                </router-link>
                <a  v-if="scope.row.removable" href='javascript:;' @click="deleteCatalogues(scope.row)" class ="el-button--text">删除</a>
              </template>
            </el-table-column>
          </el-table>
          <div v-show="!listLoading" class="pagination-container">
            <Pagination :pages="pages" :searchData="searchData" @getTableData="getList"></Pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import TypeSelect from 'views/components/select/typeSelect';
    import { downloadExcel, getGuideNode, getTitleGuide, deleteGuidesItem, getVolumesOfTree, getCatalogueTable } from 'api/guides';
    import store from 'store';
    import { mapGetters } from 'vuex';
    import Pagination from 'views/components/page/pagination';
    import { scrollTable } from 'utils/index'
    export default {
        components: {
          TypeSelect,
          Pagination
        },
        props: {
          isNotPreview:{
            type: Boolean,
            default:true
          }
        },
        data() {
          return {
            options:'',
            subject: '',
            term: '',
            searchData:{
              name:'',
              isMust:'',
              type:'',
              page: 1,
              size: 50,
              textbookCode:null
            },
            treeData:[],
            matrialProps: {
              children: 'children',
              label: 'nodeName'
            },
            isMustList:[{value:"1",label:"是"}, {value:"0",label:"否"}],
            list: [],
            pages:{
              total:0,
              sizes:[10,20,30, 50]
            },
            versionTitle:'',
            listLoading: false,
            defaultExpand:[],
            currentNode:'',
            editBoolean:true,   //省级判断是否发布，发布之后不能修改
            operateBoolean:true,   //只有点击2级树节点后才能操作
            switchBoolean:true,  //升级是够允许下级单位删除
            orgType:this.$store.state.user.userInfo.orgType,
            row:{
              state:'',
              learningperiodId:'',
              subjectId:''
            }
          }
        },
        computed: {
          ...mapGetters([
            'typeData'
          ])
        },
        created() {
          if(!this.$route.params.id){
            this.$route.go(-1);
          }
          //this.$store.dispatch('GetType');
          const vm = this;
          let t1 = this.$store.dispatch('GetStage');
          let t2 = this.$store.dispatch('GetSubject');
          let t3 = this.$store.dispatch('GetAllGrade');
          let t4 = this.$store.dispatch('GetTeach');
          Promise.all([t1, t2, t3, t4]).then(([a, b, c, d]) => {
            let t = '';
            a.forEach(s => {
              if (s.value == vm.$route.params.stageId) {
                t += s.label;
              }
            });
            b.forEach(s => {
              if (s.value == vm.$route.params.subjectId) {
                t += s.label;
              }
            });
            c.forEach(s => {
              if (s.value == vm.$route.params.gradeId) {
                t += s.label;
              }
            });
            d.forEach(s => {
              if (s.value == vm.$route.params.editionId) {
                t += s.label;
              }
            });
            vm.versionTitle = t;
          });
          //this.versionTitle = this.$route.query.stageName + this.$route.query.subjectName + this.$route.query.gradeName + this.$route.query.editionName;
          this.searchData.textbookCode = this.$route.params.id;
          getVolumesOfTree({textbookCode:this.$route.params.id}).then(res => {
            setTimeout(this.con,200);
            this.treeData = res;
          });
          this.titles = '编辑标准';
          if(this.$store.state.commonData.versionTree){
            this.searchData.textbookCode = this.$store.state.commonData.versionTree.nodeId;
            this.defaultExpand.push(this.searchData.textbookCode);
            this.currentNode = this.searchData.textbookCode;
            if(!this.$store.state.commonData.versionTree.children){
              this.operateBoolean = false;
            }
          }
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
          addItems() {  //新增目录
            this.$router.push({ name: 'GuidesAdd', params: {isEdit:false,twothemeId:this.searchData.textbookCode} });
          },
          findItem() {  //搜索

            delete this.searchData.themeId;// 1
            this.getList();
          },
          changeType(val) {
            this.searchData.type = val;
            this.findItem();
          },
          deleteCatalogues(row){
            const ids = [];
            this.$confirm('你确认要删除这些实验?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              ids.push(row.id);
              deleteGuidesItem(ids).then(response => {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                });
                this.getList();
              }).catch(err => {
                console.log(err);
              });
            });
          },
          handleNodeClick(data) {
            this.operateBoolean = false;
            if(data.children && data.children.length > 0){
              this.operateBoolean = true;
            }
            this.$store.commit('SET_VERSIONTREE',data);
            this.searchData.textbookCode = data.nodeId;
            this.getList();
          },
          getList() {   //获取表格数据
            this.listLoading = true;
            getCatalogueTable(this.searchData).then(res => {
              this.list = res.data;
              this.pages.total = res.total;
              if(this.pages.total > this.searchData.size){
                this.listLoading = false;
              }
            }).catch(err => {
              this.listLoading = false;
            });
          },
          returnBefore() {
            this.$router.push({ path: '/guides' });
          },
          con(){
            var tit=$('span.el-tree-node__label');
            tit.each((index,e)=>{
              e.setAttribute("title",e.innerHTML);
            })
          },
          allVersion() {
            this.searchData.textbookCode = this.$route.params.id;
            this.getList();
          }
        },
        mounted(){
           scrollTable('.commonEdit');
        }
    }
</script>
<style type="text/less">
  .search-table {
    margin-top: 8px;
  }

  .right-div {
    margin-top: 8px;
    margin-right: 24px;
    border: 1px solid #e0e0e0;
  }
  .div-title p {
    font-size: 14px;
    color: #333;
    margin: 0;
    height: 24px;
    line-height: 24px;
    padding-left: 8px;
    padding-bottom: 8px;
    font-weight: bold;
  }
  .allSource {
    display: block;
    width: 100%;
    text-align: center;
    font-size: 12px;
    line-height: 24px;
  }
</style>
