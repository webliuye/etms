<template>
	<master-page title="安排信息">
    <div class="afour">
      <div class="logpic"><img  src="../../../assets/img/logpic.png" ></img></div>
      <h2 >实验安排单</h2>
      <div class="formBox">
        <el-form :model="formData" ref="formData"  >
          <el-row >
            <el-col :span="4" style="border-right:transparent;border-bottom:transparent;"><div class="grid-content grid-head">实验名称</div></el-col>
            <el-col :span="12" style="border-right:transparent;border-bottom:transparent;"> <div class="grid-content">{{formData.planDetailName}}</div></el-col>
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;"> <div class="grid-content grid-head">实验类型</div></el-col>
            <el-col :span="4"  style="border-bottom:transparent;"> <div class="grid-content">{{['','分组实验','演示实验'][formData.type]}}</div></el-col>
          </el-row>
          <el-row >
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;"><div class="grid-content grid-head">上课时间</div></el-col>
            <el-col :span="12"  style="border-right:transparent;border-bottom:transparent;">
               <div class="grid-content">{{formData.classDate}}</div>
            </el-col>
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;"> <div class="grid-content grid-head">上课节次</div></el-col>
            <el-col :span="4"  style="border-bottom:transparent;">
              <div class="grid-content">
                 <template >
                    第{{formData.classTime}}节课
                </template>
              </div>
            </el-col>
          </el-row>
           <el-row >
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;"><div class="grid-content grid-head">上课班级</div></el-col>
            <el-col :span="12"  style="border-right:transparent;border-bottom:transparent;">
              <div class="grid-content" width="100%">
                {{formData.classNames}}
              </div>
            </el-col>
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;">
              <div class="grid-content grid-head">分组数</div>
            </el-col>
            <el-col :span="4"  style="border-bottom:transparent; height:41px; overflow:hidden;">
              <el-input  min="1" type='number'  v-model="formData.groupNumber"  placeholder="" @change="changeGroup"></el-input>
            </el-col>
          </el-row>
           <el-row >
             <el-col :span="24"  style="border-bottom:transparent;">
                    <EquipmentData :equipmentData="equipmentData" :groupNumber="Number(formData.groupNumber)" @changeEquipment="changeEquipment"></EquipmentData>
             </el-col>
          </el-row>
          <el-row >
              <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;"> <div class="grid-content grid-head" style="line-height:80px;">实验材料</div></el-col>
               <el-col :span="20"  style="border-bottom:transparent;">
                 <div class="grid-content" style="height:80px;overflow:hidden;word-wrap:break-word; white-space:normal; word-break:break-all;line-height:20px;">
                    <span>{{formData.material}}</span>
                 </div>
                </el-col>
          </el-row>
           <el-row >
              <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;"> <div class="grid-content grid-head" >授课老师</div></el-col>
               <el-col :span="8"  style=" border-right:transparent;border-bottom:transparent;">
                 <div class="grid-content" >
                    <span>{{formData.tercherName}}</span>
                 </div>
                </el-col>
                <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;"> <div class="grid-content grid-head" >预约时间</div></el-col>
               <el-col :span="8"  style=" border-bottom:transparent;">
                 <div class="grid-content" >
                    <span>{{formData.bookingDate}}</span>
                 </div>
                </el-col>
          </el-row>
           <el-row >
              <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;">
               <div class="grid-content grid-head"  style="line-height:80px;">预约说明</div></el-col>
               <el-col :span="20" style=" border-bottom:transparent;">
                 <div class="grid-content"  style="height:80px;overflow:hidden;word-wrap:break-word; white-space:normal; word-break:break-all;line-height:20px; ">
                    {{formData.description}}
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
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;"> <div class="grid-content grid-head" ><span class="start-span">*</span>反馈结果</div></el-col>
               <el-col :span="8"  style=" border-bottom:transparent; height:40px;overflow:hidden;"  >
                  <el-select v-model="formData.state"  clearable placeholder="请选择反馈信息">
                     <el-option v-for="(item,index)  in feedbacks" :key="index" :label="item.label" :value="item.value" ></el-option>
                  </el-select>
               </el-col>
          </el-row>

          <el-row >
              <el-col :span="4"  style="border-right:transparent;"> <div class="grid-content grid-head" style="line-height:88px;">安排说明</div></el-col>
               <el-col :span="20"    >
                 <div class="grid-content" style="height:88px;overflow:auto;word-wrap:break-word; white-space:normal; word-break:break-all;line-height:22px; ">
                   <el-input type="textarea" :rows="4" :maxlength="100" placeholder="请输入安排说明内容(100字以内)" v-model="formData.feedback"> </el-input>
                 </div>
               </el-col>
          </el-row>
            <div class="text-right" style="margin-top:32px;margin-bottom:32px;">
              <el-form-item>
                <el-button type="primary" @click="submitForm">确定</el-button>
                <el-button type="primary" @click="cancel()">取消</el-button>
              </el-form-item>
            </div>
        </el-form>
      </div>
    </div>
		</div>
	</master-page>
