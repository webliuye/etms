<template>
<master-page title="实验开出记录">
    <div class="dashboard-container">
      <div class="search-select">
        <div class="fr">
          <el-input
            placeholder="学校名称"
            v-model="searchData.unitName">
            <i
            class="el-icon-search el-input__icon"
            slot="suffix"
            @click="findItem">
            </i>
          </el-input>
        </div>
        <div class="fr selectwidth">
          <TypeSelect @changeType="changeType"></TypeSelect>
        </div>
        <div class="fr selectwidth">
          <GradeSelect :subject="searchData.subjectId"  @changeGrade="changeGrade"></GradeSelect>
        </div>
        <div class="fr selectwidth">
          <subjectSelect @changeSubject="changeSubject"></subjectSelect>
        </div>
        <div class="fr selectwidth">
          <YearSelect @changeYear="changeYear"></YearSelect>
        </div>
      </div>
      <div class="table-div openRecord">
        <el-table :data="list" fit highlight-current-row style="width: 100%;" ref="editTable">
          <el-table-column  prop="unitName" label="学校名称" min-width="150" show-overflow-tooltip sortable></el-table-column>
          <el-table-column  prop="name" label="实验名称" min-width="190" show-overflow-tooltip sortable></el-table-column>
          <el-table-column  prop="typeName" align="center" label="实验类型" min-width="88"></el-table-column>
          <el-table-column  prop="subjectName" align="center" label="科目" min-width="88" sortable></el-table-column>
          <el-table-column  prop="gradeName" align="center" label="年级" min-width="100"></el-table-column>
          <el-table-column  prop="classNames" label="班级" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column  prop="createDate" align="center" label="登记时间" min-width="160" sortable></el-table-column>
          <el-table-column prop="videoUrl" label="查看" width="160" :filters="filters" :filter-method="filterMethod" filter-placement="bottom-end">
            <template slot-scope="scope">
              <router-link class="el-button--text" :to="{name: 'OpenRecordDetail',params:{id:scope.row.courseId}}"><img src="../../../assets/img/user-log.png" class="img">日志</router-link>
              <a href='javascript:;' @click="play(scope.row.videoUrl)" class="player el-button--text" v-if="scope.row.videoUrl"><img src="../../../assets/img/user-video.png" class="img">视频</a>
            </template>
          </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
          <Pagination :pages="pages" :searchData="searchData" @getTableData="getList"></Pagination>
        </div>
      </div>

    </div>
      <el-dialog :visible.sync="dialogBook"  top="10%"  @close="closeDialog">
        <Nvideo :src="videoUrl" v-if="dialogBook"   ></Nvideo>
      </el-dialog>

</master-page>
</template>

<script>
import CitySelect from "views/components/select/citySelect";
import CountySelect from "views/components/select/countySelect";
import SchoolSelect from "views/components/select/schoolSelect";
import SubjectSelect from "views/components/select/subjectSelect";
import GradeSelect from "views/components/select/gradeSelect";
import TypeSelect from "views/components/select/typeSelect";
import CourseSelect from "views/components/select/courseSelect";
import YearSelect from "views/components/select/yearSelect";
import Pagination from "views/components/page/pagination";
import Nvideo from "views/components/newVideo";
import { mapGetters } from "vuex";
import { getOpenRecord, getInfo } from "api/count";
import MasterPage from "views/layout/MasterPage";
import { getLogDetail } from "api/log";
import { scrollTable } from 'utils/index'
export default {
  name: "openRecord",
  components: {
    CitySelect,
    CountySelect,
    SchoolSelect,
    SubjectSelect,
    GradeSelect,
    TypeSelect,
    CourseSelect,
    MasterPage,
    YearSelect,
    Nvideo,
    Pagination
  },
  data() {
    return {
      listLoading: false,
      list: null,
      checkList: [],
      pages: {
        total: 1,
        sizes: [10, 20, 30, 50]
      },
      searchData: {
        termYear: null,
        subjectId: "",
        name: null,
        type: null,
        page: 1,
        size: 50,
        unitName: ""
      },
      filters:[
        { text: '日志', value: '日志' },
        { text: '视频', value: '视频' }
      ],
      chartData: [],
      dataNum: [],
      orgType: "",
      orgId: "",
      videoUrl: "",
      dialogBook: false
    };
  },
  created() {
    this.orgType = this.$store.state.user.userInfo.orgType;
    this.orgId = this.$store.state.user.userInfo.orgId;
    this.getList();
  },
  methods: {
    filterMethod(value, row) {
      if(value == '视频'){
        return row.videoUrl;
      }else{
        return !row.videoUrl;
      }
    },
    getList() {
      // 获取表格数据
      this.listLoading = true;
      getOpenRecord(this.searchData).then(res => {
        this.list = res.data;
        this.pages.total = res.total;
        if (this.pages.total > this.searchData.size) {
          this.listLoading = false;
        }
      });
    },
    detail(row) {
      getLogDetail(row.courseId).then(res => {});
    },
    play(row) {
      this.dialogBook = true;
      this.videoUrl = row;
    },
    closeDialog() {
      this.videoUrl = "";
    },
    // handleSizeChange(val) { // 显示多少页
    //   this.searchData.size = val;
    //   this.getList();
    // },
    // handleCurrentChange(val) {  // 点击页数
    //   this.searchData.page = val;
    //   this.getList();
    // },
    changeYear(year) {
      this.searchData.termYear = year;
      this.getList();
    },
    changeSubject(subject) {
      this.searchData.subjectId = subject;
      this.getList();
    },
    changeGrade(grade) {
      this.searchData.gradeId = grade;
      this.getList();
    },
    changeType(type) {
      this.searchData.type = type;
      this.getList();
    },
    changeCourse(course) {
      this.searchData.courseMode = course;
      this.getList();
    },
    findItem() {
      this.getList();
    }
  },
  mounted() {
    this.orgType = this.$store.state.user.userInfo.orgType;
    scrollTable('.openRecord');
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
.player {
  cursor: pointer;
}
.dialogBook {
  height: 100%;
  top: 0;
}
.video {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  max-height: 100%;
}
.search-select {
  padding-top: 8px;
}
.img {
  padding-right: 4px;
  vertical-align: middle;
}
</style>
