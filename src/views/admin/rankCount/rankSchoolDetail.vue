<template>
	<master-page title="学校开出率年级统计详情">
		<div class="filter-container">
      <div class="table-div rankschoolDetail">
      	<el-table :data="list" border fit highlight-current-row style="width: 100%;" ref="editTable" class="table-all">
      		<el-table-column  prop="unitName" label="学校" min-width="160" show-overflow-tooltip></el-table-column>
      		<el-table-column  prop="gradeName" label="年级" min-width="140" show-overflow-tooltip></el-table-column>
          <el-table-column  prop="subjectName" label="学科" align="center" min-width="70" show-overflow-tooltip>
            <template slot-scope="scope">
              <a href='javascript:;' class ="el-button--text" @click="goSchoolDetail(scope.row)">{{scope.row.subjectName}}</a>
            </template>
          </el-table-column>
      		<el-table-column  align="center" label="分组">
      			<el-table-column  prop="groupMustNumber" align="right" label="应开" min-width="74"></el-table-column>
      			<el-table-column  prop="groupFactNumber" align="right" label="实开" min-width="74"></el-table-column>
      			<el-table-column  prop="groupRate" align="right" label="完成率" min-width="74">
      				<template slot-scope="scope">
      					<span>{{scope.row.groupRate | numberTrans}}</span>
      				</template>
      			</el-table-column>
            <el-table-column  prop="groupStatus" align="center" label="达标" min-width="74">
              <template slot-scope="scope">
                <span>{{scope.row.groupStatus?"是":"否"}}</span>
              </template>
            </el-table-column>
      		</el-table-column>
      		<el-table-column  align="center" label="演示">
            <el-table-column  prop="demoMustNumber" align="right" label="应开" min-width="74"></el-table-column>
            <el-table-column  prop="demoFactNumber" align="right" label="实开" min-width="74"></el-table-column>
            <el-table-column  prop="demo" align="right" label="完成率" min-width="74">
              <template slot-scope="scope">
                <span>{{scope.row.demoRate | numberTrans}}</span>
              </template>
            </el-table-column>
            <el-table-column  prop="demoStatus" align="center" label="达标" min-width="74">
              <template slot-scope="scope">
                <span>{{scope.row.demoStatus?"是":"否"}}</span>
              </template>
            </el-table-column>
          </el-table-column>
      	</el-table>
      </div>
		</div>
	</master-page>
</template>

<script>
import MasterPage from "views/layout/MasterPage";
import { getSchoolDetailOpenCount } from "api/count";
import {scrollTable} from "utils/index"
export default {
  name: "rankCount",
  components: { MasterPage },
  data() {
    return {
      searchData: {
        termYear: null,
        unitName: "",
        unitId: ""
      },
      list: null
    };
  },
  created() {
    this.searchData.termYear = this.$route.query.year;
    this.searchData.unitId = this.$route.params.id;
    this.searchData.section = this.$route.params.sectionId;
    this.getList();
  },
  methods: {
    getList() {
      getSchoolDetailOpenCount(this.searchData).then(res => {
        console.log(res);
        this.list = res.lists;
      });
    },
    goSchoolDetail(row) {
      this.$router.push({
        name: "RankSubjectDetail",
        params: {id: this.searchData.unitId},
        query: { year: this.searchData.termYear, subjectId: row.subjectId, gradeId: row.gradeId }
      });
    }
  },
  mounted() { scrollTable('.rankschoolDetail') }
};
</script>