</template>
<script>
	import MasterPage from 'views/layout/MasterPage';
	import ClassTimeSelect from 'views/components/select/classTimeSelect';
  import { reviseEquipment } from 'api/booking';
	import { getArrangeDetail, getUseArea, addArrange } from 'api/arrange';
  import { parseTime } from '../../../filters';
  import { mapGetters } from 'vuex';
  import EquipmentData from 'views/components/equipmentData';
	export default {
		name: 'reviseArrange',
		components: { MasterPage, ClassTimeSelect,EquipmentData},
		data() {
			return {
				loading:true,
				formData:{
          name:'暂无',
          equipmentParams:[],
          classTimeValue:'',
          type:'',
          typeLabel:'暂无',
          classDate:'',
          classDate1:'',
          bookingDate:'',
          date:'2017-8-21',
          state:'1',
          classRoomId:null,
          classFromList:[],
          material:'',
          classNames:'',
          Ncount:'1',
          description:' ',
          tercherName:' ',
          feedback:' ',
          groupNumber:1,
          subjectId:''
        },
        feedbacks:[{label:'可以上课',value:'1'},{label:'不可上课',value:'2'}],
        getClassData:{},
        equipmentList:null,
        equipmentData:[],
        classData:'',
        classRoom:[],
        searchData:{
          bookingId:'',
          planDetailId:''
        }
			};
		},
    computed: {
      ...mapGetters([
        'systemBlean'
      ])
    },
		created() {
      this.$store.dispatch('GetEquipSys');
			if(this.$route.params.bookingId===undefined||!this.$route.params.row){
        this.$router.go(-1);
        return;
      };
      this.searchData.planDetailId = this.$route.params.planDetailId;
      this.searchData.bookingId = this.$route.params.row.bookingId;
      this.formData.planDetailName=this.$route.params.row.planDetailName;
      this.formData.bookingId=this.$route.params.row.bookingId;
      this.formData.classFromList=this.$route.params.row.classFromList;
      if(typeof(this.$route.params.row.classNames)=='string'){
        this.formData.classNames=this.$route.params.row.classNames;
      }else{
         this.formData.classNames=this.$route.params.row.classNames.join(',');
      }

      this.formData.classTime=this.$route.params.row.classTime;
      this.formData.courseId=this.$route.params.row.courseId;
      // this.formData.feedback=this.$route.params.row.feedback;
      this.formData.planDetailId=this.$route.params.row.planDetailId;
      this.formData.tercherName=this.$route.params.row.tercherName;
      getArrangeDetail(this.searchData).then(response => {
        const data = response;
        this.formData.name=data.course.name;
        this.formData.material=data.course.material;
        this.formData.type=data.course.type;
        this.formData.groupNumber=data.course.groupNumber;
        this.equipmentData=data.equipmentList;
        this.formData.description=response.booking.description;
        this.formData.classDate1=new Date(data.course.classDate);
        this.formData.classDate = parseTime(this.formData.classDate1,'{y}-{m}-{d}');
        this.formData.bookingDate = response.booking.createTime.slice(0,10);
        this.formData.subjectId = response.planDetail.subject;
        this.formData.classRoomId = response.course.classroomId;
        this.getArea();
        if(!response.equipmentList || response.equipmentList.length == 0){
          // this.$message({
          //   message: '装备没有仪器数据',
          //   type: 'warning'
          // });
          this.equipmentData = [];
        }else{
          this.equipmentData = response.equipmentList;
        }
      });
		},
		methods: {
      getArea () {
        this.formData.classDate = parseTime(this.formData.classDate1,'{y}-{m}-{d}');
        getUseArea({'classdate': this.formData.classDate,'classtime':this.formData.classTime,subjectId:this.formData.subjectId}).then(response => {
          this.classRoom = response;
        });
      },
      cancel() {
      	this.$router.go(-1);
      },
      changeEquipment(val) {
        this.equipmentList = val;
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
      submitForm() {
      	if(!this.loading){
          return;
        }
        if(this.formData.state == '1' && !this.formData.classRoomId){
          this.$message({
            message: '请选择教室',
            type: 'warning'
          });
          return;
        }
        this.formData.classDate = parseTime(this.formData.classDate1,'{y}-{m}-{d}');
        this.loading = false;
        this.formData.equipmentParams = [];
        var vm = this;
        if(this.systemBlean){
          if(this.equipmentList && this.equipmentList.length > 0){
            for(let i=0;i<this.equipmentList.length;i++){
              let items = this.equipmentList[i];
              if(items.logsListList){
                for(let j=0;j<items.logsListList.length;j++){
                  let equipmentItem = {};
                  equipmentItem.itemsCode = items.itemsCode;
                  equipmentItem.itemsName = items.itemsName;
                  equipmentItem.unit = items.unit;
                  let itemsSon = items.logsListList[j];
                  if(!itemsSon.spec){
                    continue;
                  }
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
                  equipmentItem.availQuantity = itemsSon.availQuantity;
                  equipmentItem.instrumentId = itemsSon.code;
                  equipmentItem.unit = itemsSon.uom;
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
        addArrange(this.formData).then(response => {
          this.loading = true;
          this.$message({
            message: '操作成功！',
            type: 'success'
          });
          this.$router.go(-1);
        }).catch(err => {
          this.loading = true;
        });
      }
		}
	}
</script>
<style rel="stylesheet/scss" lang="less" scoped>
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
.el-col-8{
  width:240px;
}
.el-col-24{
  width:720px;
}
.el-col-20{
  width:600px;
}
.afour{
  width:842px;
  margin:0 auto;
  border: 1px solid #ccc;
   -webkit-box-shadow:1px  10px 10px 0 #999;
   -moz-box-shadow:1px  10px 10px 0 #999;
   box-shadow:1px 10px 10px 0 #999;
   font-family:SimSun;
   position: relative;
   .logpic{
     position:absolute;
     top:-15px;left:32px;

   }
   h2{
     font-size: 14px;
     padding: 42px 0;
     text-align: center;
   }

  .formBox{
    width:720px;
    font-size:12px;
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
        .el-select{
          width:100%;
        }

      }

    }

  }
}

</style>
