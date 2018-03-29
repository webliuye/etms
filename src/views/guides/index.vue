<template>
	<master-page title="目录标准管理">
		<div class="filter-container">
			<div class="search-select">
				<el-button type="primary" :disabled="publish"  @click="reviseVersion">设置版本</el-button>
        <el-button type="primary" :disabled="publish"  @click="installVersion('active')">发布</el-button>
        <el-button type="primary" :disabled="!publish"  @click="installVersion('inactive')">取消发布</el-button>
				<div v-if="setVersion" class="fr switchButton">
					<el-switch v-model="switchBoolean" active-color="#13ce66" inactive-color="#ff4949" active-text="开" inactive-text="关" @change="switchChange"></el-switch>
					<span class="swaitch-span">允许下级单位修改目录</span>
				</div>
			</div>
      <div class="table-div">
        <!-- <el-table :data="list" fit highlight-current-row style="width: 100%">
          <el-table-column prop="name"  align="left" label="学段学科" min-width="180">
            <template slot-scope="scope">
              <a href='javascript:;' v-if="scope.row.stageId != 3" @click="goPreview(scope.row)" class="el-button--text">{{scope.row.stageName + scope.row.gradeName + scope.row.subjectName}}</a>
              <a href='javascript:;' v-if="scope.row.stageId == 3" @click="goPreview(scope.row)" class="el-button--text">{{scope.row.gradeName + scope.row.subjectName}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="editionName" align="left" label="教材版本" min-width="100"></el-table-column>
          <el-table-column prop="catalogueCount"  align="right" label="实验目录数" min-width="140"></el-table-column>
          <el-table-column   align="center" label="操作" width="100">
            <template slot-scope="scope">  
              <a href='javascript:;' @click="GuidesEdit(scope.row)" v-if="!publish" class="el-button--text" style="margin-right:0;">编辑</a>
              <span v-if="publish"  style="color:#ddd">编辑</span>
            </template>
          </el-table-column>
        </el-table> -->
        <VersionTable :tableData="list" :edit="true" :publish="publish" @goPreview="goPreview"></VersionTable>
      </div>
		</div>
</master-page>
</template>

<script>
    import store from 'store';
    import MasterPage from '../layout/MasterPage';
    import VersionTable from 'views/components/guide/versionTable';
    import {getSwitchVersion, changeSwitchVersion, publishVersion, getGuidesNode, getEditionPublish, putEditionPublish} from 'api/guides';
    import { mapGetters } from 'vuex';
    export default {
        components: {
            MasterPage,VersionTable
        },
        data() {
          return {
            addForm: {
                name: '',
                id: ''                   
            },
            list:null, 
            total:null,  
            loading: false,  
            publish:false,                   
            orgId:this.$store.state.user.userInfo.orgId,
            orgType:this.$store.state.user.userInfo.orgType,
            switchBoolean:false ,
            switchObj:{
              state:''
            },
            setVersion:true              
          }
        },
        beforeRouteEnter (to, from, next) {
          store.dispatch('getTable').then(res => {
            if(res.length == 0){
              next({ name: 'GuidesVersion' });
            }else{
              next();
            }  
          });
        },
        computed: {
	        ...mapGetters([
	          'teachData',
            'userUnit'
	        ])
	      },
        created() {
          this.$store.dispatch('GetStage');
          this.$store.dispatch('GetSubject');
          this.$store.dispatch('GetAllGrade');
          this.$store.dispatch('GetTeach');
          getEditionPublish().then(res => {
            if(res == 1){
              this.publish = true;
            }else{
              this.publish = false;
            }
          });
          this.$store.dispatch('GetUserUnit');
          this.$store.commit('SET_VERSIONTREE',null);
          getGuidesNode().then(res =>{
            this.setVersion = res;
          });
        	this.$store.dispatch('GetTeach');
          getSwitchVersion().then(res => {
            this.switchBoolean = res;
          });

          this.getList();
        },
        methods: {
          getList () {   
            store.dispatch('getTable').then(response => {
              this.list = response; 
            }).catch(err => {
              console.log(err);
            });
          },
          switchChange() {
            if(this.switchBoolean){
              this.switchObj.state = 'active';
            }else{
              this.switchObj.state = 'inactive';
            }
            changeSwitchVersion(this.switchObj.state).then(res => {
              this.$message({
                message: '修改成功',
                type: 'success'
              }); 
            });
          },
          reviseVersion() {
            this.$router.push({ name: 'GuidesVersion' });
          },
          goPreview(row){
            this.$router.push({name:'GuidesPreview', params: {id: row.textbookCode, stageId: row.stageId, subjectId: row.subjectId, gradeId: row.gradeId, editionId: row.editionId}, query: row});
          },
          installVersion (value) {
            if(value == 'active'){
              this.$confirm('确认发布?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                putEditionPublish({status:value}).then(() => {
                  this.$message({
                    message: '发布成功',
                    type: 'success'
                  }); 
                  this.publish = true;
                });
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消操作'
                });          
              });
            }else{
              this.$confirm('确认取消发布?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                putEditionPublish({status:value}).then(() => {
                  this.$message({
                    message: '取消成功',
                    type: 'success'
                  }); 
                  this.publish = false;
                });
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消操作'
                });          
              });
            }
          }           
        }
    }
</script>
<style type="text/css" scoped>
  .width90{
    width: 80%;
  }  
  .editIcon{
    display: inline-block;
    cursor: pointer;
    margin-left: 20px;
    width: 40px;   
  }
  .calendar-list-container{
    background: #fff;
    border:1px solid #e0e6ed;
  }
  .swaitch-span {
  	font-size: 12px;
  	line-height: 36px;
    color: #323437;
  }
  
</style>