<template>
<master-page title="教师信息">
    <div class="dashboard-container teacherManage">
      <el-button type="primary" icon="el-icon-plus" @click="goIportal">新增</el-button>
      <el-table :data="list" fit highlight-current-row style="width: 100%; margin-top:16px;" ref="editTable">
        <el-table-column  prop="userName" label="用户名" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column  prop="name" label="姓名" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column  prop="roleCode" label="角色" min-width="160" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.roleCodeName}}</span>
          </template>
        </el-table-column>
        <el-table-column  prop="subjectName" label="所带科目" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column  prop="className" label="所带班级" min-width="240" show-overflow-tooltip></el-table-column>
      </el-table>
      <div v-show="listLoading" class="pagination-container">
        <Pagination :pages="pages" :searchData="searchData" @getTableData="getList"></Pagination>
      </div>
      <el-dialog title="新增教师" :visible.sync="dialogAdd" width="30%" :modal-append-to-body="false" @close="getList">
        <el-form :model="addFormData" ref="addFormData" :rules="rulesChange">
          <el-form-item label="用户名" :label-width="formLabelWidth" prop="loginName">
            <el-input v-model="addFormData.loginName"></el-input>
          </el-form-item>
          <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
            <el-input v-model="addFormData.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" :label-width="formLabelWidth" prop="mobile">
            <el-input :maxlength="11" v-model.number="addFormData.mobile"></el-input>
          </el-form-item>
          <el-form-item label="系统角色" :label-width="formLabelWidth" prop="roleId">
            <el-select v-model="addFormData.roleId" placeholder="选择年级" class="width100">
              <el-option label="实验员" :value="303"></el-option>
              <el-option label="授课老师" :value="304"></el-option>
              <el-option label="实验系统管理员" :value="305"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <p style="font-size:12px;color:#ff0000;text-align:right;">用户初始密码为123@zbglxt，请登录后及时更改.</p>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAdd = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</master-page>
</template>

<script>

    import { mapGetters } from 'vuex';
    import { getTeacher, addNewUser, reviseStaffSubject, getStaffSubject, getInfo, reviseMineInfo, getMineClass } from 'api/manageCenter';
    //import { getInfo, getMineClass, reviseMineInfo, getStaffSubject, reviseStaffSubject } from 'api/manageCenter';
    import MasterPage from 'views/layout/MasterPage';
    import SubjectSelect from 'views/components/select/subjectSelect';
    import { getGrade, getplanGrade } from 'api/common';
    import Pagination from 'views/components/page/pagination';
    import {scrollTable} from "utils/index"
    export default {
      name: 'teacherManage',
      components: { MasterPage, SubjectSelect, Pagination},
      data() {
        return {
          listLoading: true,
          list: null,
          pages:{
            total:1,
            sizes:[10,20,30,50]
          },
          searchData:{
            page: 1,
            size: 50
          },
          addFormData:{
            name:'',
            loginName:'',
            mobile:'',
            roleId:303,
            password:'123',
            authorization:this.$store.getters.token
          },
          subjectArray:[],
          subjectCheckArray:[],
          iportalUrl:this.$store.getters.objApi.IPORTAL_API + '/homepage.html#!/users',
          dialogAdd:false,
          rulesChange:{
            loginName:[
              { required: true, message: '请输入用户名', trigger: 'blur' },
              { max: 20, message: '用户名输入过长', trigger: 'blur' }
            ],
            name:[
              { required: true, message: '请输入姓名', trigger: 'blur' },
              { max: 10, message: '姓名输入过长', trigger: 'blur' }
            ],
            mobile:[
              { required: true, message: '请输入手机号码'},
              { type: 'number', message: '只能输入数字', trigger: 'blur'}
            ]
          },
          formLabelWidth:'72px',
          dialogRevise3:false,
          staffId:null,
          moreClass:true,
          roleCode303:false,
          roleCode304:false,
          userClassLists:[],
          classIds:[],
          gradeData:[],
          classData:[]
        };
      },
      computed: {
        ...mapGetters([
          'subjectData'
        ])
      },
      created() {
        this.$store.dispatch('GetSubject');
        this.getList();
      },
      methods: {
        getList() { // 获取表格数据
          getTeacher(this.searchData).then(res => {
            this.list = res.data;
            this.pages.total = res.total;
            this.list.forEach(function(item){
              var t;
              if(item.roleCode){
                t = item.roleCode.split(',');
                item.roleCodeName = t.map(function(i){
                  if(i == '225'){
                    return '学校管理员'
                  }else if(i == '303'){
                    return '实验员'
                  }else if(i == '304'){
                    return '授课老师'
                  }else if(i == '305'){
                    return '实验系统管理员'
                  }
                }).join('、');
              }else{
                item.roleCodeName = null;
              }
            });
            if(res.total<this.searchData.size){
              this.listLoading = false;
            }
          });
        },
        goIportal() {
          this.dialogAdd = true;
          //window.open(this.iportalUrl);
        },
        getInfoData(){
          var vm = this;
          this.subjectArray = [];
          getInfo({staffId:this.staffId}).then(res => {
            if(res.userClassLists && res.userClassLists.length > 0){
              vm.moreClass = false;
              vm.userClassLists = res.userClassLists;
              for(var i=0;i<res.userClassLists.length;i++){
                this.subjectArray.push(res.userClassLists[i].subjectId);
              }
            }else{
              vm.userClassLists = [];
            }
          });
        },
        addUser() {
          this.$refs['addFormData'].validate((valid) => {
            if(valid){
              addNewUser(this.addFormData).then(res => {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                });
                this.addFormData.name = '';
                this.addFormData.loginName = '';
                this.addFormData.mobile = ' ';
                this.dialogAdd = false;
              }).catch(error => {
                // this.$message({
                //   type: 'error',
                //   message: '添加失败!'
                // });
              });
            }else{
              return false;
            }
          });
        }
      },
      mounted(){
        scrollTable(".teacherManage")
      }
    }
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.dashboard-container { font-family: '微软雅黑';
}
.home-p {
  width: 100%;
  border-bottom: 1px solid #e1e4e3;
  line-height: 1.6em;
  font-size: 14px;
}
.info-class {
  line-height: 28px;
  span {
    padding-right: 10px;
  }
}
.manyClass label.el-checkbox {
  margin-left: 0;
  margin-right: 15px;
}
.manyGrade label.el-checkbox {
  display: block;
}
.el-button {
  padding: 4px 12px;
}
</style>
