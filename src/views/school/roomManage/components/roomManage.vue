<template>
  <div class="dashboard-container roomManage">
    <div class="search-select">
      <el-button class="fl" type="primary" icon="el-icon-plus" @click="addRoom">新增</el-button>
      <div class="fr selectwidth1" v-if="!isLead">
        <el-select v-model="searchData.type"  @change="findItem" clearable placeholder="教室类别">
          <el-option
            v-for="(item,index)  in classRooms"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <el-table :data="list"  fit highlight-current-row style="width: 100%" ref="editTable">
      <el-table-column  prop="label" label="教室类别" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column  prop="name" label="教室名称" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column  prop="deviceId" label="设备ID" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column  prop="learningperiodName" label="学段" min-width="120"></el-table-column>
      <el-table-column  prop="staffName" label="所属学科" min-width="120">
        <template slot-scope="scope">
          <span>{{scope.row.subjectNameArray.join(',')}}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="staffName" label="负责人" min-width="120"></el-table-column>
      <el-table-column  label="操作" width="120">
        <template slot-scope="scope">
          <a href='javascript:;' class ="el-button--text" @click.stop="reviseRoom(scope.row)">修改</a>
          <a href='javascript:;' class ="el-button--text" @click.stop="delRoom(scope.row)">删除
          </a>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="listLoading" class="pagination-container">
      <Pagination :pages="pages" :searchData="searchData" @getTableData="getList"></Pagination>
    </div>
    <el-dialog :title="orderTitle" :visible.sync="dialogRevise" width="30%" :modal-append-to-body="false">
      <el-form :model="reviseFormData">
        <el-form-item label="学段" :label-width="formLabelWidth">
          <el-select v-model="reviseFormData.learningperiodId" placeholder="选择学段"  class="width100">
            <el-option
              v-for="(item,index)  in sectionData"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教室类别" :label-width="formLabelWidth">
          <el-select v-model="reviseFormData.type" placeholder="所有教室"  class="width100">
            <el-option
              v-for="(item,index)  in classRooms"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教室名称" :label-width="formLabelWidth">
          <el-input v-model="reviseFormData.name" auto-complete="off" placeholder="请输入教室名称"></el-input>
        </el-form-item>
        <el-form-item v-if="reviseFormData.type == 1" label="所属学科" :label-width="formLabelWidth">
          <el-checkbox-group v-model="reviseFormData.subjectArray" class="manyClass manyGrade">
            <el-checkbox v-for="(item,index)  in subjectData" :key="index" :value="item.value" :label="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="reviseFormData.type == 1" label="负责人" :label-width="formLabelWidth">
          <el-select v-model="reviseFormData.staffId" clearable placeholder="请选择实验员" class="width100">
            <el-option
              v-for="(item,index)  in staffData"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRevise = false">取 消</el-button>
        <el-button type="primary" @click="reviseClassRoom">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="addTitle"  :visible.sync="dialogAdd" width="30%" :modal-append-to-body="false">
      <el-form :model="addFormData" :rules="rules">
        <el-form-item label="学段" :label-width="formLabelWidth">
          <el-select v-model="addFormData.learningperiodId" placeholder="选择学段"  class="width100">
            <el-option
              v-for="(item,index)  in sectionData"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教室类别" :label-width="formLabelWidth">
          <el-select v-model="addFormData.type" placeholder="选择教室"  class="width100">
            <el-option
              v-for="(item,index)  in classRooms"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教室名称" :label-width="formLabelWidth">
          <el-input v-model="addFormData.name" auto-complete="off" placeholder="请输入教室名称"></el-input>
        </el-form-item>
        <el-form-item v-if="addFormData.type == 1" label="所属学科" :label-width="formLabelWidth">
          <el-checkbox-group v-model="addFormData.subjectArray" class="manyClass manyGrade">
            <el-checkbox v-for="(item,index)  in subjectData" :key="index" :value="item.value" :label="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="addFormData.type == 1" label="负责人" :label-width="formLabelWidth">
          <el-select v-model="addFormData.staffId" clearable placeholder="请选择实验员" class="width100">
            <el-option
              v-for="(item,index)  in staffData"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAdd = false">取 消</el-button>
        <el-button type="primary" @click="addClassRoom">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { getSections, getAllStaffg } from 'api/common';
    import Pagination from 'views/components/page/pagination';
    import { getClassRoomList, deleteClassRoom, reviseRoom, addRoom } from 'api/manageCenter';
    import {scrollTable} from "utils/index"
    export default {
      name: 'roomManage',
      props:{
        isLead:{
          type: Boolean,
          default: false
        }
      },
      components: { Pagination},
      data() {
        return {
          listLoading: false,
          list: null,
          pages:{
            total:1,
            sizes:[10,20,30, 50]
          },
          searchData:{
            page: 1,
            size: 50,
            type: ''
          },
          staffData:[],
          orderTitle:'修改教室',
          addTitle:'新增教室',
          dialogRevise:false,
          dialogAdd:false,
          reviseFormData:{
            type: '',
            name:'',
            learningperiodId:'',
            staffId:'',
            subjects:'',
            subjectArray:[],
            id:''
          },
          addFormData:{
            learningperiodId:'',
            type: '',
            name: '',
            staffId:'',
            subjects:'',
            subjectArray:[]
          },
          formLabelWidth:'72px',
          rules:{}
        }
      },
      computed: {
        ...mapGetters([
          'classRooms',
          'sectionData',
          'subjectData'
        ])
      },
      created() {
        getAllStaffg().then(res => {
          this.staffData = res;
        });
        this.$store.dispatch('GetSubject');
        this.$store.dispatch('GetClassRooms');
        this.$store.dispatch('GetSection');
        this.getList();
      },
      methods: {
        getList() { // 获取表格数据
          this.listLoading = true;
          getClassRoomList(this.searchData).then(res => {
            if(res.data && res.data.length > 0){
              res.data.forEach(function(s){
                s.subjectNameArray = [];
                s.subjectArray = [];
                if(s.subjects && s.subjects.length > 0){
                  s.subjects.forEach(function(u){
                    s.subjectNameArray.push(u.subjectName);
                    s.subjectArray.push(u.subjectId);
                  });
                }
              })
            }
            this.list = res.data;
            this.pages.total = res.total;
            if(this.pages.total>this.listQuery.searchData){
              this.listLoading = false;
            }
          }).catch(err => {
            this.listLoading = false;
          });
        },
        findItem () { //搜索操作
          this.searchData.page = 1;
          this.getList();
        },
        reviseRoom (row) {
          this.dialogRevise = true;
          this.reviseFormData.type = row.type;
          this.reviseFormData.learningperiodId = row.learningperiodId;
          this.reviseFormData.name = row.name;
          this.reviseFormData.id = row.id;
          this.reviseFormData.learningperiodName = row.learningperiodName;
          this.reviseFormData.staffId = row.staffId;
          this.reviseFormData.subjectArray = row.subjectArray;
        },
        reviseClassRoom() {
          this.dialogRevise = false;
          this.reviseFormData.subjects = this.reviseFormData.subjectArray.join(',');
          addRoom(this.reviseFormData).then(res => {
            this.getList();
            this.$message({
              message: '修改成功',
              type: 'success'
            });
          })
        },
        addRoom () {
          this.addFormData.name='';
          this.dialogAdd = true;
          this.addFormData.type = '1';
          this.addFormData.learningperiodId=this.sectionData[0].value;
        },
        addClassRoom () {
          if(!this.addFormData.learningperiodId){
            this.$message({
              message: '请选择学段',
              type: 'warning'
            });
            return;
          }
          if(this.addFormData.name.trim() == ''){
            this.$message({
              message: '名字不能为空',
              type: 'warning'
            });
            return;
          }
          if(this.addFormData.type != '1'){
            this.addFormData.subjects = '';
            this.addFormData.staffId = '';
            this.addFormData.subjectArray = [];
          }else{
            this.addFormData.subjects = this.addFormData.subjectArray.join(',');
          }
          this.dialogAdd = false;
          addRoom(this.addFormData).then(res => {
            this.getList();
            this.addFormData.name = '';
            this.addFormData.subjectArray = [];
            this.addFormData.staffId ='';
            this.$message({
              message: '新增成功',
              type: 'success'
            });
          }).catch(error => {
            // console.log(error);
            // if(error.message){
            //   this.$message({
            //     message: '新增失败' + error.message,
            //     type: 'warn'
            //   });
            // }else{
            //   this.$message({
            //     message: '新增失败,请重新选择',
            //     type: 'warn'
            //   });
            // }
          });
        },
        delRoom (row) { //删除操作
          this.$confirm('你确认要删除['+row.name+']教室吗', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteClassRoom(row.id).then(res => {
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
      mounted(){
        scrollTable('.roomManage');
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
.addsome {
  font-size: 14px;
  cursor: pointer;
}
</style>
