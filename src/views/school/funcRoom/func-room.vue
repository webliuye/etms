<template>
  <master-page title="功能室使用">
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="功能室使用登记" name="first">
          <div class="dashboard-container">
            <div class="search-select" >
                <div class="fr">
                  <el-date-picker v-model="theDay" type="date" placeholder="选择日期" :clearable="false" :picker-options="pickerOptions0" @change="reGet()"></el-date-picker>
                </div>
             </div>
              <template>
                <table  class="el-table" cellspacing="0" cellpadding="0"  style="text-align:center;width:100%; margin-top:8px;"  >
                  <thead>
                    <tr  >
                      <th style="text-align:left;padding:0 8px;">功能室</th>
                      <th>第一节课</th>
                      <th>第二节课</th>
                      <th>第三节课</th>
                      <th>第四节课</th>
                      <th>第五节课</th>
                      <th>第六节课</th>
                      <th>第七节课</th>
                      <th>第八节课</th>
                    </tr>
                  </thead>
                  <tr v-for="(item,index) in dataList" :key="index">
                    <td class="firstTd"  style="text-align:left;padding:0 8px;">{{item.roomName}}</td>
                    <td v-for="( ite , index1 ) in item.multiroomRecordDetailVos" v-if="ite.allowUpdate" :key="ite.value"  width="'10%'" class="allowTd">
                      <p>{{ite.uage}}</p>
                      <i class="el-button--text el-icon-delete" @click="handleDelete(ite.id)"></i>
                    </td>
                    <td class="notTd" v-else-if="ite.createBy" :key="ite.value" width="'10%'" :title="`【${ite.staffName}】  ${ite.uage}`" >
                      <p>【{{ite.staffName}}】&nbsp;&nbsp;{{ite.uage}}</p>
                    </td>
                    <td v-else :key="ite.value" @click="check(index,index1)" width="'10%'" class="emptyTd">
                    </td>
                  </tr>
                  <tr v-if="!dataList||dataList.length==0">
                    <td colspan="9" style="padding:0 24px;color:#666;text-align:center">您的学校还没有设置功能室，请管理员前往【管理中心/教室管理】设置
                    </td>
                  </tr>
                </table>
              </template>
              <el-dialog :title="roomName" :visible.sync="dialogFormVisible" width="30%" :modal-append-to-body="false">
                <template>
                  <el-form class="small-space" :model="theList" :rules="rules" ref="theList" label-width="72px">
                    <el-form-item label="可使用" prop="checkList" required>
                      <el-checkbox-group v-model="theList.checkList" class="manyClass">
                        <el-checkbox v-for="( item , index) in theList.sectionList" v-if="!item.id" :key="index" :label="item.classTimes" :value="item.classTimes">第{{item.classTimes}}节课</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="使用用途" prop="uage" required>
                      <el-input type="textarea" v-model="theList.uage" placeholder="不超过50个字符"></el-input>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer" align="center">
                    <el-button type="primary" :loading="loading" @click="submit()">确 定</el-button>
                    <el-button @click="resetForm()">取 消</el-button>
                  </div>
                </template>
              </el-dialog>
           </div>
        </el-tab-pane>
        <el-tab-pane label="我的登记记录" name="second">
          <div class="dashboard-container">
            <div class="search-select">
                  <!-- <div class="fr">
                    <el-button icon="el-icon-search" @click="getList"></el-button>
                  </div> -->
                  <div class="fr selectwidth1">
                    <el-select v-model="listQuery.type" clearable placeholder="请选择教室" @change="getList">
                      <el-option v-if="item.value != 1" v-for="(item,index)  in classRoomList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </div>
                  <div class="fr selectwidth">
                    <YearSelect @changeYear="changeYear"></YearSelect>
                  </div>
            </div>
            <template>
              <el-table :data="tableData"  style="width: 100%">
                <el-table-column prop="classRoomName" min-width="200" label="教室名称" show-overflow-tooltip >
                </el-table-column>
                <el-table-column prop="staffName" min-width="160" label="使用人"  show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="useDate" min-width="120"  label="使用时间" >
                </el-table-column>
                <el-table-column prop="uage"  label="使用用途"  min-width="100" show-overflow-tooltip>
                </el-table-column>
                <el-table-column  label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button @click=" handleList('deleted',scope.row)" type="text" >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div v-show="!listLoading" class="pagination-container">
                <Pagination :pages="pages" :searchData="listQuery" @getTableData="getList"></Pagination>
                <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                :page-sizes="pages.sizes" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="pages.total">
                </el-pagination> -->
              </div>

            </template>

          </div>
        </el-tab-pane>
    </el-tabs>

  </master-page>
