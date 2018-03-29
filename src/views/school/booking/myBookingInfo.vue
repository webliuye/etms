<template>
  <master-page title="上传实验日志">
    <div class="afour">
      <div class="logpic"><img  src="../../../assets/img/logpic.png" ></img></div>
      <h2 style="text-align:center">实验预约登记单</h2>
      <div class="formBox">
        <el-form :model="formData.logForm" :rules="rules" ref="formData"  >
          <el-row >
            <el-col :span="4" style="border-right:transparent;border-bottom:transparent;"><div class="grid-content">实验名称</div></el-col>
            <el-col :span="12" style="border-right:transparent;border-bottom:transparent;"> <div class="grid-content">常见实验操作</div></el-col>
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;"> <div class="grid-content">实验类型</div></el-col>
            <el-col :span="4"  style="border-bottom:transparent;"> <div class="grid-content">分组实验</div></el-col>
          </el-row>
          <el-row >
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;"><div class="grid-content">上课时间</div></el-col>
            <el-col :span="12"  style="border-right:transparent;border-bottom:transparent;"> 
              <el-date-picker type="date" v-model="formData.courseForm.classDate" class="login-form-input"></el-date-picker>
            </el-col>
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;"> <div class="grid-content">上课节次</div></el-col>
            <el-col :span="4"  style="border-bottom:transparent;"> <div class="grid-content">第一节</div></el-col>
          </el-row>
           <el-row >
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;"><div class="grid-content">上课班级</div></el-col>
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;"> <div class="grid-content" width="100%">一年级一班</div></el-col>
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;"> <div class="grid-content">上课地点</div></el-col>
            <el-col :span="6"   style="border-right:transparent;border-bottom:transparent;"> 
              <el-select  v-model="formData.courseForm.classroomId" placeholder="">
                <el-option v-for="(item,index)  in classRoom" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
            <el-col :span="3"  style="border-right:transparent;border-bottom:transparent;"> <div class="grid-content">分组数</div></el-col>
            <el-col :span="3"  style="border-bottom:transparent;"> <el-input v-model="input" min="1" type='number' placeholder=""></el-input></el-col>
          </el-row>
           <el-row >
             <el-col :span="24"  style="border-bottom:transparent;"> 
                  <EquipmentData :equipmentData="equipmentData" :isLogBooking="isBooking" :isLog="true" @changeEquipment="changeEquipment"></EquipmentData>
             </el-col>
          </el-row>
          <el-row >
              <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;"> <div class="grid-content" style="line-height:160px;">实验材料</div></el-col>
               <el-col :span="20"  style="border-bottom:transparent;"> <div class="grid-content" style="height:160px;overflow:hidden;"><span v-text="showName.material"></span></div></el-col>
          </el-row>
           <el-row >
              <el-col :span="4"  style="border-right:transparent;"> <div class="grid-content" style="line-height:264px;">预约说明</div></el-col>
               <el-col :span="20" > 
                 <div class="grid-content" style="height:264px;overflow:hidden;padding:0;word-wrap:break-word; white-space:normal; word-break:break-all;line-height:20px;">
                   <el-input type="textarea" :rows="12" placeholder="" v-model="shuoming"> </el-input>
                 </div>
               </el-col>
          </el-row>         
            <div class="text-right" style="margin-top:32px;margin-bottom:32px;">              
              <el-button :loading="loading" type="primary" @click="submitForm">{{state == 3 ? "修改" : "登记"}}</el-button>
              <el-button @click="cancel">取消</el-button>
              <el-button v-if="state == 3" type="primary" @click="deletes">删除此条日志</el-button>
            </div>                
        </el-form> 
      </div>
    </div>
  </master-page>
</template>

<script>
  import MasterPage from '../../layout/MasterPage';
  import { getLogDetail, getStaffsMe, getLogPlanDetails, deleteLog, addLog, updateLog } from 'api/log';
  import { getStaffg } from 'api/common';
  import { getClassRoomList } from 'api/manageCenter';
  import { getEquipment, reviseEquipment } from 'api/booking';
  import EquipmentData from 'views/components/addEquipmentData';
  import { getEquipSys } from 'api/equipment';
  import store from 'store';
  import { mapGetters } from 'vuex';
  export default {   
    components: {
        MasterPage,
        EquipmentData
    },
    data(){
      return {
        urlHeaders:null, // 上传文件请求header
        urlAjax: null,   // 上传文件请求地址
        routeData:{},  //路由传过来的
        showName:{},  // 显示的数据
        classRoom:[],  // 实验地点
        teacherInform:[],  //实验员
        isDel: false, // 仪器表格最后一列是否可删除  
        formData:{
          courseForm: {
            classDate:null,
            arrangeId:null,
            classroomId:null
          },
          logForm: {
            equipmentFormList:[],
            photoFormList:[
              {description: "", fileurl: ""}, 
              {description: "", fileurl: ""}, 
              {description: "", fileurl: ""}
            ]
          }
        },
        equipmentList:null,
        equipmentData:[],
        loading: false,
        bookingState:null,
        id:null,
        isBooking:true,
        queryRoute:{
          planId: this.$route.query.planId,
          year: this.$route.query.year
        },
        rules: {
          result: [
            { required: true, message: '请输入实验完成情况', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      ...mapGetters([
        'systemBlean'
      ])
    },
    created() {
      this.$store.dispatch('GetEquipSys');
      this.initData();
    },
    methods: {
      initData(){
      },
      changeEquipment(val) {
        this.equipmentList = val;
      },
      submitForm(){
      
      }
    }
  }
</script>


<style lang="less" media="screen" scoped>
.afour{
  
  width:716px;
  height:925px;
  margin:0 auto;
  border: 1px solid #ccc;
   -webkit-box-shadow:1px  10px 10px 0 #999;
   -moz-box-shadow:1px  10px 10px 0 #999;
   box-shadow:1px 10px 10px 0 #999;
   font-family:SimSun;
   .logpic{
     position:relative;float:left;
     top:-15px;left:32px;

   }
   h2{
     font-size: 14px;
     margin:0;
     padding: 42px 0;
   }
  .formBox{
    width:624px;
    font-size:14px;
    margin:0 auto;
    padding-bottom:32px;
    .el-row{  
      
      .el-col {
        border: 1px solid #000;
        .grid-content{
          padding:0 8px;
        }
        line-height:40px;
        .el-date-editor.el-input {
          .el-input__inner{
             border:none!important;
          }
          width:100%;
          
        }
       
      }

    }
    
  }
}
* .el-input__inner {
        border: #fff !important;
        border-radius: 0px !important;
    }


  .line{ border-top:1px solid rgb(191, 203, 217); height: 0; margin: 20px 0; clear: both; }
  .marginT{ margin-top: 15px; }
  .el-table tr td { padding: 5px; }
  .avatar-uploader {    
    margin: 0 auto 10px;
    width: 80%;
    height: 150px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    overflow: hidden;
    position: relative;
    width: 100%;
    height: 100%;
  }
  .avatar-uploader .el-upload img {
    max-width: 100%;
    max-height: 100%;
  }
  .avatar-uploader .avatar-uploader-icon {
    color: #8c939d;
    font-size: 28px;
    width: 100%;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }

</style>
