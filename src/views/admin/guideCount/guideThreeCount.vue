<template>
  <master-page title="目录标准管理">
		<div class="filter-container">
      <div class="table-div guideTreeCount">
        <el-table :data="list" fit highlight-current-row style="width: 100%" ref="editTable">
          <el-table-column prop="unitName" label="学校名称" min-width="200" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="gradeName" label="年级" min-width="80" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="className" label="班级" min-width="100" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="isDone" label="是否已做" min-width="140" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{['否','是'][scope.row.isDone]}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
		</div>
  </master-page>
</template>

<script>
import { getGuideThreeClass } from "api/count";
import MasterPage from "views/layout/MasterPage";
import {scrollTable} from "utils/index"
export default {
  name: "guideCount",
  components: { MasterPage },
  data() {
    return {
      listLoading: false,
      searchData: {
        catalogueId: null,
        unitId:null,
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
    this.searchData.unitId = this.$route.params.unitId;
    this.searchData.termYear = this.$route.query.year;
    this.getList();
  },
  methods: {
    getList() {
      getGuideThreeClass(this.searchData).then(res => {
        this.list = res;
      });
    }
  },
  mounted() {
    scrollTable('.guideTreeCount')
  }
};
</script>
