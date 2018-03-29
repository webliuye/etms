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
              <div class="grid-content grid-head"><span class="start-span">*</span>上课时间</div>
            </el-col>
            <el-col :span="12"  style="border-right:transparent;border-bottom:transparent;" class="heigth40">
              <div class="grid-content heigth40" style="padding:0 8px;">
                <el-date-picker type="date" v-model="formData.classDate1" placeholder="选择日期" :picker-options="pickerOptions0" class="login-form-input" @change="dataChange"></el-date-picker>
              </div>
            </el-col>
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;">
              <div class="grid-content grid-head">选择节次</div>
            </el-col>
            <el-col :span="4"  style="border-bottom:transparent;" class="heigth40">
              <ClassTimeSelect :classTime="formData.classTime" @changeClassTime="changeClassTime"></ClassTimeSelect>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="4" style="border-right:transparent;border-bottom:transparent;">
              <div class="grid-content grid-head" style="line-height:40px;"><span class="start-span">*</span>上课班级</div>
            </el-col>
            <el-col :span="20" style="border-bottom:transparent;">
              <div class="grid-content" width="100%" style="height:40px;overflow:auto;">
                  <el-checkbox-group v-model="formData.classIdsAry" class="manyClass">
                    <el-checkbox v-for="(item,index)  in classData" :key="index" :value="item.classId" :label="item.classId">{{item.className}}</el-checkbox>
                  </el-checkbox-group>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;"> <div class="grid-content grid-head"><span class="start-span">*</span>上课地点</div></el-col>
            <el-col :span="12"   style="border-right:transparent;border-bottom:transparent;height:40px;overflow:hidden;">
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
              <div class="grid-content grid-head"><span class="start-span">*</span>分组数</div>
            </el-col>
            <el-col :span="4"  style="border-bottom:transparent; height:41px;">
              <el-input v-model="formData.groupNumber" :min="1" :max="99" type='number' placeholder="" required @change="changeGroup"></el-input>
            </el-col>
          </el-row>
           <el-row >
             <el-col :span="24"  style="border-bottom:transparent;">
                <EquipmentData :equipmentData="equipmentData"  :groupNumber="Number(formData.groupNumber)" @changeEquipment="changeEquipment"></EquipmentData>
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
              <div class="grid-content grid-head" style="line-height:80px;">预约说明</div>
             </el-col>
             <el-col :span="20" >
               <div class="grid-content" style="height:80px;overflow:hidden;padding:0;word-wrap:break-word; white-space:normal; word-break:break-all;line-height:20px;">
                 <el-input type="textarea" :rows="4" :maxlength="100" placeholder="请输入预约说明内容(100字以内)" v-model="formData.description"></el-input>
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
        formData:{
          classIdsAry:[],
          equipmentParams:[],
          classDate:'',
          classDate1: new Date(),
          description:'',
          classRoomId:null,
          equipment:'',
          classIds:'',
          material:'',
          groupNumber:1,
          name:'',
          subjectId:'',
          type:'分组实验'
        },
        catalogueId:'',
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        planDetail:{},
        equipmentList:null,
        equipmentData:[],
        classData:[],
        isBooking:true,
        row:{},
        changeBoolean:{},
        classRoom:[],
        rules:{
          classIdsAry: [
            { type: 'array',required: true, message: '请至少选择一个班级', trigger: 'blur'}
          ],
          classDate1: [
            {type: 'date', required: true, message: '请选择时间', trigger: 'blur' }
          ],
          classTime: [
            { required: true, message: '请选择节次', trigger: 'blur' }
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
      //刷新页面时返回上个页面
      this.row = this.$route.params.row;
      if(!this.row){
        this.$router.go(-1);
      }
      this.changeBoolean = this.$store.state.commonData.changeBool;
      //解析班级数据
      if(this.row.classInfoList && this.row.classInfoList.length > 0){
        this.classData = this.row.classInfoList;
      }
      if(this.classData.length > 0){
        this.formData.classIdsAry.push(this.classData[0].classId);
      }
      this.formData.planDetailId = this.$route.params.id;
      this.formData.name = this.$route.params.id.planDetailName;
      this.formData.classTime = '1';
      // this.formData.material = this.row.material;
      //获取表格数据
      getMyBookingInfo({planDetailId:this.formData.planDetailId}).then(res => {
        if(!res){
          this.$message({
            message: '装备没有仪器数据',
            type: 'warning'
          });
        }else{
          // res.equipmentListsList.forEach(function(item){
          //   item.take = 1;
          // });

          this.equipmentData = res.equipmentListsList;
          this.planDetail = res.planDetail;
          this.formData.name = res.planDetail.name;
          this.formData.material = res.planDetail.material;
          this.formData.subjectId = res.planDetail.subject;
          this.formData.type = [' ',"分组实验","演示实验"][res.planDetail.type];
          this.getArea();
        }
      });
    },
    methods: {
      changeClassTime(classTime){
        this.formData.classTime = classTime;
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
        getUseArea({'classdate': this.formData.classDate,'classtime':this.formData.classTime, subjectId:this.formData.subjectId}).then(response => {
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
            this.formData.classIds = this.formData.classIdsAry;
            if(this.formData.classIds.length == 0){
              this.$message({
                message: '请至少选择一个班级',
                type: 'warning'
              });
              return;
            }
            if(!(+new Date(this.formData.classDate))){
              this.$message({
                message: '请选择上课时间',
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
                console.log(this.equipmentList);
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
                      if(!itemsSon.spec){
                        continue;
                      }
                      equipmentItem.spec = itemsSon.spec;
                      equipmentItem.availQuantity = itemsSon.availQuantity;
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
            }else{
              this.formData.equipmentParams = this.equipmentList;
            }
            myBookingInfo(this.formData).then(res => {
              this.loading = true;
              this.changeBoolean.isPlan = false;
              this.changeBoolean.isBooking = true;
              this.$store.commit('SET_CHANGEBOOL',this.changeBoolean);
              if(this.$store.state.commonData.powerSource){
                this.$router.push({ name: 'BookingSuccess',  params: {id: this.planDetail.catalogueId,bName:this.formData.name}});
              }else{
                this.$router.go(-1);
              }
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
