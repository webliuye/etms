<template>
  <master-page title="上传实验日志">
    <div class="afour">
      <div class="logpic"><img  src="../../../assets/img/logpic.png" ></img></div>
      <h2 style="text-align:center">实验预约登记单</h2>
      <div class="formBox">
        <el-form :model="formData" :rules="rules" ref="formData">
          <el-row >
            <el-col :span="4" style="border-right:transparent;border-bottom:transparent;">
              <div class="grid-content grid-head">实验名称</div>
            </el-col>
            <el-col :span="12" style="border-right:transparent;border-bottom:transparent;">
              <div class="grid-content">{{formData.name}}</div>
            </el-col>
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;">
              <div class="grid-content grid-head">实验类型</div>
            </el-col>
            <el-col :span="4"  style="border-bottom:transparent;">
              <div class="grid-content">{{formData.type}}</div>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;">
              <div class="grid-content grid-head">上课时间</div>
            </el-col>
            <el-col :span="12"  style="border-right:transparent;border-bottom:transparent;height:40px;overflow:hidden;">
              <div class="grid-content heigth40" style="padding:0 8px;">
                <el-date-picker type="date" v-model="formData.classDate1" placeholder="选择日期" :picker-options="pickerOptions0" class="login-form-input" @change="dataChange"></el-date-picker>
              </div>
            </el-col>
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;">
              <div class="grid-content grid-head">选择节次</div>
            </el-col>
            <el-col :span="4"  style="border-bottom:transparent;height:40px;overflow:hidden;">
              <ClassTimeSelect :classTime="formData.classTime" @changeClassTime="changeClassTime"></ClassTimeSelect>
            </el-col>
          </el-row>
           <el-row >
            <el-col :span="4" style="border-right:transparent;border-bottom:transparent;">
              <div class="grid-content grid-head" style="line-height:40px;">上课班级</div>
            </el-col>
            <el-col :span="20" style="border-bottom:transparent;">
              <div class="grid-content" width="100%" style="height:40px;overflow:auto;">
                  <el-checkbox-group v-if="classData.length"  v-model="formData.classIds" class="manyClass">
                    <el-checkbox v-for="(item,index)  in classData" :key="index" :value="item.classId" :label="item.classId">{{item.className}}</el-checkbox>
                  </el-checkbox-group>
                   <span v-else v-for="(item,index)  in formData.classNames" :key="index" >{{item}}</span>
              </div>
            </el-col>
            </el-row>
            <el-row>
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;"> <div class="grid-content grid-head"><span class="start-span">*</span>上课地点</div></el-col>
            <el-col :span="8"   style="border-right:transparent;border-bottom:transparent;height:40px;overflow:hidden;">
              <template  prop="classRoomId">
                <el-select v-model="formData.classRoomId" placeholder="请选择教室">
                  <el-option-group label="未占用">
                    <el-option v-for="(item,index)  in classRoom" v-if="item.state=='0'" :key="index" :label="item.classRoomName" :value="item.classRoomId"></el-option>
                  </el-option-group>
                  <el-option-group label="已占用">
                    <el-option v-for="(item,index)  in classRoom" v-if="item.state=='1'" :disabled="true" :key="index" :label="item.classRoomName" :value="item.classRoomId"></el-option>
                  </el-option-group>
                </el-select>
              </template>
            </el-col>
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;">
              <div class="grid-content grid-head">分组数</div>
            </el-col>
            <el-col :span="8"  style="border-bottom:transparent; height:40px; overflow:hidden;">
              <el-input type='number' v-model="formData.groupNumber" :min="1" placeholder="" @change="changeGroup"></el-input>
            </el-col>
          </el-row>
           <el-row >
             <el-col :span="24"  style="border-bottom:transparent;">
                <EquipmentData :equipmentData="equipmentData" :groupNumber="Number(formData.groupNumber)" @changeEquipment="changeEquipment"></EquipmentData>
             </el-col>
          </el-row>
          <el-row >
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;">
              <div class="grid-content grid-head" style="line-height:80px;">实验材料</div>
            </el-col>
            <el-col :span="20"  style="border-bottom:transparent;">
              <div class="grid-content" style="height:80px;overflow:hidden;padding:0;">
                <!-- <span>{{formData.material}}</span> -->
                <el-input type="textarea" :rows="4" placeholder="" v-model="formData.material"> </el-input>
              </div>
            </el-col>
          </el-row>
           <el-row >
             <el-col :span="4"  style="border-right:transparent;">
              <div class="grid-content grid-head" style="height:80px;line-height:80px;">预约说明</div>
             </el-col>
             <el-col :span="20" >
               <div class="grid-content" style="height:80px;overflow:hidden;padding:0;word-wrap:break-word; white-space:normal; word-break:break-all;line-height:20px;">
                 <el-input type="textarea" :rows="12" :maxlength="100" placeholder="请输入预约说明内容(100字以内)" v-model="formData.description"> </el-input>
               </div>
             </el-col>
          </el-row>
            <div class="text-right" style="margin-top:32px;margin-bottom:32px;">
              <el-button type="primary" @click="submitForm">确定</el-button>
              <el-button type="primary" @click="cancel">取消</el-button>
            </div>
        </el-form>
      </div>
    </div>
  </master-page>
</template>

