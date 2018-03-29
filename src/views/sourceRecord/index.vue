<template>
  <master-page title="开通记录">
    <div class="sourceRecord">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="packName"label="开通资源包" min-width="180">
            <template slot-scope="scope">
              <a href='javascript:;' class ="el-button--text" @click="goDetail(scope.row)">{{scope.row.packName}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="startDate" label="开通时间" min-width="180"></el-table-column>
          <el-table-column prop="endDate" label="截止时间" min-width="180"></el-table-column>
          <el-table-column prop="duration" label="有效期" min-width="180"></el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="searchData.page" :page-sizes="pages.sizes"
              :page-size="searchData.size" layout="total, sizes, prev, pager, next, jumper" :total="pages.total">
            </el-pagination>
          </div>
    </div>
  </master-page>
</template>

<script>
import MasterPage from "../layout/MasterPage";
import { getSrcRecord } from "api/source";
import { scrollTable } from 'utils/index'
export default {
  components: {
    MasterPage
  },
  data() {
    return {
      tableData: [],
      listLoading: true,
      list: null,
      searchData: {
        page: 1,
        size: 50
      },
      pages: {
        total: 1,
        sizes: [10, 20, 30, 50]
      }
    };
  },
  created() {
      this.getList();
  },
  methods: {
    getList() {
      getSrcRecord(this.searchData).then(res => {
        this.tableData=res.data;
        this.pages.total=res.total;
        this.listLoading = true;
        if (res.total > this.searchData.size) {
          this.listLoading = false;
        }
      });
    },
    goDetail(row) {
      this.$router.push({
        name: "sourceDetail",
        params: { id: row.packId }
      });
    },
    handleSizeChange(val) {
      this.searchData.size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.searchData.page = val;
      this.getList();
    }
  },
  mounted(){
    scrollTable('.sourceRecord');
  }
};
</script>

