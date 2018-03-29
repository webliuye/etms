<template>
    <div class="filter-container recordManage">
      <div class="search-select">
        <el-button type="primary" icon="el-icon-download" @click="handleDownload" :disabled="downBlooean">{{downName}}</el-button>
        <div class="fr">
          <el-input placeholder="实验名称" v-model="searchData.name">
            <i
            class="el-icon-search el-input__icon"
            slot="suffix"
            @click="getList">
            </i>
          </el-input>
        </div>
        <div class="fr selectwidth">
          <TypeSelect @changeType="changeType"></TypeSelect>
        </div>
        <div class="fr selectwidth">
          <GradeSelect :subject="searchData.subjectId" @changeGrade="changeGrade"></GradeSelect>
        </div>
        <div class="fr selectwidth">
          <SubjectSelect  @changeSubject="changeSubject"></SubjectSelect>
        </div>
        <div class="fr selectwidth">
          <YearSelect @changeYear="changeYear"></YearSelect>
        </div>
      </div>
      <el-table :data="list" fit highlight-current-row style="width: 100%;">
        <el-table-column  prop="name" label="实验名称" min-width="160" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-html='scope.row.name'></span>
          </template>
        </el-table-column>
        <el-table-column  prop="typeName" align="center" label="实验类型" min-width="96"></el-table-column>
        <el-table-column  prop="subjectName" align="center" label="科目" min-width="80"></el-table-column>
        <el-table-column  prop="gradeName" align="center" label="年级" min-width="110" show-overflow-tooltip></el-table-column>
        <el-table-column  prop="className" label="班级" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column  prop="updateTime" align="center" label="上课时间" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.updateTime.slice(0,10)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isVideo" align="left" label="查看" width="160" :filters="filters" :filter-method="filterMethod" filter-placement="bottom-end">
          <template slot-scope="scope">
            <a href='javascript:;' style="padding-right:8px;" class ="el-button--text" @click="goDetail(scope.row)"><img src="../../../assets/img/user-log.png" class="img">日志</a>
            <a href='javascript:;' class ="el-button--text" v-if="scope.row.isVideo == 'true'"  @click="play(scope.row.videoUrl)"><img src="../../../assets/img/user-video.png" class="img">视频</a>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="!listLoading" class="pagination-container">
        <Pagination :pages="pages" :searchData="searchData" @getTableData="getList"></Pagination>
      </div>
      <el-dialog :visible.sync="dialogBook" top="10%"  @close="closeDialog">
        <Nvideo :src="videoUrl" v-if="dialogBook"></Nvideo>
      </el-dialog>
    </div>

</template>

<script>
import { mapGetters } from "vuex";
import { getRecordList } from "api/arrange";
import YearSelect from "views/components/select/yearSelect";
import SubjectSelect from "views/components/select/subjectSelect";
import GradeSelect from "views/components/select/gradeSelect";
import TypeSelect from "views/components/select/typeSelect";
import Nvideo from "views/components/newVideo";
import Pagination from 'views/components/page/pagination';
import { getRecord } from "api/count";
import { downloadLogs, downloadProgress, downloadZip } from "api/index";
import { scrollTable } from 'utils/index'
export default {
  components: {
    SubjectSelect,
    GradeSelect,
    TypeSelect,
    YearSelect,
    Nvideo,
    Pagination
  },
  data() {
    return {
      listLoading: false,
      list: null,
      searchData: {
        subjectId: null,
        gradeId: null,
        type: null,
        name: null,
        year: "",
        page: 1,
        size: 50
      },
      pages: {
        total: 1,
        sizes: [10, 20, 30, 50]
      },
      filters:[
        { text: '日志', value: '日志' },
        { text: '视频', value: '视频' }
      ],
      videoUrl: "",
      dialogBook: false,
      downBlooean:false,
      downName:'导出',
      downProgress:0,
      downToken:'',
      interval:null
    };
  },
  created() {
    this.getList();
  },
  watch: {
    downProgress() {
      if(this.downProgress == 100){
        clearInterval(this.interval);
        this.downProgress = 0;
        var link = document.createElement('a');
        link.href = this.$store.getters.objApi.BASE_API + '/api/courses/export/' + this.downToken + '/zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.downBlooean = false;
        this.downName = '导出';
      }
    }
  },
  methods: {
    filterMethod(value, row) {
      if(value == '视频'){
        return row.isVideo == 'true';
      }else{
        return row.isVideo == 'false';
      }
    },
    getList() {
      this.listLoading = true;
      getRecord(this.searchData)
        .then(response => {
          this.list = response.data;
          this.pages.total = response.total;
          if (this.pages.total > this.searchData.size) {
            this.listLoading = false;
          }
          if(this.pages.total == 0){
            this.downBlooean = true;
          }else{
            this.downBlooean = false;
          }
        })
        .catch(err => {
          this.listLoading = false;
        });
    },
    goDetail(row) {
      this.$router.push({
        name: "RecordViewDetail",
        params: { id: row.courseId }
      });
    },
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
    changeType(term) {
      this.searchData.typeId = term;
      this.getList();
    },
    play(row) {
      this.dialogBook = true;
      this.videoUrl = row;
    },
    closeDialog() {
      this.videoUrl = "";
    },

    // handleSizeChange(val) {
    //   this.searchData.size = val;
    //   this.getList();
    // },
    // handleCurrentChange(val) {
    //   this.searchData.page = val;
    //   this.getList();
    // },
    getDownProgress() {
      downloadProgress(this.downToken).then(res => {
        this.downProgress = res;
        this.downName = '正在导出' + res + '%';
      }).catch(error => {
        this.$message({
          message: '导出失败',
          type: 'warning'
        });
        clearInterval(this.interval);
      });
    },
    handleDownload() {
      this.downBlooean = true;
      downloadLogs(this.searchData).then(res => {
        if(!res){
          this.downBlooean = false;
          this.$message({
            message: '导出失败',
            type: 'warning'
          });
          return;
        }
        this.downName = '正在导出' + this.downProgress + '%';
        this.downToken = res;
        this.interval = setInterval(this.getDownProgress,1000);
      });
    }
  },
  mounted(){
    scrollTable('.recordManage');
  }
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.el-button--text {
  margin-right: 0;
}
.img {
  padding-right: 4px;
  vertical-align: middle;
}


</style>
