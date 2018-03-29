<template>
	<div class="all-content">
		<div class="box-content">
				<div class="t-box">
					<el-steps center :active="isactive">
						<el-step title="设置班级"></el-step>
						<el-step title="设置教室">这是一段很长的文字</el-step>
						<el-step title="设置开学日期"></el-step>
					</el-steps>
				</div>

				<div class="b-box" >
					<div v-show="showCase1">
						<ClassManage :isLead="true"></ClassManage>
					</div>
					<div v-show="showCase2">
						<RoomManage :isLead="true"></RoomManage>
					</div>
					<div v-show="showCase3">
						<el-row class='lineHeight'>
							<el-col :span="20" :offset="2">
								<p style="padding-left:12px;">本学年开课日期设置</p>
								<el-form :model="openData" :rules="rules" ref="openData" label-width="110px" class="demo-ruleForm">
									<el-row class='lineHeight'>
										<el-col :span="24" >
											<el-form-item label="上学期开课日期" required  prop="startDate1">
												<el-date-picker required v-model="openData.startDate1" type="date" placeholder="选择日期" @change="handleChange1"></el-date-picker>
											</el-form-item>
										</el-col>
										<el-col :span="24" >
											<el-form-item label="下学期开课日期" required  prop="startDate2">
												<el-date-picker required v-model="openData.startDate2" type="date" placeholder="选择日期"  @change="handleChange3"></el-date-picker>
											</el-form-item>
										</el-col>
									</el-row>
								</el-form>
							</el-col>
						</el-row>
					</div>
					<el-button-group  class="fr">
						<el-button style="margin-top: 12px;" @click="pre" v-show="isactive!=0" type="primary" icon="el-icon-arrow-left">上一步</el-button>
						<el-button style="margin-top: 12px;margin-left: 12px;" @click="next('classInfo')" v-show="isactive==0" type="primary"  >下一步<i class="el-icon-arrow-right el-icon--right"></i></el-button>
						<el-button style="margin-top: 12px;margin-left: 12px;" @click="next('classRoom')" v-show="isactive==1" type="primary"  >下一步<i class="el-icon-arrow-right el-icon--right"></i></el-button>
						<!-- <el-button style="margin-top: 12px;margin-left: 12px;" @click="next('opendate')" v-show="isactive==2" type="primary"  >确定<i class="el-icon-arrow-right el-icon--right"></i></el-button> -->
            <el-button style="margin-top: 12px;margin-left: 12px;" @click="next('opendate')" v-show="isactive==2" type="primary" >去制定实验计划</el-button>
          </el-button-group>
				</div>
			</div>
	</div>
</template>