</template>
<script>

  import MasterPage from '../../layout/MasterPage';
  import YearSelect from 'views/components/srcSelect/yearSelect';
  import { getYear, getMineYear, getClassRooms, getClassTime } from 'api/common';
  import { getFuncRoomList, getMultiRoom, deleteFuncRoom, addFuncRoom, updateFuncRoom, getDayFunclist } from 'api/funcRoom';
  import Pagination from 'views/components/page/pagination';
  // import {  getInfo } from 'api/manageCenter';
  export default {
    components: {
        MasterPage,YearSelect, Pagination
    },
    data() {
      return {
        // roleType: this.$store.state.user.userInfo.name == '授课老师' ? true : false, // 角色是否授课老师
        activeName: 'first',
        classRoomList:[],
        listLoading: false,
        list: null,
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        roomName:'',
        theList:{
          sectionList:{},
          checkList:[],
          uage:''
        },
        oldCheckList:[],
        newCheckList:[],
        row:'',
        teacherName:'',
        tableData:[],
        theDay:'',
        listQuery: {
          endyear:'',
          startyear:'',
          type:'',
          year:'',
          page: 1,
          size: 50
        },
        //  功能室参考数据结构
        dataList:[],
        name:this.$store.state.user.userInfo.name,
        pages:{
          total:1,
          sizes:[10,20,30, 50]
        },
        searchData:{
          size:10,
          page:1
        } ,
        editState:'',
        loading: false,
        dialogFormVisible: false,
        classRoom:[],
        DayQuery:{
          day:''
        },
        aptClassTime:[],
        subData:{
          classTime: [],
          classTimes:'',
          id: "",
          roomId: "",
          uage: "",
          useDate: ""
        },
        formData:{
          useDate:null,
          roomId:'',
          uage:'',
          classTimes:[]
        },
        rules: {
         checkList: [
            { type:'array',required: true, message: '请选择上课节次', trigger: 'change' }
          ],
         uage:[
            {type:'string',required:true, min: 0, max: 50, message: '必填，且不超过50个字符', trigger: 'change' }
          ]
        }
      }
    },
    created() {
      this.theDay=Date.now();
      this.getDaylist();
      this.getFormData();

    },
    mounted() {
    },
    methods: {
      // getMyInfo(){
      //   getInfo().then(res => {
      //     this.teacherName= res.name;});
      // },
      reGet(){
        this.theDay=Date.parse(this.theDay);
        this.DayQuery.day=this.theDay;
        getDayFunclist(this.DayQuery).then(res=>{
            this.dataList=res;
        });
      },
      getDaylist(){
        this.DayQuery.day=this.theDay;
        getDayFunclist(this.DayQuery).then(res=>{
            this.dataList=res;
        });

      },
      handleDelete(Data){

          this.$confirm('你确定要删除这个预约?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteFuncRoom(Data).then(response => {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.getList();
              if(Date.parse(this.theDay)){
                this.reGet()
              }else{
                  this.getDaylist();
              }

            });
          });

        } ,
      handleClick(tab, event) {
        if(Date.parse(this.theDay)){
                this.reGet()
              }else{
                  this.getDaylist();
              }
        this.getList();
      },
      check(index,index1) {
        this.roomName=this.dataList[index].roomName+"功能室";
        this.dialogFormVisible=true;
        var that=this;
        this.row=index;
        this.theList.sectionList=this.dataList[index].multiroomRecordDetailVos;
        this.dataList[index].multiroomRecordDetailVos.forEach(function(item, index){
          if(item.id){
              that.oldCheckList.push(String(index+1));
          }
        });
        this.theList.checkList=[(index1+1)+''];
      },
      submit(){
         this.$refs['theList'].validate((valid) => {
          if (valid) {
             var a = this.theList.checkList;
             var b = this.oldCheckList;
             var c = [];
             var index = 0;
             var that = this;
             if (b.length) {
               for (var i = 0; i < a.length; i++) {
                 for (var j = 0, t = 0; j < b.length; j++) {
                   if (a[i] == b[j]) {
                     t++;
                   }
                 }
                 if (t == 0) {
                   c[index++] = a[i];
                 }
               };
             } else {
               c = a;
             };
             this.subData.classTimes = c.join();
             this.subData.uage = this.theList.uage;
             this.subData.id = '';
             this.subData.roomId = this.dataList[this.row].roomId;
             this.subData.useDate = this.theDay;
             this.theList.checkList = [];
             this.oldCheckList = [];

             addFuncRoom(this.subData).then(response => {
               this.loading = false;
               this.$message({
                 message: '操作成功！',
                 type: 'success'
               })

               this.getDaylist();

               this.resetForm();

             });


          } else {
            console.log('error submit!!');
            return false;
          }
        });

      }
      ,
      getFormData () {
        getClassRooms().then(response => {
          this.classRoomList = response;
        });
        //获取节次列表
        getClassTime().then(response => {
          this.aptClassTime = response;
        });
      },
      getList() { // 获取表格数据
        this.listQuery.startyear = this.listQuery.year.slice(0,4);
        this.listQuery.endyear = this.listQuery.year.slice(5);
        this.listLoading = true;
        getFuncRoomList(this.listQuery).then(response => {
          this.tableData = response.data;
          this.pages.total = response.total;
          if(this.listQuery.size<this.pages.total){
             this.listLoading = false;
          }
        }).catch(err => {
          this.listLoading = false;
        });
      },
      changeYear(year){
        this.listQuery.year = year;
        this.getList();
      },
      // handleSizeChange(val) { // 显示多少页
      //   this.listQuery.size = val;
      //   this.getList();
      // },
      // handleCurrentChange(val) {  // 点击页数
      //   this.listQuery.page = val;
      //   this.getList();
      // },
      handleList(text, rowData){
        if(text==="deleted"){
          this.$confirm('你确定要删除['+rowData.classRoomName+']记录?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteFuncRoom(rowData.id).then(response => {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.getList();
            });
          });

        } else {
          this.editState = text;
          if(text==="edit"){
            this.formData = {
              useDate:new Date(rowData.useDate),
              classTimes:rowData.classTimes,
              roomId:rowData.classRoomId,
              uage:rowData.uage,
              id:rowData.id
            }
          } else {
            this.formData = {
              useDate:new Date(),
              classTimes:this.aptClassTime[0].value,
              roomId:'',
              uage:''
            }
          }
          this.getArea();
          this.dialogFormVisible = true;
        }
      },
      getArea () {
        const obj = {
          'useDate':this.formData.useDate,
          'useTimes':this.formData.classTimes
        }
        getMultiRoom(obj).then(response => {
          this.classRoom = response;
        });
      },
      resetForm(){
        this.dialogFormVisible = false;
        this.$refs['theList'].resetFields();
         this.oldCheckList=[];
         this.theList.checkList=[];
         this.theList.uage='';
      }
    }
  }
