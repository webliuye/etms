<template>
<master-page title="实验开出记录">
     <div class="filter-container">
      <el-button class="pull-right main-returnA" type="text" @click="$router.go(-1)">返回</el-button>
    </div>
    <div class="dashboard-container">
      <div class="search-select">
        <div class="fr">
          <el-input
            placeholder="实验名称"
            v-model="searchData.courseName">
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
          <subjectSelect @changeSubject="changeSubject" ref="subsel"></subjectSelect>
        </div>
        <div class="fr selectwidth">
          <YearSelect @changeYear="changeYear"></YearSelect>
        </div>
      </div>
      <div class="table-div srcRecord">
        <el-table :data="list" fit highlight-current-row style="width: 100%;" ref="editTable">
          <el-table-column  prop="unitName" label="学校名称" min-width="150" show-overflow-tooltip sortable></el-table-column>
          <el-table-column  prop="name" label="实验名称" min-width="190" show-overflow-tooltip sortable></el-table-column>
          <el-table-column  prop="typeName" align="center" label="实验类型" min-width="88"></el-table-column>
          <el-table-column  prop="subjectName" align="center" label="科目" min-width="80" sortable></el-table-column>
          <el-table-column  prop="gradeName" align="center" label="年级" min-width="80"></el-table-column>
          <el-table-column  prop="classNames" label="班级" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column  prop="createDate" align="center" label="登记时间" min-width="160" sortable></el-table-column>
          <el-table-column align="center" label="查看" min-width="88">
            <template slot-scope="scope">
              <a href='javascript:;' @click="play(scope.row.videoUrl)" class="player el-button--text" v-if="scope.row.videoUrl"><img src="~assets/img/user-video.png" class="img">视频</a>
              <router-link class="el-button--text" v-if="!scope.row.videoUrl" :to="{name: 'SrcRecordDetail',params:{id:scope.row.courseId}}"><img src="~assets/img/user-log.png" class="img">日志</router-link>
            </template>
          </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="searchData.page" :page-sizes="pages.sizes"
            :page-size="searchData.size" layout="total, sizes, prev, pager, next, jumper" :total="pages.total">
          </el-pagination>
        </div>
      </div>

    </div>
      <el-dialog :visible.sync="dialogBook"  top="10%"  @close="closeDialog">
        <Nvideo :src="videoUrl" v-if="dialogBook"   ></Nvideo>
      </el-dialog>

</master-page>
</template>

<script>
    import SubjectSelect from 'views/components/srcSelect/subjectSelect';
    import GradeSelect from 'views/components/srcSelect/gradeSelect';
    import TypeSelect from 'views/components/srcSelect/typeSelect';
    import YearSelect from 'views/components/srcSelect/yearSelect';
    import Nvideo from "views/components/newVideo";
    import { mapGetters } from 'vuex';
    import { getTestopenData} from 'api/sourceIndex';
    import MasterPage from 'views/layout/MasterPage1';
    import {scrollTable} from "utils/index"
    export default {
      name: 'openRecord',
      components: { SubjectSelect, GradeSelect, TypeSelect, MasterPage, YearSelect,Nvideo},
      data() {
        return {
          listLoading: false,
          list: null,
          checkList:[],
          pages:{
            total:1,
            sizes:[10,20,30, 50]
          },
          searchData:{
            term_Year:null,
            subjectId:'',
            name:null,
            page:1,
            size:50,
            unitName:null,
            name:null,
            courseName:null
          },
          chartData:[],
          dataNum:[],
          videoUrl: '',
          dialogBook:false
        }
      },
      created() {
        this.getList();
      },
      methods : {
        getList() { // 获取表格数据
          this.listLoading = true;
          getTestopenData(this.searchData).then(res => {
            this.list = res.data;
            this.pages.total = res.total;
            if(this.pages.total > this.searchData.size){
              this.listLoading = false;
            }
          });
        },
        detail(row){
          getLogDetail(row.courseId).then(res => {
          })
        },
        play(row) {
          this.dialogBook = true;
          this.videoUrl = row;
        },
        closeDialog() {
          this.videoUrl = '';
        },
        handleSizeChange(val) { // 显示多少页
          this.searchData.size = val;
          this.getList();
        },
        handleCurrentChange(val) {  // 点击页数
          this.searchData.page = val;
          this.getList();
        },
        changeYear(year){
          this.searchData.term_Year = year;
          this.getList();
        },
        changeSubject(subject) {
          this.searchData.page=1;
          this.searchData.subjectId = subject;
          this.getList();
        },
        changeGrade(grade) {
           this.searchData.page=1;
          this.searchData.gradeId = grade;
          this.getList();
        },
        changeType(type) {
           this.searchData.page=1;
          this.searchData.type = type;
          this.getList();
        },
        changeCourse(course) {
           this.searchData.page=1;
          this.searchData.courseMode = course;
          this.getList();
        },
        findItem() {
          this.getList();
        }
      },
      mounted() {
        scrollTable('.srcRecord')
      }
    }
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.dashboard-container { font-family: '微软雅黑';
}
.home-p {
  width: 100%;
  border-bottom: 1px solid #e1e4e3;
  line-height: 1.6em;
  font-size: 14px;
}
.right { float: right; display: inline;}
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
