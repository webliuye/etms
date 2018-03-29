<template>
<master-page title="学校开出情况">
    <div class="dashboard-container">
      <el-tabs v-model="activeName2"  @tab-click="handleClick">
        <el-tab-pane label="按学校统计" name="first">
          <keep-alive>
            <RankCount v-if="activeName2 == 'first'"></RankCount>
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="按教师统计" name="second">
          <keep-alive>
            <TeacherCount v-if="activeName2 == 'second'"></TeacherCount>
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="按科目统计" name="third">
          <keep-alive>
            <SubjectCount v-if="activeName2 == 'third'"></SubjectCount>
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="按目录统计" name="fourth">
          <keep-alive>
            <GuideCount v-if="activeName2 == 'fourth'"></GuideCount>
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="按学段统计" name="five">
          <keep-alive>
            <GradeCount v-if="activeName2 == 'five'"></GradeCount>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
      
</master-page>
</template>

<script>
import SubjectCount from "views/admin/subjectCount/subjectCount";
import MasterPage from "views/layout/MasterPage";
import TeacherCount from "views/admin/condit/teacherCount";
import GuideCount from "views/admin/guideCount/guideCount";
import GradeCount from "views/admin/gradeCount/gradeCount";
import RankCount from "views/admin/rankCount/rankCount";
export default {
  name: "openRecord",
  components: {
    TeacherCount,
    MasterPage,
    SubjectCount,
    GuideCount,
    GradeCount,
    RankCount
  },
  data() {
    return {
      activeName2: "first"
    };
  },
  
  created() {
    this.orgType = this.$store.state.user.userInfo.orgType;
    this.orgId = this.$store.state.user.userInfo.orgId;
    this.$store.dispatch("GetNowYear");
    //this.activeName2 = this.$route.query.tabName || "first";
    // this.getSchoolList();
  },
  methods: {
    
    handleClick(tab, event) {
      // this.changeSchool = !this.changeSchool;
      $ (window).unbind ('scroll');   //解除滚动事件
      //this.$router.push({name: this.$route.name, query: {tabName: tab.name}});
      // if (tab.name == "second") {
      //   this.scrollTable("#secondTable .el-table__header-wrapper");
      // }
      // if (tab.name == "first") {
      //   this.getSchoolList();
      // } else {
      //   this.findItem1();
      // }
    }
    
    
  },
  mounted() {
    //this.getInfo();
    
  }
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.dashboard-container {
  font-family: "微软雅黑";
}
.home-p {
  width: 100%;
  border-bottom: 1px solid #eee;
  line-height: 1.6em;
  font-size: 14px;
}
.right {
  float: right;
  display: inline;
}
.table-all {
  margin-top: 20px;
}
// td.time-color {
//   background-color: red;
// }
</style>
