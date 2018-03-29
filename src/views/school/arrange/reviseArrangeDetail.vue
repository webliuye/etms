<template>
	<master-page title="安排信息">
    <div class="afour">
      <div class="logpic"><img  src="../../../assets/img/logpic.png" ></img></div>
      <h2 >实验安排单</h2>
      <div class="formBox">
        <el-form :model="formData" :rules="rules" ref="formData"  >
          <el-row >
            <el-col :span="4" style="border-right:transparent;border-bottom:transparent;"><div class="grid-content grid-head">实验名称</div></el-col>
            <el-col :span="12" style="border-right:transparent;border-bottom:transparent;"> <div class="grid-content">{{formData.name}}</div></el-col>
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;"> <div class="grid-content grid-head">实验类型</div></el-col>
            <el-col :span="4"  style="border-bottom:transparent;"> <div class="grid-content">{{formData.type}}</div></el-col>
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
            <el-col :span="20"  style="border-bottom:transparent;"> 
              <div class="grid-content" width="100%">
                {{formData.classNames}}
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;"><div class="grid-content grid-head">上课地点</div></el-col>
            <el-col :span="12"   style="border-right:transparent;border-bottom:transparent;"> 
              <div class="grid-content">
                <span>{{formData.classRoomName }}</span>
              </div>
            </el-col>
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;">
              <div class="grid-content grid-head">分组数</div>
            </el-col>
            <el-col :span="4"  style="border-bottom:transparent;">
              <div class="grid-content">
                <span>{{formData.groupNumber}}</span>
              </div> 
            </el-col>
          </el-row>
           <el-row >
             <el-col :span="24"  style="border-bottom:transparent;"> 
                    <EquipmentData :equipmentData="equipmentData" :isLogBooking="true" @changeEquipment="changeEquipment"></EquipmentData>
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
                    <span>{{formData.bookingUserName}}</span>
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
              <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;"> <div class="grid-content grid-head" >实验员</div></el-col>
               <el-col :span="20"  style="border-bottom:transparent;"> 
                 <div class="grid-content" >
                    <span>{{formData.arangeUserName}}</span>
                 </div>
                </el-col>
          </el-row> 
           <el-row >
              <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;"> <div class="grid-content grid-head" style="line-height:80px;" >预约说明</div></el-col>
               <el-col :span="20" style=" border-bottom:transparent;"> 
                 <div class="grid-content" style="height:80px;overflow:auto; word-wrap:break-word; white-space:normal; word-break:break-all;line-height:20px; ">
                    {{formData.description}} 
                 </div>
               </el-col>
          </el-row>
            <el-row >
              <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;"> <div class="grid-content grid-head" >反馈结果</div></el-col>
               <el-col :span="20"  style=" border-bottom:transparent;"  > 
                 <div class="grid-content"  style=" border-bottom:transparent;" >
                    <span>可以上课</span>
                 </div>
               </el-col>
          </el-row>   
          <el-row >
              <el-col :span="4"  style="border-right:transparent;"> <div class="grid-content grid-head" style="line-height:88px;">安排说明</div></el-col>
               <el-col :span="20"    > 
                 <div class="grid-content" style="height:88px;overflow:auto;word-wrap:break-word; white-space:normal; word-break:break-all;line-height:22px;">
                   <span>{{formData.feedback}}</span>
                 </div>
               </el-col>
          </el-row>       
            <div class="text-right" style="margin-top:32px;margin-bottom:32px;">              
              <el-form-item>
                <el-button type="primary" @click="cancel()">返回</el-button>
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
  import { reviseGetLogInfo } from 'api/index';
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
          name:'',
          equipmentParams:[],
          classTimeValue:'',
          type:'',
          typeLabel:'暂无',
          classDate:'',
          classDate1:'',
          date:'2017-8-21',
          state:'1',
          classRoomId:null,
          classRoomName:'',
          classFromList:[],
          material:'',
          classNames:'',
          Ncount:'1',
          description:' ',
          tercherName:' ',
          feedback:' ',
          groupNumber:1,
          bookingUserName:'',
          bookingDate:''
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
        },
        rules:{
          classRoomId: [
            { required: true, message: '请选择教室', trigger: 'change' }
          ]
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
			if(!this.$route.params.courseId){
        this.$router.go(-1);
        return;
      };
      reviseGetLogInfo(this.$route.params.courseId).then(res => {
        this.formData.name = res.name;
        this.formData.classTime = res.classTime;
        this.equipmentData = res.equipmentList;
        this.formData.description = res.description;
        this.formData.material = res.material;
        this.formData.type = res.type;
        this.formData.classDate = res.classDate.slice(0,10);
        this.formData.classNames = res.classNames.join(",");
        this.formData.classRoomName = res.classRoomName;
        this.formData.bookingUserName = res.bookingUserName;
        this.formData.bookingDate = res.bookingDate;
        this.formData.feedback = res.feedback;
        this.formData.arangeUserName = res.arangeUserName;
        this.formData.groupNumber = res.groupNumber;
      });
		},
		methods: {
      cancel() {
      	this.$router.go(-1);
      },
      changeEquipment(val) {
        this.equipmentList = val;
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