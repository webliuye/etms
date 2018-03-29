<template>
  <master-page title="编辑计划">
    <div class="filter-container planEdit">
      <el-button class="pull-right main-return" type="text" @click="returnBefore">返回</el-button>
      <div class="search-select" style="padding-bottom:0;">
        <span class="fl" v-text="planInfo.name" style="line-height:32px;"></span>

      </div>
      <div class="well-line">
        <div class="fr">
          <el-input placeholder="实验名称" v-model="listQuery.name">
            <i
            class="el-icon-search el-input__icon"
            slot="suffix"
            @click="getList">
            </i>
          </el-input>
        </div>
        <div class="fr selectwidth">
          <el-select v-model="listQuery.isOwn" @change="getList" placeholder="实验分类" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="校本实验" :value="0"></el-option>
            <el-option label="标准实验" :value="1"></el-option>
          </el-select>
        </div>
        <el-button class="fl" icon="el-icon-delete" :loading="loadingSave" :disabled="deleteBoolean" type="primary" @click="deleteMore()" style="height:26px;">批量删除</el-button>
        <el-button-group class="fl left16">
          <el-button type="primary" icon="el-icon-plus" @click="handlePlanList('addMore')">从目录库添加</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="handlePlanList('add')">新增校本实验</el-button>
        </el-button-group>

        <el-button class="fl left16" type="success" @click="returnBefore" style="height:26px;">确  认</el-button>
      </div>
      <el-table :data="list" fit highlight-current-row style="width: 100%" @selection-change="selectChange">
        <el-table-column type="selection">  </el-table-column>
        <el-table-column label="实验名称" min-width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <router-link :to="{name: 'PlanPreview', params:{planId:scope.row.id}}" class="el-button--text"><span>{{scope.row.name}}</span></router-link>
          </template>
        </el-table-column>
        <el-table-column prop="isOwn" label="实验分类" min-width="110">
          <template slot-scope="scope">
            <span>{{scope.row.isOwn==0?'校本实验':'标准实验'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isMust" label="是否必做" min-width="96" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.isMust==1?'是':'否'}}</span>
          </template>
        </el-table-column>
         <el-table-column align="center"  label="实验类型" min-width="96">
           <template slot-scope="scope">
             <el-select v-model="scope.row.type" @change="saveAll">
                 <el-option v-for="(item,index)  in typeData" :key="index" :label="item.label" :value="item.value"></el-option>
             </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" label="上课周次" width="240">
          <template slot-scope="scope">
            <el-input-number style="width:50%; text-align:center" size="mini" v-model="scope.row.week" @change="changeWeek(scope.row)":min="1" :max="30" label="填写周次"></el-input-number>
           <!-- <el-input type="number" :max="20" :min="1" class="input-week" v-model="scope.row.week" @blur="changeWeek(scope.row)" @change="changeWeek2" @keyup="filterInput($event)" required></el-input> -->
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <a href='javascript:;' class ="el-button--text"  @click="handlePlanList('edit',scope.row.id)">编辑</a>
            <a href='javascript:;' class ="el-button--text" v-if="!scope.row.catalogueId || !scope.row.isMust"  @click="handlePlanList('deleted',scope.row)">删除</a>
            <!-- <el-tooltip class="item" effect="light" content="已有实验登记预约或安排，不可删除" placement="right">
                <a href='javascript:;' style="color:#ccc;" v-if="scope.row.isDel!=1"   >删除</a>
            </el-tooltip> -->
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
  import MasterPage from '../layout/MasterPage';
  import Pagination from 'views/components/page/pagination';
  import {getPlanInfo, getPlanDetails, deletePlanDetails, updatePlan, batchUpdatePlan, deletePlanDetailsMore} from 'api/plan';
  import { mapGetters } from 'vuex';
  import { scrollTable} from "utils/index"
  export default {
    components: {
      MasterPage,Pagination
    },
    data() {
      return {
        orderTitle:"请选择实验计划分类",
        isChanged: false,
        loadingSave: false,
        listLoading: false,
        list: null,
        listQuery: {
          page: 1,
          size: 50,
          name:'',
          isOwn:null
         },
        pages:{
          total:1,
          sizes:[10,20,30, 50]
        },
        deleteBoolean:true,
        loading: false,
        planInfo:{},
        formData:{
          subject: '',
          grade:'',
          term:''
        },
        selectList:[],
        rules: {
          name: [
            { required: true, message: '请输入实验计划', trigger: 'blur' },
            { min: 1, max: 50, message: '输入内容超出规定长度', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      ...mapGetters([
        'subjectData',
        'gradeData',
        'termData',
        'typeData'
      ])
    },
    created() {
      this.$store.dispatch('GetType');
      this.id = this.$route.params.id;
      this.$store.state.commonData.editPreviewData = {} ;
      this.getInfo();
      this.getList();
    },
    methods: {
      returnBefore() {
        this.$router.push({ path: '/plan' });
      },
      deleteMore() {
        const ids = [];
        if(!this.selectList || this.selectList.length < 1){
          this.$message({
            message: '请选择需要删除的实验！',
            type: 'warning'
          });
          return false;
        }
        for (let i = 0; i < this.selectList.length; i++) {
          let list = this.selectList[i];
          !(list.catalogueId && list.isMust) && ids.push(list.id);
        }
        if(ids.length < 1){
          this.$message({
            message: '没有可删除的实验,请重新选择！',
            type: 'warning'
          });
          return false;
        }
        this.$confirm('你确定要删除这些实验?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deletePlanDetailsMore({ids:ids}).then(res => {
            this.$message({
              message: '删除成功！',
              type: 'success'
            });
            this.getList();
          }).catch(error => {
            this.$message({
              message: '删除失败！',
              type: 'warning'
            });
            this.getList();
          });
        });
      },
      selectChange (selection) {
        this.selectList = selection;
        if(this.selectList.length > 0){
          this.deleteBoolean = false;
        }else{
          this.deleteBoolean = true;
        }
      },
      getInfo() { // 获取计划信息
        getPlanInfo(this.id).then(response => {
          this.planInfo = response;
          this.formData = {
            id: this.planInfo.id,
            subject: this.planInfo.subject,
            grade: this.planInfo.grade,
            term: this.planInfo.term,
            year: this.planInfo.year,
            name: this.planInfo.name
          };
        });
      },
      getList() { // 获取表格数据
        this.listLoading = true;
        getPlanDetails(this.id,this.listQuery).then(response => {
          this.list = response.data;
          this.list.forEach(function(item){
            if(!item.week){
              item.week = '1';
            }
          });
          this.pages.total = response.total;
          if(this.pages.total>this.listQuery.size){
            this.listLoading = false;
          }
        }).catch(err => {
          this.listLoading = false;
        });
      },
      handlePlanList(text,rowid){ //页面按钮操作
        this.goPlan(text,rowid);
      },
      goPlan(text,rowid){
        if(text==="addMore"){  // 从目录标准添加
          this.$store.commit('SET_PLANSELECT',null);
          this.$router.push({ name: 'PlanAddMore', params: { id: this.id,subject:this.formData.subject,grade:this.formData.grade,term:this.formData.term},query:this.formData});
        } else if(text==='add'){ // 新增校本目录
          this.$router.push({ name: 'PlanAddCatalog', params: { id: this.id }});
        } else if(text==='edit'){ // 编辑
          this.$router.push({ name: 'PlanEditCatalog', params: { planId: rowid }});
        } else if(text==='deleted') { // 删除
          this.$confirm('你确定要删除['+rowid.name+']实验?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deletePlanDetails(rowid.id).then(response => {
              this.$message({
                message: '操作成功！',
                type: 'success'
              });
              this.getList();
            });
          }).catch(() => {});
        }
      },
      checkChange(callBack){
        callBack();
      },
      changeWeek(row) {
        this.isChanged = true;
        if(row.week < 1 || row.week > 30){
          this.$message({
            message: '周次不能小于1和大于30',
            type: 'error'
          });
          row.week = 1;
        }else if(!row.week || row.week == ''){
          row.week = 1;
        }else{
          this.saveAll();
        }
      },
      saveAll(){
        batchUpdatePlan({data:this.list}).then(response => {
        }).catch(err => {
          this.$message({
            message: '保存失败,请重新修改！',
            type: 'success'
          });
        });
      },
      checkWeek(){
        const length = this.list.length;
        let _check = true;
        for(let i=0;i<length;i++){
          const _week = this.list[i].week?this.list[i].week.toString().trim():'';
          this.list[i].week = _week;
          if(!this.list[i].week){
            jQuery(".input-week").eq(i).addClass('error');
            _check = false;
          }
        }
        return _check;
      }
    },
    mounted(){
     scrollTable('.planEdit')
    }
  }
</script>
<style scoped>
  .well-line{ margin-bottom: 10px; font-size: 14px;}
  .error{ border:1px solid #f00; }
  .error:focus{ outline: none; }
  .pull-right{
    margin-bottom:8px;
  }
</style>

