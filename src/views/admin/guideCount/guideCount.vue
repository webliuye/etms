<template>
		<div class="filter-container">
			<div class="search-select">
        <div class="fr">
          <el-input
            placeholder="实验名称"
            v-model="searchData.catalogueName">
            <i
            class="el-icon-search el-input__icon"
            slot="suffix"
            @click="getList">
            </i>
          </el-input>
        </div>
        <div class="fr selectwidth">
          <TermSelect @changeTerm="changeTerm"></TermSelect>
        </div>
        <div class="fr selectwidth">
          <GradeSelect :subject="searchData.subject" @changeGrade="changeGrade"></GradeSelect>
        </div>
        <div class="fr selectwidth">
          <SubjectSelect  @changeSubject="changeSubject"></SubjectSelect>
        </div>
        <div class="fr selectwidth">
          <YearSelect @changeYear="changeYear"></YearSelect>
        </div>
      </div>
      <div class="table-div" id="fourthTable">
        <el-table :data="list" fit highlight-current-row style="width: 100%" ref="editTable">
          <el-table-column prop="catalogueName" label="实验名称" min-width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              <a href='javascript:;' @click="goDetail(scope.row)" class="el-button--text">{{scope.row.catalogueName}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="subjectName" label="科目" min-width="80" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="gradeName" label="年级" min-width="100" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="oneTheme" label="章节" min-width="140" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="type" label="类型" align="center" min-width="100" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="mustNumber" label="应开数" align="right" min-width="80" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="factNumber" label="实开数" align="right" min-width="80" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="factNumber" label="完成率" align="right" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
                <span>{{scope.row.openRate | numberTrans}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
          <Pagination :pages="pages" :searchData="searchData" @getTableData="getList"></Pagination>
        </div>
      </div>
		</div>
</template>

<script>
import { getGuideOpenCount } from "api/count";
import YearSelect from "views/components/select/yearSelect";
import TermSelect from "views/components/select/termSelect";
import SubjectSelect from "views/components/select/subjectSelect";
import GradeSelect from "views/components/select/gradeSelect";
import Pagination from "views/components/page/pagination";
import { scrollTable } from 'src/utils';
export default {
  name: "guideCount",
  components: { YearSelect, TermSelect, SubjectSelect, GradeSelect, Pagination },
  data() {
    return {
      listLoading: false,
      searchData: {
        catalogueName: null,
        page: 1,
        size: 50,
        subject: null,
        gradeId: null,
        termYear: null,
        term: null
      },
      pages: {
        total: null,
        sizes: [10, 20, 30, 50]
      },
      list: null
    };
  },
  created() {
    this.getList();
  },
  methods: {
    goDetail(row) {
      this.$router.push({ name: 'GuideTwoCount', params: {id: row.catalogueId}, query: {year: this.searchData.termYear} });
    },
    getList() {
      this.listLoading = true;
      getGuideOpenCount(this.searchData)
        .then(res => {
          this.list = res.data;
          this.pages.total = res.total;
          if (this.pages.total > this.searchData.size) {
            this.listLoading = false;
          }
        })
        .catch(err => {
          this.listLoading = false;
        });
    },
    changeItem(s, t) {
      if (s.subjectId == "1") {
        t.subjectData.push(s);
        t.subLength++;
      } else if (s.subjectId == "2") {
        t.physicsData.push(s);
        t.phyLength++;
      } else if (s.subjectId == "3") {
        t.chemistryData.push(s);
        t.cheLength++;
      } else if (s.subjectId == "4") {
        t.biologyData.push(s);
        t.bioLength++;
      }
    },
    changeSubject(subject) {
      this.searchData.subject = subject;
      this.searchData.page = 1;
      this.getList();
    },
    changeGrade(grade) {
      this.searchData.gradeId = grade;
      this.searchData.page = 1;
      this.getList();
    },
    // handleSizeChange(val) {
    //     this.searchData.size = val;
    //     this.getList();
    // },
    // handleCurrentChange(val) {
    //     this.searchData.page = val;
    //     this.getList();
    // },
    changeYear(year) {
      this.searchData.termYear = year;
      this.searchData.page = 1;
      this.getList();
    },
    changeTerm(term) {
      this.searchData.term = term;
      this.searchData.page = 1;
      this.getList();
    }
  },
  mounted() {
    scrollTable(null, "#fourthTable .el-table__header-wrapper");
  }
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.table-in2 {
  border: 1px solid #eee;
  box-sizing: border-box;
  width: 100%;
  line-height: 36px;
  font-size: 12px;
  text-align: center;
  width: 100%;
  border-collapse: collapse;
  thead {
    background-color: #f4f4f4;
  }
  td {
    border: 1px solid #eee;
    text-align: center;
    padding: 2px 8px;
  }
}
</style>
