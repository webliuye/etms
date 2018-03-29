<template>
<master-page title="个人信息">
    <div class="dashboard-container">
      <div class="myinform">
        <el-row :span="24" :gutter="20" class='lineHeight'>
          <el-col :span="3" >
            <strong class="blue">姓名:</strong>
          </el-col>
          <el-col :span="9"  >
            <span>{{myInfo.name}}</span>
          </el-col>
          <el-col :span="3" >
            <strong class="blue">手机号码:</strong>
          </el-col>
          <el-col :span="9"  >
            <span>{{myInfo.mobile}}</span>
          </el-col>
        </el-row>
        <el-row :span="24" :gutter="20" class='lineHeight'>
          <el-col :span="3" >
            <strong class="blue">邮箱:</strong>
          </el-col>
          <el-col :span="9" >
            <span>{{myInfo.email||" "}}</span>
          </el-col>
           <el-col :span="3">
            <strong class="blue">身份:</strong>
          </el-col>
          <el-col :span="9" >
            <span>{{myInfo.roleNames}}</span>
          </el-col>
        </el-row>
        <el-row :span="24" :gutter="20" class='lineHeight'>
          <el-col :span="3">
            <strong class="blue">所属区域:</strong>
          </el-col>
          <el-col :span="9">
            <span>{{myInfo.orgName}}</span>
          </el-col>
        </el-row>
        <el-row class="button-change">
          <el-button class="fr clearfix" type="primary"  @click="goIportal" style="margin-top:16px;">修改个人信息</el-button>
        </el-row>
        <el-row   :gutter="20" v-if="schoolManager" class='lineHeight'>
          <el-form :model="openData" :rules="rules" ref="openData" label-width="120px" class="demo-ruleForm">
              <el-col :span="4">
                <strong class="blue">本学年开课日期</strong>
              </el-col>
              <el-col :span="10" >
                <el-form-item label="上学期开课日期" required>
                  <el-date-picker required v-model="openData.startDate1" :editable="false" clearable type="date" placeholder="请选择开课周的周一" @change="handleChange1"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="10" >
                <el-form-item label="下学期开课日期" required >
                  <el-date-picker required v-model="openData.startDate2" :editable="false" clearable type="date" placeholder="请选择开课周的周一" @change="handleChange3"></el-date-picker>
                </el-form-item>
              </el-col>
          </el-form>
				</el-row>
      </div>
    </div>
</master-page>
</template>

<script>
import { mapGetters } from "vuex";
import {getInfo} from "api/manageCenter";
import MasterPage from "views/layout/MasterPage";
import { setOpenDate } from "api/index";
import { getOpenDate } from "api/index";
import { formatDateTime } from "utils/index";
export default {
  name: "myInformation",
  components: { MasterPage },
  data() {
    return {
      myInfo: {
        name: ""
      },
      manageSubject: ["实验管理员"],
      schoolManager: false,
      formData: {
        gradeId: [],
        gradeIds: "",
        subject: "",
        classId: []
      },
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      openData: {
        startDate1: "",
        startDate2: ""
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
      iportalUrl: this.$store.getters.objApi.IPORTAL_API + "/homepage.html",
      roleCode: this.$store.state.user.userInfo.roleCode,
      rules: {
        startDate1: [
          { type: "date", required: true, message: "请选择时间", trigger: "change" }
        ],
        startDate2: [
          { type: "date", required: true, message: "请选择时间", trigger: "change" }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["subjectData"])
  },
  methods: {
    getMyInfo() {
      // 获取个人信息
      getInfo().then(res => {
        this.myInfo = res;
        if(this.myInfo.roleCode) {
          if (
            this.myInfo.roleCode == "225" ||
            this.myInfo.roleCode == "305" ||
            this.myInfo.roleCode.indexOf("303") > -1
          ) {
            this.schoolManager = true;
            getOpenDate().then(res => {
              this.startDate1 = new Date(res.dateList[0].startDate);
              this.startDate2 = new Date(res.dateList[1].startDate);
              this.openData = {
                startDate1: new Date(res.dateList[0].startDate),
                startDate2: new Date(res.dateList[1].startDate)
              };
            });
          }
        }

      });
    },
    goIportal() {
      window.open(this.iportalUrl);
    },
    changeOpenDate() {
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
            this.$message({
              message: "设置成功",
              type: "success"
            });
          });
        }
      });
    },
    handleChange1() {
      var date = new Date(this.openData.startDate1);
      if (date.getMonth() == 7 || date.getMonth() == 8) {
        this.changeOpenDate();
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
      if (date.getMonth() == 1 || date.getMonth() == 2) {
        this.changeOpenDate();
      } else {
        this.$message({
          message: "您好，请选择正确的月份",
          type: "warning"
        });
      }
    }
  },
  created() {
    this.$store.dispatch("GetSubject");
    this.getMyInfo();
  }
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.dashboard-container {
  font-family: "微软雅黑";
}
.el-row {
  border-bottom: 1px dashed rgba(6, 6, 6, 0.1);
  .el-form-item {
    margin-bottom: 0;
    margin-top: 10px;
  }
}

.bottom-Line {
  border-bottom: 1px solid rgba(6, 6, 6, 0.2);
  // margin-bottom:32px;
}
.button-change {
  padding-bottom: 16px;
  border-bottom: none;
}
.home-p {
  width: 100%;
  border-bottom: 1px solid #e1e4e3;
  line-height: 1.6em;
  font-size: 12px;
}
.myinform {
  font-size: 12px;
  padding: 0 48px 64px;
  color: #333;
}
.text-right {
  text-align: right;
}
.lineHeight {
  line-height: 48px;
}
.lineHeight2 {
  line-height: 20px;
}
h4 {
  font-size: 14px;
}
.blue {
  font-weight: normal;
}
.info-class {
  line-height: 32px;
  padding-top: 14px;
  span {
    padding-right: 10px;
  }
}
.manyClass label.el-checkbox {
  margin-left: 0;
  margin-right: 15px;
}
.manyGrade label.el-checkbox {
  display: block;
}
.nowhite {
  height: 48px;
  line-height: 48px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin: 0;
}
.el-date-editor.el-input {
  width: 180px;
}
</style>