</script>
<style lang="less" scoped>
// .el-tabs{
//   position: absolute;
//   top:0;
//   left:0;
//   width:100%;
// }
// .dashboard-container{
//   padding:16px 24px 24px;
// }
th{
  text-align: center;
  border-right: 1px solid rgb(223, 230, 236);
  border-collapse: collapse;
}
th:first-child {
  border-left: 1px solid rgb(223, 230, 236);
}
td:first-child {
  border-left: 1px solid rgb(223, 230, 236);
}
.manyClass label.el-checkbox {
  margin-left: 0;
  margin-right: 15px;
  font-weight: 500;
}
table{
  border-collapse: separate;
  border:none;
  border-top:1px solid rgb(223, 230, 236);
}
td{
  width:150px;
  overflow:hidden;
  border-right:1px solid rgb(223, 230, 236);
  border-top:1px solid rgb(223, 230, 236);
  text-overflow:ellipsis;
  position: relative;
  height:48px;
  text-align: left;
  border-collapse: collapse;
  &.allowTd {
    background:#C1FFC1;
    color:green;
    overflow:hidden;
  }
  &.notTd {
    background:#a0cfff;
    color:#fff;
    overflow:hidden;
    cursor: not-allowed;
  }
  &.emptyTd {
    cursor: pointer;
  }
  &.emptyTd:hover {
    background: #EEE5DE;
  }
  p{
      height:48px;
      box-sizing: border-box;
      text-overflow:ellipsis;
      overflow:hidden;
      line-height:40px;
      padding:5px;
      margin:0;
      width:100%;
  }
  i{

  position: absolute;;
  top:5px;
  right:-6px;
  opacity: 0;
  cursor: pointer;

  }
  &:hover i{
      opacity:1;
  }
}
.firstTd{
  min-width:150px;
    &:hover {
      background: #fff;
    }

}
</style>