<script>
  import MasterPage from '../../layout/MasterPage';
  import ClassTimeSelect from 'views/components/select/classTimeSelect';
  import { getClassInfos, getMyBookingInfo, myBookingInfo } from 'api/booking';
  import { reviseGetLogInfo, reviseBookingInfo } from 'api/index';
  import { getUseArea } from 'api/arrange';
  import EquipmentData from 'views/components/equipmentData';
  import { mapGetters } from 'vuex';
  import { parseTime } from '../../../filters';
  export default {
    components: {
         MasterPage, ClassTimeSelect,EquipmentData
    },
    data(){
      return {
        loading:true,
        classRoom:[],
        formData:{
          equipmentParams:[],
          equipmentList:null,
          classRoomId:null,
          classDate:'',
          classData:'',
          classDate1:'',
          description:'',
          classNames:'',
          equipment:'',
          classIds:'',
          material:'',
          courseId:null,
          groupNumber:1,
          classTime:'1',
          name:'',
          type:'分组实验',
          subjectId:''
        },
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        changeBoolean:{},
        planDetail:{},
        equipmentList:null,
        equipmentData:[],
        isBooking:true,
        row:{},
        classData:{},
        rules:{
          classDate1: [
            {type: 'date', required: true, message: '请选择时间', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      ...mapGetters([
        //是否与装备打通
        'systemBlean'
      ])
    },
    created() {
      this.$store.dispatch('GetEquipSys');
      //没有ID时返回上个页面
      if(this.$route.params.id===undefined){
        this.$router.go(-1);
      }
      this.formData.courseId = this.$route.params.id;
      this.changeBoolean = this.$store.state.commonData.changeBool;
      reviseGetLogInfo(this.formData.courseId).then(res => {
        this.formData.classDate1 = new Date(res.classDate);
        this.formData.classTime = res.classTime;
        this.formData.classNames=res.classNames;
        this.equipmentData = res.equipmentList;
        this.formData.description = res.description;
        this.formData.material = res.material;
        this.classData = res.courseClassFormVoList;
        this.formData.classIds = res.classIds;
        this.formData.name = res.name;
        this.formData.groupNumber = res.groupNumber;
        this.formData.classRoomId = res.classRoomId;
        this.formData.subjectId = res.subjectId;
        this.formData.courseId = res.courseId;
        this.getArea();
      });
    },
    methods: {
      changeClassTime(classTime){
        this.formData.classTime = classTime;
        this.formData.classRoomId = '';
        this.getArea();
      },
      changeEquipment(val) {
        this.equipmentList = val;
      },
      cancel() {
        this.$router.go(-1);
      },
      getArea () {
        this.formData.classDate = parseTime(this.formData.classDate1,'{y}-{m}-{d}');
        getUseArea({'classdate': this.formData.classDate,'classtime':this.formData.classTime, subjectId:this.formData.subjectId,courseId:this.formData.courseId}).then(response => {
          this.classRoom = response;
        });
      },
      changeGroup() {
        if(this.formData.groupNumber > 99 || this.formData.groupNumber < 1){
          this.$message({
            message: '分组数不能小于1大于99',
            type: 'warning'
          });
          this.formData.groupNumber = 1;
        }
      },
      submitForm(){
        if(!this.loading){
          return;
        }
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            if(this.formData.classIds.length == 0){
              this.$message({
                message: '请至少选择一个班级',
                type: 'warning'
              });
              return;
            }
            this.loading = false;
            this.formData.classDate = this.formData.classDate.toString();
            var vm = this;
            if(this.systemBlean){
              this.formData.equipmentParams = [];
              if(this.equipmentList && this.equipmentList.length > 0){
                for(let i=0;i<this.equipmentList.length;i++){
                  let items = this.equipmentList[i];
                  if(items.logsListList){
                    for(let j=0;j<items.logsListList.length;j++){
                      let equipmentItem = {};
                      equipmentItem.itemsCode = items.itemsCode;
                      equipmentItem.itemsName = items.itemsName;
                      let itemsSon = items.logsListList[j];
                      equipmentItem.take = itemsSon.take;
                      if(itemsSon.take * Number(vm.formData.groupNumber) > itemsSon.availQuantity){
                        this.$message({
                          message: '实拿数与分组数相乘不能大于库存数',
                          type: 'error'
                        });
                        vm.loading = true;
                        return;
                      }
                      equipmentItem.spec = itemsSon.spec;
                      equipmentItem.unit = itemsSon.uom;
                      equipmentItem.instrumentId = itemsSon.code;
                      equipmentItem.instrumentName = itemsSon.name;
                      if(equipmentItem.instrumentId){
                        this.formData.equipmentParams.push(equipmentItem);
                      }
                    }
                  }else{
                    this.formData.equipmentParams.push(items);
                  }
                }
              }else{
                this.formData.equipmentParams = null;
              }
              this.formData.equipmentList = this.formData.equipmentParams;
            }else{
              this.formData.equipmentParams = this.equipmentList;
              this.formData.equipmentList = this.formData.equipmentParams;
            }
            reviseBookingInfo(this.formData).then(res => {
              this.loading = true;
              this.changeBoolean.isPlan = false;
              this.changeBoolean.isBooking = true;
              this.$store.commit('SET_CHANGEBOOL',this.changeBoolean);
              this.$router.go(-1);
              this.$message({
                message: '修改成功',
                type: 'success'
              });
            }).catch(err => {
              this.loading = true;
            });
          }else{
            return false;
          }
        });
      },
      dataChange(val){
        this.formData.classDate = val;
        this.formData.classRoomId = '';
        this.getArea();
      }
    }
  }
</script>


<style lang="less" media="screen" scoped>
.el-col-4{
  width:120px;
}
.el-col-3{
  width:90px;
}
.el-col-6{
  width:180px;
}
.el-col-12{
  width:360px;
}
.el-col-24{
  width:720px;
}
.el-col-20{
  width:600px;
}


.manyClass label.el-checkbox {
  margin-left: 0;
  margin-right: 15px;
  font-weight: 500;
}
</style>