<script>
import ClassManage from "views/school/classManage/components/classManage";
import RoomManage from "views/school/roomManage/components/roomManage";
import { mapGetters } from "vuex";
import {
  getInfo,
  getMineClass,
  reviseMineInfo,
  getStaffSubject,
  reviseStaffSubject
} from "api/manageCenter";
import SubjectSelect from "views/components/select/subjectSelect";
import { getplanGrade } from "api/common";
import { setOpenDate } from "api/index";
import { getOpenDate } from "api/index";
import { setInfostate } from "api/login";
import { formatDateTime } from "utils/index";
export default {
  name: "superSet",
  components: { ClassManage, RoomManage, SubjectSelect },
  props: {
    active: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isactive: 0,
      showCase1: true,
      showCase2: false,
      showCase3: false,
      showCase4: false,
      showCase5: false,
      openData: {
        startDate1: "",
        endDate1: "",
        startDate2: "",
        endDate2: ""
      },
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      subjectCheckArray: [],
      dialogRevise: false,
      myInfo: {
        name: ""
      },
      dialogTeach: {},
      dialogAdd: {},
      formData: {},
      subjectArray: [],
      gradeId: [],
      gradeData: [],
      showGrade: false,
      shows: false,
      manageSubject: ["实验管理员"],
      orderTitle: "修改信息",
      dialogRevise: false,
      formData: {
        gradeId: [],
        gradeIds: "",
        subject: "",
        classId: []
      },
      postData: {
        dateList: [
          {
            startDate: "",
            term: ""
          },
          {
            startDate: "",
            term: ""
          }
        ]
      },
      classIds: [],
      gradeData: [],
      classData: [],
      reviseBl: false,
      addBl: false,
      moreClass: true,
      subjectId: "",
      rules: {
        gradeId: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个年级",
            trigger: "blur"
          }
        ],
        subject: [
          {
            type: "string",
            required: true,
            message: "请选择科目",
            trigger: "change"
          },
          {
            validator: (rule, value, callback) => {
              if (value == "") {
                callback(new Error("请选择科目"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ],
        classId: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个班级",
            trigger: "blur"
          }
        ],
        startDate1: [
          { type: "date", required: true, message: "请选择时间", trigger: "change" }
        ],
        startDate2: [
          { type: "date", required: true, message: "请选择时间", trigger: "change" }
        ]
      }
    };
  },

  created() {
    this.$store.dispatch("GetSubject");
    this.$store.dispatch("GetTerm");
    this.getMyInfo();
    this.isactive = this.active;
    this.ChangeShowCase();
    getOpenDate().then(res => {
      if (res.dateList && res.dateList[0].startDate) {
        this.openData = {
          startDate1: new Date(res.dateList[0].startDate),
          startDate2: new Date(res.dateList[1].startDate)
        };
      } else {
        var date = new Date();
        var Year = date.getFullYear();
        var Month = date.getMonth() + 1;
        var nextYear = Year + 1;
        var oldYear = Year - 1;
        if (Month >= 8) {
          this.openData.startDate1 = new Date(Date.parse(Year + " 9 1"));
          this.openData.startDate2 = new Date(Date.parse(nextYear + " 3 1"));
        } else {
          this.openData.startDate1 = new Date(Date.parse(oldYear + " 9 1"));
          this.openData.startDate2 = new Date(Date.parse(Year + " 3 1"));
        }
      }
    });
  },
  watch() {},
  computed: {
    ...mapGetters(["subjectData", "termData"])
  },
  methods: {
    toPlan() {
      this.$router.push({ path: "/plan" });
    },
    ChangeShowCase() {
      this.showCase1 = false;
      this.showCase2 = false;
      this.showCase3 = false;
      this.showCase4 = false;
      this.showCase5 = false;
      switch (this.isactive) {
        case 0:
          {
            this.showCase1 = true;
          }
          break;
        case 1:
          {
            this.showCase2 = true;
          }
          break;
        case 2:
          {
            this.showCase3 = true;
          }
          break;
        case 3:
          {
            this.showCase4 = true;
          }
          break;
        case 4:
          {
            this.showCase5 = true;
          }
          break;
      }
    },
    next(text) {
      if (text === "classInfo") {
        setInfostate().then(res => {
          if (res.classState) {
            this.isactive++;
            this.ChangeShowCase();
          } else {
            this.$message({
              message: "请设置班级信息",
              type: "warning"
            });
          }
        });
      }
      if (text === "classRoom") {
        setInfostate().then(res => {
          if (res.classRoomState) {
            this.isactive++;
            this.ChangeShowCase();
          } else {
            this.$message({
              message: "请设置教室信息",
              type: "warning"
            });
          }
        });
      }
      if (text === "opendate") {
        this.$refs["openData"].validate(valid => {
          if (valid) {
            this.postData.dateList = [
              {
                startDate: new Date(
                  this.openData.startDate1.getTime() + 28800000
                ),
                term: "1"
              },
              {
                startDate: new Date(
                  this.openData.startDate2.getTime() + 28800000
                ),
                term: "2"
              }
            ];
            setOpenDate(this.postData).then(res => {
                this.$store.state.user.userInfo.schoolOpenDateFirst=formatDateTime(new Date(this.openData.startDate1));
                this.$router.push({ path: "/plan" });

            });
          }else{
              this.$message({type:'warning',message:'请设置有效的开学日期'});
          }
        });
      }
      if (text === "subject") {
        this.isactive++;
        this.ChangeShowCase();
      }
    },
    pre() {
      this.isactive--;
      this.ChangeShowCase();
    },
    handleChange1() {
      var date = new Date(this.openData.startDate1);
      console.log(date.getMonth());

      if (date.getMonth() == 7 || date.getMonth() == 8) {
        console.log("月份");
      } else {
        this.$message({
          message: "您好，请选择正确的月份",
          type: "warning"
        });
        this.openData.startDate1 = "";
      }
    },
    handleChange3() {
      var date = new Date(this.openData.startDate2);
      console.log(date.getMonth());

      if (date.getMonth() == 1 || date.getMonth() == 2) {
        console.log("月份");
      } else {
        this.$message({
          message: "您好，请选择正确的月份",
          type: "warning"
        });
      }
    },

    getMyInfo() {
      // 获取个人信息
      getInfo().then(res => {
        console.log("个人信息" + res);
        this.myInfo = res;
        if (res.userClassLists && res.userClassLists.length > 0) {
          this.moreClass = false;
          for (var i = 0; i < this.myInfo.userClassLists.length; i++) {
            this.subjectArray.push(this.myInfo.userClassLists[i].subjectId);
          }
        }
        var that = this;
        if (this.myInfo.roleCode == "101") {
          getStaffSubject().then(res => {
            res.forEach(function(_item) {
              that.subjectCheckArray.push(_item.subject);
            });
          });
        }
        this.roleNamesArray = this.myInfo.roleNames.split(",");
        this.roleNamesArray.map(function(item) {
          if (that.manageSubject.indexOf(item) > -1) {
            that.shows = true;
          }
        });
        if (this.roleNamesArray.indexOf("授课老师") > -1) {
          this.showGrade = true;
        }
      });
    },
    staffSubject() {
      reviseStaffSubject(this.subjectCheckArray).then(res => {
        this.$message({
          message: "修改成功",
          type: "success"
        });
      });
    },
    changeSubject(subject) {
      this.formData.subject = subject;
      this.getGradeList();
    },
    getGradeList() {
      getplanGrade(this.formData).then(res => {
        this.gradeData = res;
      });
    },
    getClass() {
      if (this.formData.gradeId.length == 0) {
        this.classData = [];
        return;
      }
      this.gradeIds = this.formData.gradeId.join(",");
      getMineClass({
        grades: this.gradeIds,
        subject: this.formData.subject
      }).then(res => {
        this.classData = res;
        var classDataId = [];
        res.forEach(function(item) {
          classDataId.push(item.classId);
        });
        this.formData.classId = this.formData.classId.filter(function(item) {
          return classDataId.indexOf(item) > -1;
        });
      });
    },
    revise(item) {
      this.reviseBl = true;
      this.addBl = false;
      this.dialogRevise = true;
      this.formData.subject = item.subjectId;
      this.subjectId = item.subjectId;
      this.gradeId = [];
      this.getGradeList();
      var classInfo = item.classInfoLists;
      var that = this;
      classInfo.map(function(item) {
        if (that.formData.gradeId.indexOf(item.gradeId) < 0) {
          that.formData.gradeId.push(item.gradeId);
        }
        if (that.formData.classId.indexOf(item.classId) < 0) {
          that.formData.classId.push(item.classId);
        }
      });
      this.getClass();
    },
    reviseClass() {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          for (var k = 0; k < this.subjectArray.length; k++) {
            if (this.subjectArray[k] == this.subjectId) {
              this.subjectArray.splice(k, 1);
            }
          }
          if (this.subjectArray.indexOf(this.formData.subject) > -1) {
            this.$message({
              type: "warning",
              message: "该科目已经存在!"
            });
            return;
          }
          this.classIds = [];
          for (let i = 0; i < this.formData.classId.length; i++) {
            let classObj = {};
            classObj.classId = this.formData.classId[i];
            this.classIds.push(classObj);
          }
          reviseMineInfo({
            classIdList: this.classIds,
            subject: this.formData.subject
          }).then(res => {
            this.getMyInfo();
            this.dialogRevise = false;
            this.reviseBl = false;
            this.$message({
              type: "success",
              message: "修改成功!"
            });
          });
        }
      });
    },
    add() {
      this.reviseBl = false;
      this.addBl = true;
      this.dialogRevise = true;
      //默认一个学科
      this.formData.subject = this.subjectCheckArray[0];

      //  this.formData.subject = '';
      this.formData.gradeId = [];
      this.formData.classId = [];
      this.classData = [];
    },
    addClass() {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          if (this.subjectArray.indexOf(this.formData.subject) > -1) {
            this.$message({
              type: "warning",
              message: "该科目已经存在!请重新选择科目"
            });
            return;
          }
          this.classIds = [];
          for (let i = 0; i < this.formData.classId.length; i++) {
            let classObj = {};
            classObj.classId = this.formData.classId[i];
            this.classIds.push(classObj);
          }
          reviseMineInfo({
            classIdList: this.classIds,
            subject: this.formData.subject
          }).then(res => {
            this.getMyInfo();
            this.dialogRevise = false;
            this.addBl = false;
            this.$message({
              type: "success",
              message: "新增成功!"
            });
          });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@base-bg: #00a0e9;
@hoverColor: #00a0e9;
.grid-content {
  background-color: #fff;
  padding: 24px;
  display: flex;
  justify-content: space-between;
}
.plan-div {
  width: 182px;
  height: 84px;
  border: 1px solid #eee;
  border-radius: 4px;
  cursor: pointer;
  justify-content: space-around;
}
.plan-div:hover {
  border: 1px solid #00a0e9;
}
.plan-div img {
  float: left;
  display: inline;
  margin-left: 24px;
  margin-top: 12px;
}
.plan-div p.b-con {
  float: left;
  display: inline;
  padding-left: 4px;
  padding-top: 6px;
  font-size: 12px;
  color: #323437;
  line-height: 24px;
}
.plan-div p.top-con {
  font-size: 12px;
}
.plan-div p.b-con span {
  font-size: 24px;
}
.to-div {
  width: 60px;
  height: 84px;
}
.to-div img {
  display: block;
  margin: 0 auto;
  padding-top: 12px;
}
.main-content {
  margin-top: 36px;
  height: 600px;
  position: relative;
}
.index-left {
  position: absolute;
  width: 60px;
  left: 0;
  top: -12px;
  background-color: #ccc;
  height: 600px;
}
.index-right {
  padding-left: 84px;
  width: 100%;
}
.manyClass label.el-checkbox {
  margin-left: 0;
  margin-right: 15px;
  font-weight: 500;
}
.item-content {
  position: relative;
  width: 100%;
  background: url("../../../assets/img/plan-bg.png") center center no-repeat;
  background-size: 100% 100%;
}
.pos-img {
  position: absolute;
  left: -4px;
  top: -12px;
}
.item-content p.top-con {
  padding: 8px 0;
  font-size: 14px;
  margin: 8px 24px;
  border-bottom: 1px dashed #00a0e9;
}
.item-content p.b-con {
  padding: 0 24px 32px;
  line-height: 48px;
  font-size: 14px;
  color: #333;
}
.item-content p .plan-name {
  display: inline-block;
  width: 16.5%;
  max-width: 260px;
  min-width: 140px;
  font-weight: bold;
}
.item-content p .class-name {
  display: inline-block;
}
.item-content p a {
  margin-right: 8px;
  display: inline-block;
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: #00a0e9;
  color: #fff;
  text-align: center;
}
.box-content {
  width: 100%;
  margin: 0 auto;
  padding: 0 64px;
  .t-box {
    padding-top: 32px;
  }
  .b-box {
    width: 80%;
    margin: 32px auto;
    .lineHeight {
      line-height: 48px;
    }
  }
}
.info-class {
  font-size: 12px;
}
</style>
