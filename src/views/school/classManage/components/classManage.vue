<template>
    <div class="dashboard-container classManage">
      <div class="search-select">
        <el-button class="fl buttonWidth" type="primary" icon="el-icon-plus" @click="addClass">新增</el-button>
        <div class="fr" v-if="!isLead">
          <el-input v-model="searchData.className" placeholder="班级名称">
            <i
            class="el-icon-search el-input__icon"
            slot="suffix"
            @click="findItem">
            </i>
          </el-input>
        </div>
        <div class="fr selectwidth" v-if="!isLead">
          <el-select v-model="searchData.grade" placeholder="所有年级" @change="findItem">
            <el-option value=''>所有年级</el-option>
            <el-option
              v-for="(item,index)  in gradeData"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <el-table :data="list" fit highlight-current-row style="width: 100%;" ref="editTable">
        <el-table-column  prop="className" label="班级名称" min-width="300" show-overflow-tooltip></el-table-column>
        <el-table-column  prop="gradeName" label="年级" min-width="240"></el-table-column>
        <el-table-column  label="操作" width="120">
          <template slot-scope="scope">
            <a href='javascript:;' class ="el-button--text" @click.stop="reviseClass(scope.row)">修改</a>
            <a href='javascript:;' class ="el-button--text" @click.stop="delClass(scope.row)">删除</a>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="!listLoading" class="pagination-container">
        <Pagination :pages="pages" :searchData="searchData" @getTableData="getList"></Pagination>
      </div>
      <el-dialog title="修改班级" :visible.sync="dialogRevise" width="30%" :modal-append-to-body="false">
        <el-form :model="reviseFormData" ref="reviseFormData" :rules="rulesChange">
          <el-form-item label="年级" :label-width="formLabelWidth" prop="year">
            <el-select v-model="reviseFormData.year" placeholder="选择年级" class="width100">
              <el-option
                v-for="(item,index)  in gradeData"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="班级名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="reviseFormData.name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogRevise = false">取 消</el-button>
          <el-button type="primary" @click="_reviseClass">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog :title='addTitle' :visible.sync="dialogAdd" width="30%" :modal-append-to-body="false">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="单个增加" name="first">
            <div>
              <el-form :model="addFormData" ref="addFormData" :rules="rulesChange">
                <el-form-item label="所属年级" :label-width="formLabelWidth" prop="year">
                  <el-select v-model="addFormData.year" placeholder="选择年级" class="width100">
                    <el-option
                      v-for="(item,index)  in gradeData"
                      :key="index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="班级名称" :label-width="formLabelWidth" prop="name">
                  <el-input v-model="addFormData.name"></el-input>
                </el-form-item>
             </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="批量增加" name="second">
            <div>
              <el-form :model="addMoreFormData" ref="addMoreFormData" :rules="rules2">
                <el-form-item label="所属年级" :label-width="formLabelWidth" prop="grade">
                  <el-select v-model="addMoreFormData.grade" placeholder="选择年级" class="width100">
                    <el-option
                      v-for="(item,index)  in gradeData"
                      :key="index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="名词前缀" :label-width="formLabelWidth" prop="namePrefix">
                  <el-input :maxlength="10" v-model="addMoreFormData.namePrefix"></el-input>
                </el-form-item>
                <el-form-item label="起止编号" :label-width="formLabelWidth" required>
                  <el-row :span="24">
                    <el-col :span="10">
                      <el-form-item prop="startIndex">
                        <el-input :maxlength="5" v-model="addMoreFormData.startIndex"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4" class="text-center">
                      <span>-</span>
                    </el-col>
                    <el-col :span="10">
                      <el-form-item prop="endIndex">
                        <el-input :maxlength="5" v-model="addMoreFormData.endIndex" prop="endIndex"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="名词后缀" :label-width="formLabelWidth" prop="nameSuffix">
                  <el-input :maxlength="10" v-model="addMoreFormData.nameSuffix"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAdd = false">取 消</el-button>
          <el-button v-if="activeName=='second'" type="primary" @click="addMoreClass">确 定</el-button>
          <el-button v-if="activeName=='first'" type="primary" @click="_addClass">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { getClass, deleteClass, reviseClass, addClass, addMoreClass, addManyClass, deleteClassTrue } from 'api/manageCenter';
    import { getGrade } from 'api/common';
    import {deleteLastClass} from 'api/count';
    import {scrollTable} from 'utils/index';
    import Pagination from 'views/components/page/pagination';
    export default {
      name: 'classManage',
      components: { Pagination},
      props:{
        isLead:{
          type: Boolean,
          default: false
        }
      },
      data() {
        return {
          activeName:'first',
          listLoading: false,
          list: null,
          pages:{
            total:1,
            sizes:[10,20,30, 50]
          },
          searchData:{
            page: 1,
            size: 50,
            grade: '',
            className:''
          },
          orderTitle:'修改教室',
          dialogRevise:false,
          dialogAdd:false,
          reviseFormData:{
            year:'',
            name:''
          },
          loading:false,
          rulesChange:{
            year: [
              { required: true, message: '请选择年级', trigger: 'change' }
            ],
            name: [
              { required: true, message: '请输入班级名称', trigger: 'blur' },
              { max: 21, message: '班级名称输入过长', trigger: 'blur' }
            ]
          },
          rules2:{
            grade: [
              { required: true, message: '请选择年级', trigger: 'change' }
            ],
            namePrefix: [
              { max: 10, message: '名词前缀输入超出长度', trigger: 'blur' }
            ],
            endIndex: [
              { max: 10, message: '名词后缀输入超出长度', trigger: 'blur' }
            ],
            startIndex: [
              { validator:(rule,value,callback)=>{
                if(/^\d+$/.test(value) == false){
                    callback(new Error("只能输入数字"));
                }else if(value>999){
                  callback(new Error("不得超过999"));
                }else{
                    callback();
                }
              }, trigger:'blur'}
            ],
            endIndex: [
              { validator:(rule,value,callback)=>{
                if(/^\d+$/.test(value) == false){
                    callback(new Error("只能输入数字"));
                }else if(value>999){
                  callback(new Error("不得超过999"));
                }else{
                    callback();
                }
              }, trigger:'blur'}
            ]
          },
          isAdd:'1',
          addFormData:{
            add:'1',
            year:'',
            name:''
          },
          addMoreFormData:{
            grade:'',
            namePrefix:'',
            startIndex:'',
            endIndex:'',
            nameSuffix:''
          },
          formLabelWidth:'72px',
          addTitle:'新增班级'
        }
      },
      computed: {
        ...mapGetters([
          'gradeData'
        ])
      },
      methods: {
        getList() { // 获取表格数据
          this.listLoading = true;
          getClass(this.searchData).then(res => {
            this.list = res.data;
            this.pages.total = res.total;
            if(this.pages.total > this.searchData.size){
              this.listLoading = false;
            }
          }).catch(err => {
            this.listLoading = false;
          });
        },
        handleClick() {},
        findItem () { //搜索操作
          this.searchData.page = 1;
          this.getList();
        },
        reviseClass (row) {
          this.dialogRevise = true;
          this.reviseFormData.year = row.grade;
          this.reviseFormData.name = row.className;
          this.reviseFormData.amount = row.amount;
          this.reviseFormData.classId = row.classId;
        },
        _reviseClass() {
          this.$refs['reviseFormData'].validate((valid) => {
            if (valid) {
              reviseClass(this.reviseFormData).then(res => {
                this.dialogRevise = false;
                this.getList();
                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
              });
            } else {
              return false;
            }
          });
        },

        addClass () {
          this.dialogAdd = true;
          this.isAdd = '1';
          //this.$refs['addFormData'].resetFields();
          //this.$refs['addMoreFormData'].resetFields();
          this.addFormData = {
            add:'1',
            year:'',
            name:'',
            amount:''
          };
          this.addMoreFormData = {
            grade:'',
            namePrefix:'',
            startIndex:'',
            endIndex:'',
            nameSuffix:''
          }
        },
        _addClass () {
          this.$refs['addFormData'].validate((valid) => {
            if (valid) {
              addClass(this.addFormData).then(res => {
                this.dialogAdd = false;
                this.getList();
                this.$message({
                  message: '新增成功',
                  type: 'success'
                });
              });
            } else {
              return false;
            }
          });
        },
        addMoreClass () {
          if(this.loading){
            return;
          }
          this.$refs['addMoreFormData'].validate((valid) => {
            if (valid) {
              var i,classArray=[];
              var amountAll = Number(this.addMoreFormData.endIndex) - Number(this.addMoreFormData.startIndex);
              console.log(this.addMoreFormData.endIndex.length);
              if(this.addMoreFormData.startIndex.length > this.addMoreFormData.endIndex.length){
                this.$message({
                  message: '起止编号的位数不正确',
                  type: 'warning'
                });
                return;
              }
              if((this.addMoreFormData.startIndex[0] == '0') && (this.addMoreFormData.startIndex.length != this.addMoreFormData.endIndex.length)) {
                this.$message({
                  message: '起止编号位数不正确',
                  type: 'warning'
                });
                return;
              }
              if(amountAll>49){
                this.$message({
                  message: '一次最多增加50个班级',
                  type: 'warning'
                });
                return;
              }
              if(amountAll<0) {
                this.$message({
                  message: '编号大小不正确',
                  type: 'warning'
                });
                return;
              }
              this.loading = true;
              addManyClass(this.addMoreFormData).then(res => {
                this.dialogAdd = false;
                this.getList();
                this.$message({
                  message: '新增成功',
                  type: 'success'
                });
                this.loading = false;
              }).catch(err => {
                this.loading = false;
              });
            } else {
              return false;
            }
          });
        },
        delClass (row) { //删除操作
          this.$confirm('你确认要删除['+row.className+']班级吗', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteClass(row).then(res => {
              let cnt = '';
              if(res && (res === 'true' || res === true)){
                this.getList();
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }else{
                cnt = '该班级已';
                if(res){
                  if(res.bookingCount > 0){
                    cnt += '有日志预约' + res.bookingCount + '条,'
                  }
                  if(res.arrangeCount > 0){
                    cnt += '有日志安排' + res.arrangeCount + '条,'
                  }
                  if(res.finishedCount > 0){
                    cnt += '有登记日志' + res.finishedCount + '条,'
                  }
                  if(res.staffCount > 0){
                    cnt += '关联了' + res.staffCount + '位老师'
                  }
                }
                this.$confirm(cnt + ',确认删除将清除以上数据并不可恢复','提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  deleteClassTrue(row).then(res => {
                    if (res) {
                      this.getList();
                      this.$message({
                        type: 'success',
                        message: '删除成功!'
                      });
                    } else {
                      this.$message.error('删除失败!');
                    }
                    
                  }).catch(error => {
                    this.$message.error('删除失败!');
                  })
                });
              }
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
      },
      created() {
        this.$store.dispatch('GetGrade');
        this.getList();
      },
      mounted(){
        scrollTable(".classManage");
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
