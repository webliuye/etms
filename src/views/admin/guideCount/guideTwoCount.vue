<template>
  <master-page title="目录标准管理">
		<div class="filter-container">
			<div class="search-select">
        <!-- <div class="fr">
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
          <YearSelect @changeYear="changeYear"></YearSelect>
        </div> -->
      </div>
      <div class="table-div guideTwocount">
        <el-table :data="list" fit highlight-current-row style="width: 100%" ref="editTable">
          <el-table-column prop="unitName" label="学校名称" min-width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              <a href='javascript:;' @click="goDetail(scope.row)" class="el-button--text">{{scope.row.unitName}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="mustNum" label="应开数" min-width="80" align="right" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="factNum" label="实开数" min-width="100" align="right" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="rate" label="开出率" min-width="140" align="right" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.rate | numberTrans}}</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- <div v-show="!listLoading" class="pagination-container">
          <Pagination :pages="pages" :searchData="searchData" @getTableData="getList"></Pagination>
        </div> -->
      </div>
		</div>
  </master-page>
</template>

<script>
import { getGuideTwoClass } from "api/count";
// import YearSelect from "views/components/select/yearSelect";
// import TermSelect from "views/components/select/termSelect";
import Pagination from "views/components/page/pagination";
import MasterPage from "views/layout/MasterPage";
import {scrollTable} from "utils/index"
export default {
  name: "guideCount",
  components: { MasterPage, Pagination },
  data() {
    return {
      listLoading: false,
      searchData: {
        catalogueId: null,
        termYear: null
      },
      pages: {
        total: null,
        sizes: [10, 20, 30, 50]
      },
      list: null
    };
  },
  created() {
    this.searchData.catalogueId = this.$route.params.id;
    this.searchData.termYear = this.$route.query.year;
    this.getList();
  },
  methods: {
    getList() {
      getGuideTwoClass(this.searchData).then(res => {
        this.list = res;
      });
    },
    goDetail(row) {
      this.$router.push({ name: 'GuideThreeCount', params: {id: this.searchData.catalogueId,unitId: row.unitId}, query: {year: this.searchData.termYear} });
    }
  },
  mounted() { scrollTable('.guideTwocount')}
};
</script>
