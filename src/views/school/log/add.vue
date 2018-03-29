<template>
  <master-page title="安排信息">
    <div class="afour">
      <div class="logpic"><img  src="../../../assets/img/logpic.png" ></img></div>
      <h2 >实验登记单</h2>
      <div class="formBox">
        <el-form :model="formData" :rules="rules" ref="formData"  >
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
            <el-col :span="12"  style="border-right:transparent;border-bottom:transparent;">
               <div class="grid-content">{{formData.courseForm.classDate}}</div>
            </el-col>
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;">
              <div class="grid-content grid-head">上课节次</div>
            </el-col>
            <el-col :span="4"  style="border-bottom:transparent;">
              <div class="grid-content">
                 <template >
                    第{{formData.classTime}}节课
                </template>
              </div>
            </el-col>
          </el-row>
           <el-row >
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;">
              <div class="grid-content grid-head">上课班级</div>
            </el-col>
            <el-col :span="8"  style="border-bottom:transparent;">
              <div class="grid-content" width="100%">
                {{formData.classNames}}
              </div>
            </el-col>
            <el-col :span="4"  style="border-left:transparent;border-right:transparent;border-bottom:transparent;">
              <div class="grid-content grid-head">上课地点</div>
            </el-col>
            <el-col :span="8"   style="border-bottom:transparent;">
              <div class="grid-content heigth40">
                <span v-if="bookingState">{{formData.classRoomName}}</span>
                <el-select v-if="!bookingState" v-model="formData.courseForm.classroomId" placeholder="请选择实验地点">
                  <el-option v-for="(item,index)  in classRoom" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;">
              <div class="grid-content grid-head">分组数</div>
            </el-col>
            <el-col :span="20"  style="border-bottom:transparent;">
              <div class="grid-content">{{formData.groupNumber}}</div>
              <!-- <el-input min="1" type='number' v-model="formData.groupNumber" placeholder=""></el-input> -->
            </el-col>
          </el-row>
           <el-row >
             <el-col :span="24"  style="border-bottom:transparent;">
                <EquipmentData :equipmentData="equipmentData" :isLogBooking="isBooking" :isLog="true" @changeEquipment="changeEquipment"></EquipmentData>
             </el-col>
          </el-row>
          <el-row >
              <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;"> <div class="grid-content grid-head" style="line-height:80px;">实验材料</div></el-col>
              <el-col :span="20"  style="border-bottom:transparent;">
                 <div class="grid-content" style="height:80px;overflow:hidden;word-wrap:break-word; white-space:normal; word-break:break-all;line-height:20px; ">
                    <span>{{formData.material}}</span>
                 </div>
              </el-col>
          </el-row>
          <el-row >
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;">
              <div class="grid-content grid-head" >授课老师</div>
            </el-col>
            <el-col :span="8"  style=" border-right:transparent;border-bottom:transparent;">
              <div class="grid-content" >
                <span>{{formData.bookingUserName}}</span>
              </div>
            </el-col>
              <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;">
                <div class="grid-content grid-head" >预约时间</div>
              </el-col>
            <el-col :span="8"  style=" border-bottom:transparent;">
               <div class="grid-content" >
                  <span>{{formData.bookingDate}}</span>
               </div>
            </el-col>
          </el-row>
           <el-row >
              <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;">
                <div class="grid-content grid-head" style="line-height:80px;">预约说明</div>
              </el-col>
               <el-col :span="20" style=" border-bottom:transparent;">
                 <div class="grid-content" style="height:80px;overflow:hidden;word-wrap:break-word; white-space:normal; word-break:break-all;line-height:20px; ">
                    {{formData.description}}
                 </div>
               </el-col>
          </el-row>
          <el-row >
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;">
              <div class="grid-content grid-head" >实验员</div>
            </el-col>
            <el-col :span="8"  style=" border-right:transparent;border-bottom:transparent;">
              <div class="grid-content heigth40" >
                <span v-if="bookingState">{{formData.arangeUserName}}</span>
                <el-select v-if="!bookingState" v-model="formData.courseForm.arrangeId" placeholder="请选择实验员">
                  <el-option v-for="(item,index)  in teacherInform" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </div>
            </el-col>
              <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;">
                <div class="grid-content grid-head" >安排时间</div>
              </el-col>
            <el-col :span="8"  style=" border-bottom:transparent;">
               <div class="grid-content" >
                  <span>{{formData.arangeDate}}</span>
               </div>
            </el-col>
          </el-row>
          <el-row >
              <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;">
                <div class="grid-content grid-head" style="line-height:80px;">安排说明</div>
              </el-col>
              <el-col :span="20" style="border-bottom:transparent;">
                 <div class="grid-content" style="height:80px;overflow:hidden;line-height:24px;">
                   {{formData.feedback}}
                 </div>
              </el-col>
          </el-row>
          <el-row >
              <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;">
                <div class="grid-content grid-head" style="line-height:80px;">损坏说明</div>
              </el-col>
              <el-col :span="20" style="border-bottom:transparent;">
                 <div class="grid-content" style="height:80px;overflow:hidden;padding:0;line-height:24px;">
                   <el-input type="textarea" :rows="4" :maxlength="100" placeholder="请输入仪器损坏说明内容(100字以内)" v-model="formData.logForm.suggest"> </el-input>
                 </div>
              </el-col>
          </el-row>
          <el-row >
              <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;">
                <div class="grid-content grid-head" style="line-height:80px;"><span class="start-span">*</span>实验结论</div>
              </el-col>
              <el-col :span="20" style="border-bottom:transparent;">
                 <div class="grid-content" style="height:80px;overflow:hidden;padding:0;line-height:24px;">
                     <el-radio-group v-model="radio" size="mini"  @change="changeRadio" v-if="!formData.logForm.result" style="margin-left:8px;">
                      <el-radio label="已实现实验教学目标">已实现实验教学目标</el-radio>
                      <el-radio  label="已非常好的实现实验教学目标">已非常好的实现实验教学目标</el-radio>
                      <el-radio  label="已特别好的实现实验教学目标">已特别好的实现实验教学目标</el-radio>
                    </el-radio-group>
                   <el-input type="textarea" :rows="4" :maxlength="100" placeholder="请输入实验结论(100字以内)" v-model="formData.logForm.result"> </el-input>
                 </div>
              </el-col>
          </el-row>
          <el-row >
            <el-col :span="4"  style="border-right:transparent;">
              <div class="grid-content grid-head" style="line-height:160px;">上传照片</div>
            </el-col>
            <el-col :span="20">
              <div class="grid-content photo-div" style="height:160px;overflow:hidden;padding:0;">
                <el-upload
                :file-list="fileListData"
                 list-type="picture-card"
                  :action="urlAjax"
                  :headers="urlHeaders"
                  :on-success="upLoadSuccess"
                  :before-upload="beforeAvatarUpload"
                  :on-change="handleChange"
                  :on-progress="handleProgress"
                 :on-preview="handlePictureCardPreview"
                 :on-remove="handleRemove">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible" width="30%" :modal-append-to-body="false">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
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
import MasterPage from "views/layout/MasterPage";
import {
  getLogInfo,
  addLogInfo,
  reviseLogInfo,
  reviseGetLogInfo
} from "api/index";
import ClassTimeSelect from "views/components/select/classTimeSelect";
import { mapGetters } from "vuex";
import EquipmentData from "views/components/equipmentData";
export default {
  name: "reviseArrange",
  components: { MasterPage, ClassTimeSelect, EquipmentData },
  data() {
    return {
      radio: null,
      urlHeaders: null, // 上传文件请求header
      urlAjax: "", // 上传文件请求地址
      loading: false,
      handleBoolean: false,
      formData: {
        type: "",
        name: "",
        classRoomName: "",
        groupNumber: 1,
        bookingDate: "",
        arangeDate: "",
        subject: "",
        bookingUserName: "",
        arangeUserName: "",
        equipmentParams: [],
        classTime: "",
        classDate: "",
        state: "1",
        material: "",
        classNames: "",
        description: " ",
        feedback: "",
        courseForm: {
          id: null,
          classDate: null,
          arrangeId: null,
          classroomId: null
        },
        logForm: {
          result: "",
          suggest: "",
          courseId: "",
          id: null,
          equipmentFormList: [],
          photoFormList: []
        }
      },
      fileListData: [],
      dialogImageUrl: "",
      dialogVisible: false,
      isEdit: false,
      getClassData: {},
      equipmentList: null,
      equipmentData: [],
      classData: "",
      classRoom: [], // 实验地点
      teacherInform: [], //实验员
      courseId: "",
      isBooking: true,
      bookingState: true,
      changeBoolean: {},
      rules: {
        classRoomId: [{ required: true, message: "请选择教室", trigger: "change" }]
      }
    };
  },
  computed: {
    ...mapGetters(["systemBlean"])
  },
  created() {
    this.$store.dispatch("GetEquipSys");
    this.urlHeaders = { Authorization: "bearer " + this.$store.getters.token }; // 上传文件请求header
    this.urlAjax = this.$store.getters.objApi.BASE_API + "/api/file/upload"; // // 上传文件请求header
    this.courseId = this.$route.params.courseId;
    this.formData.courseForm.id = this.$route.params.courseId;
    this.changeBoolean = this.$store.state.commonData.changeBool;
    this.isEdit = this.$route.params.isEdit;
    if (this.isEdit) {
      //修改
      reviseGetLogInfo(this.courseId).then(res => {
        this.initData(res);
        this.formData.courseForm.courseId = res.log.courseId;
        this.formData.courseForm.id = res.log.courseId;
        this.formData.logForm.courseId = res.log.courseId;
        this.formData.logForm.id = res.log.id;
        this.formData.logForm.photoFormList = res.photoList;
        for (var i = 0; i < res.photoList.length; i++) {
          this.fileListData.push({
            id: res.photoList[i].attachId,
            url: res.photoList[i].fileurl
          });
        }
      });
    } else {
      getLogInfo(this.courseId).then(res => {
        //登记获取
        this.initData(res);
      });
    }
  },
  methods: {
    initData(res) {
      //格式化数据
      this.formData.name = res.name;
      this.formData.subject = res.subject;
      this.formData.type = res.type;
      this.formData.courseForm.classDate = res.classDate.slice(0, 10);
      this.formData.classTime = res.classTime;
      this.formData.classNames = res.classNames.join(",");
      this.formData.classRoomName = res.classRoomName;
      this.formData.groupNumber = res.groupNumber;
      this.formData.material = res.material;
      this.formData.arangeDate = res.arangeDate;
      this.formData.bookingDate = res.bookingDate;
      this.formData.bookingUserName = res.bookingUserName;
      this.formData.description = res.description;
      this.formData.arangeUserName = res.arangeUserName;
      this.formData.feedback = res.feedback;
      this.equipmentData = res.equipmentList;
      this.formData.logForm.result = res.result ? res.result : "";
      this.formData.logForm.suggest = res.result ? res.suggest : "";
    },
    changeRadio() {
      this.formData.logForm.result = this.radio + this.formData.logForm.result;
      this.radio = null;
    },
    handleRemove(file, fileList) {
      this.formData.logForm.photoFormList = [];
      var vm = this;
      fileList.forEach(function(item) {
        if (!item.response) {
          item.fileurl = item.url;
          vm.formData.logForm.photoFormList.push(item);
        } else {
          item.response.attachId = item.response.id;
          item.response.fileurl = item.response.url;
          vm.formData.logForm.photoFormList.push(item.response);
        }
      });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 10;
      let isJPG = false;
      if (
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif"
      ) {
        isJPG = true;
      }
      if (!isJPG) {
        this.$message.error("上传图片只能是jpg、png、gif格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 10MB!");
      }
      return isJPG && isLt2M;
    },
    handleProgress() {
      console.log("22");
      this.handleBoolean = true;
    },
    upLoadSuccess(response, file, fileList) {
      this.handleBoolean = false;
      this.formData.logForm.photoFormList = [];
      var vm = this;
      fileList.forEach(function(item) {
        if (!item.response) {
          item.fileurl = item.url;
          vm.formData.logForm.photoFormList.push(item);
        } else {
          item.response.attachId = item.response.id;
          item.response.fileurl = item.response.url;
          vm.formData.logForm.photoFormList.push(item.response);
        }
      });
      console.log(this.formData.logForm.photoFormList);
    },
    handleChange(file, fileList) {},
    cancel() {
      this.$router.go(-1);
    },
    changeEquipment(val) {
      this.equipmentList = val;
    },
    submitForm() {
      this.$refs["formData"].validate(valid => {
        //if (!valid) return false; // 验证实验完成情况
        if (this.handleBoolean) {
          this.$message({
            message: "图片正在上传中,请稍后提交!",
            type: "warning"
          });
          return;
        }
        if (this.loading) {
          return;
        }
        if (
          !this.formData.logForm.result ||
          !this.formData.logForm.result.trim()
        ) {
          this.$message({
            message: "请填写完成情况",
            type: "warning"
          });
          return;
        }
        var data = jQuery.extend({}, this.formData);
        var equipment = jQuery.extend([], data.logForm.equipmentFormList);
        for (let i = 0; i < equipment.length; i++) {
          if (
            equipment[i].take > 9999 ||
            equipment[i].loss > 9999 ||
            equipment[i].repair > 9999
          ) {
            this.$message.error("实拿数，报损数，报修数不能超过10000");
            return false;
          }
          if (!equipment[i].name) {
            equipment.splice(i, 1);
            i--;
          }
        }
        // if(photo.length<=0) {
        //   this.$message.error('请至少上传一张照片');
        //   return false;
        // }
        this.loading = true;
        var vm = this;
        data.logForm.equipmentFormList = this.equipmentList;
        if (this.systemBlean) {
          //是否与装备打通
          data.logForm.remark = "报损:(";
          data.logForm.equipmentFormList.forEach(function(item) {
            if (item.logsListList) {
              item.logsListList.forEach(function(items) {
                if (items.loss != "" || items.loss != 0) {
                  data.logForm.remark +=
                    "品目：" +
                    item.itemsName +
                    "," +
                    "规格：" +
                    items.spec +
                    "," +
                    "数量：" +
                    items.loss +
                    ",";
                }
              });
            }
          });
          data.logForm.remark += ")";
        }
        data.logForm.equipmentFormList = [];
        if (this.systemBlean) {
          if (this.equipmentList && this.equipmentList.length > 0) {
            for (let i = 0; i < this.equipmentList.length; i++) {
              let items = this.equipmentList[i];
              if (items.logsListList) {
                for (let j = 0; j < items.logsListList.length; j++) {
                  let obj = {};
                  obj.courseId = vm.id;
                  obj.itemsCode = items.itemsCode;
                  obj.itemsName = items.itemsName;
                  obj.itemsType = items.itemsType;
                  let item = items.logsListList[j];
                  obj.unit = item.uom;
                  obj.loss = item.loss;
                  obj.name = item.name;
                  obj.spec = item.spec;
                  obj.take = item.take;
                  obj.instrumentId = item.code;
                  if (obj.instrumentId) {
                    data.logForm.equipmentFormList.push(obj);
                  }
                }
              } else {
                this.formData.equipmentParams.push(items);
              }
            }
          } else {
            this.formData.equipmentParams = null;
          }
        } else {
          data.logForm.equipmentFormList = this.equipmentList;
        }
        data.logForm.courseId = this.courseId;
        if (this.isEdit) {
          reviseLogInfo(data)
            .then(res => {
              this.loading = false;
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.$router.go(-1);
            })
            .catch(err => {
              this.loading = false;
            });
        } else {
          addLogInfo(data)
            .then(response => {
              this.loading = false;
              this.changeBoolean.isPlan = false;
              this.changeBoolean.isBooking = false;
              this.changeBoolean.isArrange = false;
              this.changeBoolean.isLog = true;
              this.$store.commit("SET_CHANGEBOOL", this.changeBoolean);
              this.$message({
                message: "登记成功",
                type: "success"
              });
              this.$router.go(-1);
            })
            .catch(err => {
              this.loading = false;
            });
        }
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.el-col-4 {
  width: 120px;
}
.el-col-3 {
  width: 90px;
}
.el-col-6 {
  width: 180px;
}
.el-col-12 {
  width: 360px;
}
.el-col-8 {
  width: 240px;
}
.el-col-24 {
  width: 720px;
}
.el-col-20 {
  width: 600px;
}
.afour {
  width: 842px;
  margin: 0 auto;
  border: 1px solid #ccc;
  -webkit-box-shadow: 1px 10px 10px 0 #999;
  -moz-box-shadow: 1px 10px 10px 0 #999;
  box-shadow: 1px 10px 10px 0 #999;
  font-family: SimSun;
  position: relative;
  .logpic {
    position: absolute;
    top: -15px;
    left: 32px;
  }
  h2 {
    font-size: 14px;
    padding: 42px 0;
    text-align: center;
  }

  .formBox {
    width: 720px;
    font-size: 12px;
    margin: 0 auto;
    padding-bottom: 32px;
    .el-row {
      .el-col {
        border: 1px solid #000;
        .grid-content {
          padding: 0 8px;
        }
        line-height: 40px;
        .el-date-editor.el-input {
          .el-input__inner {
            border: none !important;
          }
          width: 100%;
        }
        .el-select {
          width: 100%;
        }
      }
    }
  }
}
.grid-content {
  .el-radio__input {
    .el-radio__inner {
      border: 1px solid #333;
    }
  }
}
</style>
