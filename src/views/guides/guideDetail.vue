<template>
  <master-page :title="titles">
    <div class="filter-container">
      <el-button class="pull-right main-return" type="text" @click="returnBefore">返回</el-button>
      <div class="version-div">
        <div class="left-tree">
          <div class="div-title">
            <p>{{versionTitle}}</p>
          </div>
          <el-tree :data="treeData" :props="matrialProps" :default-expanded-keys="defaultExpand" accordion node-key="nodeId" @node-click="handleNodeClick"></el-tree>
        </div>
        <div class="right-content">
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
              <el-select clearable  v-model="searchData.isMust"  placeholder="是否必做" @change="findItem">
                <el-option v-for="(item,index)  in isMustList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
            <div class="fr selectwidth">
              <TypeSelect @changeType="changeType"></TypeSelect>
            </div>
          </div>
          <div class="table-div guideDetail">
            <el-table :data="list" fit highlight-current-row style="width: 100%" ref="editTable"  @selection-change="selectChange">
              <el-table-column label="实验名称" min-width="200">
                <template slot-scope="scope">
                    <router-link class="el-button--text" :to="{ name:'GuidesEditPreview', params: {planId: scope.row.id } }" >{{scope.row.name}}</router-link>
                </template>
              </el-table-column>
              <el-table-column  prop="type" label="实验类型" min-width="100"></el-table-column>
              <el-table-column  prop="isMust" label="是否必做" min-width="100">
              </el-table-column>
            </el-table>
            <div v-show="!listLoading" class="pagination-container">
              <Pagination :pages="pages" :searchData="searchData" @getTableData="getList"></Pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </master-page>
</template>

<script>
    import MasterPage from '../layout/MasterPage';
    import TypeSelect from 'views/components/select/typeSelect';
    import { downloadExcel, getGuideNode, getTitleGuide, deleteGuidesItem } from 'api/guides';
    import Pagination from 'views/components/page/pagination';
    import store from 'store';
    import {scrollTable} from "utils/index"
    export default {
        components: {
          MasterPage,
          TypeSelect,
          Pagination
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
              themeId:'',
              learningperiod:null,
              subjectId:null,
              oneThemeId:null,
              gradeId:null,
              termId:null
            },
            treeData:[],
            matrialProps: {
              children: 'nodeList',
              label: 'nodeName'
            },
            isMustList:[{value:"1",label:"是"}, {value:"0",label:"否"}],
            fileList: [],
            dialogUpload: false,
            list: [],
            pages:{
              total:null,
              sizes:[10,20,30, 50]
            },
            versionTitle:'',
            listLoading: false,
            selectList: undefined,
            formdata:{
              token: this.$store.getters.token,
              url: this.$store.getters.objApi.BASE_API + '/api/guides/excel'
            },
            defaultExpand:[],
            action: this.$store.getters.objApi.BASE_API + '/api/guides/' + this.$route.params.id + "/import",
            editBoolean:true,   //省级判断是否发布，发布之后不能修改
            operateBoolean:false,   //只有点击2级树节点后才能操作
            switchBoolean:true,  //升级是够允许下级单位删除
            orgType:this.$store.state.user.userInfo.orgType,
            row:{
              state:'',
              learningperiodId:'',
              subjectId:''
            },
            headers:{
               "Authorization": "Bearer " + this.$store.getters.token
            }
          }
        },
        created() {
          this.searchData.id = this.$route.params.id;
          if(this.$route.params.state == '1' && this.orgType == '221'){   //省级判断是否发布，发布之后不能修改
            this.editBoolean = false;
          }
          this.row.state = this.$route.params.state;
          this.row.learningperiodId = this.$route.params.learningperiodId;
          this.row.subjectId = this.$route.params.subjectId;
          this.searchData.learningperiod = this.$route.params.learningperiodId;
          this.searchData.subjectId = this.$route.params.subjectId;
          getGuideNode(this.row).then(res => {
            this.treeData = res.nodeList;
            this.versionTitle = this.$route.params.editionName + res.name;
            setTimeout(this.con,200);//为一行做显示不全时，做悬浮文字；
          });
          this.titles = '编辑标准';
          if(this.$store.state.commonData.twothemeId){
            this.searchData.themeId = this.$store.state.commonData.twothemeId;
            this.defaultExpand.push(this.searchData.themeId);

            this.getList();
          }
           this.findItem();
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
          findItem() {  //搜索
            delete this.searchData.themeId;// 1
            this.getList();
          },
          changeType(val) {
            this.searchData.type = val;
            this.findItem();
          },
          handleNodeClick(data,db,adc) {
            this.operateBoolean = false;
            console.log(data);
            if(data.level == 1){
              this.searchData.oneThemeId = null;
              this.searchData.themeId = null;
              this.searchData.termId = data.termId;
              this.searchData.gradeId = data.gradeId;
            }
            if(data.level == 2){
              this.searchData.themeId = null;
              this.searchData.oneThemeId = data.nodeId;
            }else if(data.level == 3){
              this.operateBoolean = true;
              this.searchData.themeId = data.nodeId;
              this.$store.commit('SET_TWOTHEMEID',this.searchData.themeId);
            }
            this.getList();
            setTimeout(this.con,200);//为一行做显示不全时，做悬浮文字；
          },
          getList() {   //获取表格数据
            this.listLoading = true;
            getTitleGuide(this.searchData).then(res => {
              this.list = res.data;
              this.pages.total = res.total;
              if(this.pages.total > this.searchData.size){
                this.listLoading = false;
              }
            }).catch(err => {
              this.listLoading = false;
            });
          },
          selectChange (selection) {
            this.selectList = selection;
          },
          handlePreview(file) {
          },
          handleChange(file,fileList) {
            this.fileList = fileList.slice(-1);
          },
          handleFilter() {
              this.getList();
          },
          // handleSizeChange(val) {
          //     this.searchData.size = val;
          //     this.getList();
          // },
          // handleCurrentChange(val) {
          //     this.searchData.page = val;
          //     this.getList();
          // },
          returnBefore() {
            this.$router.push({ path: '/guides' });
          },
          con(){
            var tit=$('span.el-tree-node__label');
            tit.each((index,e)=>{
              e.setAttribute("title",e.innerHTML);
            })
          }
        },
        mounted(){
          scrollTable(".guideDetail")
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

</style>
