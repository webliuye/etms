<template>
  <master-page title="从目录标准添加">
      <div class="filter-container planAddMore">
        <div class="search-select">
          <el-button class="fl" type="primary" :loading="loading" icon="el-icon-plus" @click="addStandList('')">批量添加</el-button>
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
            <el-select v-model="listQuery.isMust" clearable @change="changeMust" placeholder="是否必做">
              <el-option value='0' label="否"></el-option>
              <el-option value='1' label="是"></el-option>
            </el-select>
          </div>
          <div class="fr selectwidth">
            <TypeSelect :slcType="listQuery.type" @changeType="changeType" ></TypeSelect>
          </div>
          <div class="fr selectwidth">
            <TermSelect :termId="listQuery.termId" @changeTerm="changeTerm"></TermSelect>
          </div>
          <div class="fr selectwidth">
            <GradeSelect :gradeId="listQuery.gradeId" :subject="listQuery.subjectId" @changeGrade="changeGrade"></GradeSelect>
          </div>
        </div>
        <el-table :data="list" v-loading.body="listLoading"  fit highlight-current-row style="width: 100%" ref="editTable"  @selection-change="selectChange">
          <el-table-column type="selection">  </el-table-column>
          <el-table-column label="实验名称" min-width="200">
            <template slot-scope="scope">
              <router-link :to="{name:'PlanMorePreview', params: {planId: scope.row.id } }" class="el-button el-button--text"><span>{{scope.row.name}}</span></router-link>
            </template>
          </el-table-column>
          <el-table-column prop="gradeName" align="center" label="年级" min-width="120"></el-table-column>
          <el-table-column prop="termName" align="center" label="学期" min-width="120"></el-table-column>
          <el-table-column prop="type" align="center" label="实验类型" min-width="120">
            <template slot-scope="scope">
                {{scope.row.type=='1'?'分组实验':"演示实验"}}
            </template>
          </el-table-column>
          <el-table-column prop="isMust"  align="center" label="是否必做" min-width="120">
            <template slot-scope="scope">
                {{scope.row.isMust=='1'?'是':"否"}}
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
    import { getEditList} from 'api/guides';
    import { batchAddPlan, getPlanDetailsMore} from 'api/plan';
    import Pagination from 'views/components/page/pagination';
    import  GradeSelect  from '../components/select/gradeSelect.vue';
    import  TermSelect  from '../components/select/termSelect.vue';
    import  TypeSelect  from '../components/select/typeSelect.vue';
    import {scrollTable} from 'utils/index'
    export default {
        components: {
          MasterPage,
          GradeSelect,
          TermSelect,
          TypeSelect,
          Pagination
        },
        data() {
          return {
            loading: false,
            id:null,
            listLoading: false,
            listQuery: {
              page:1,
              size:50,
              name:'',
              type:'',
              subjectId:'',
              gradeId:'',
              termId:'',
              planId:'',
              isMust:''
            },
            pages:{
              total:null,
              sizes:[10,20,30, 50]
            },
            list: null,
            selectList: undefined
          }
        },
        created() {
          if(this.$store.state.commonData.handData){
            this.listQuery = this.$store.state.commonData.handData;
          }else{
                this.listQuery.planId =  this.$route.params.id;
                this.listQuery.subjectId=  this.$route.params.subject;
                this.listQuery.termId=  this.$route.params.term;
                this.listQuery.gradeId=  this.$route.params.grade;
                this.id=this.$route.params.id;
          }

          this.getList();
        },
        methods: {
          populate(_this, obj) {
            for (let k in _this){
              if (obj.hasOwnProperty(k)){
                _this[k] = obj[k];
              }
            }
            return _this;
          },
          pad(num, size) {
            let s = String(num);
            while (s.length < (size || 2)) {
                s = "0" + s;
            }
            return s;
          },
          mergeCode(opt) {
            opt = this.populate({
                edition: null,
                subject: null,
                grade: null,
                term: null,
                volume: null,
                chapter: null,
                section: null
            }, opt);
            let code = '0000';
            for (let k in opt) {
                console.log(k);
                code += opt[k] ? this.pad(opt[k], 2) : '00';
            }
            return code;
          },

          changeType(val) {
            this.listQuery.type = val;
            this.getList();
          },
          changeMust(){
            this.getList();
          },
          changeTerm(val) {
            this.listQuery.termId = val;
            this.getList();
          },
          changeGrade(val) {
            this.listQuery.gradeId = val;
            this.getList();
          },
          getList() {
            this.listLoading = true;
            getPlanDetailsMore(this.listQuery).then(response => {
                this.list = response.data ;
                this.pages.total = response.total;
                this.listLoading = false;
            }).catch(err => {
              this.listLoading = false;
            });
          },
          selectChange (selection) {
            this.selectList = selection;
          },
          addStandList (row) {
            const ids = [] ;
            if(!this.selectList){
			      this.$message({
                  message: '请选择需要添加的实验！',
                  type: 'warning'
                });
                return false;
            }
	          for (let i = 0; i < this.selectList.length; i++) {
	            ids[i] = this.selectList[i].id
	          }
            this.$confirm('你确认要加入此实验吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.loading = true;
              batchAddPlan (this.listQuery.planId,{'ids':ids}).then(response => {
                this.loading = false;
                this.$message({
                  message: '添加成功',
                  type: 'success'
                });
                this.$router.push({ path: '/plan/edit/'+this.listQuery.planId})
              }).catch(err => {
                this.loading = false;
              });
            }).catch(() => {});
          }
        },
        beforeRouteLeave (to, from, next) {
          if(to.path.indexOf('addMore/preview')!=-1){
             this.$store.state.commonData.handData=this.listQuery;
             next();
          }else{
            this.$store.state.commonData.handData=null;
            next();
          }

        },
        mounted(){
          scrollTable('.planAddMore')
        }
    }
</script>
