<template>
<master-page title="学校开出情况">
    <el-button class="pull-right main-return" type="text" @click="returnBefore">返回</el-button>
    <div class="dashboard-container">

      <div class="table-div conditSchool">
        <el-table :data="list"  border fit highlight-current-row style="width: 100%" ref="editTable">
          <el-table-column  prop="subject" align="left" label="科目" min-width="100"></el-table-column>
          <el-table-column  prop="grade" align="left" label="年级" min-width="100"></el-table-column>
          <el-table-column  prop="amount" align="right" sortable label="开课次数" min-width="120"></el-table-column>
          <el-table-column  prop="rate" align="right" sortable label="班级平均开课数" min-width="200">
            <template slot-scope="scope">
              {{Number(scope.row.rate).toFixed(2)}}
            </template>
          </el-table-column>
          <el-table-column  prop="classDate" align="right" sortable label="最近上课时间" class-name="bgColor" min-width="180">
            <template slot-scope="scope">
              <span :class="scope.row.className">{{scope.row.classDate.slice(0,10)}}</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- <div v-show="listLoading" class="pagination-container">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="searchData.page" :page-sizes="pages.sizes"
            :page-size="searchData.size" layout="total, sizes, prev, pager, next, jumper" :total="pages.total">
          </el-pagination>
        </div> -->
      </div>
    </div>
</master-page>
</template>

<script>
import MasterPage from "views/layout/MasterPage";
import { mapGetters } from "vuex";
import { getDetailCondit } from "api/count";
import {scrollTable} from "utils/index"
export default {
  name: "conditSchool",
  components: { MasterPage },
  data() {
    return {
      listLoading: true,
      list: null,
      checkList: [],
      pages: {
        total: 1,
        sizes: [10, 20, 30]
      },
      searchData: {
        unitId: ""
      },
      activeName2: "first",
      chartData: [],
      dataNum: [],
      download: {
        token: this.$store.getters.token,
        url:
          this.$store.getters.objApi.BASE_API + "/api/report/open-schoolExcel"
      }
    };
  },
  created() {
    this.searchData.unitId = this.$route.params.id;
    this.getList();
  },
  methods: {
    getList() {
      // 获取表格数据
      getDetailCondit(this.searchData).then(res => {
        this.list = res;
        var that = this;

        setTimeout(function() {
          //设置背景色
          $("td.bgColor").each(function(index, element) {
            var classDate = Date.parse(new Date(that.list[index].classDate));
            var newDate = new Date();
            var days = Math.floor((newDate - classDate) / 86400000);
            if (days < 20) {
              $(element).css("background-color", "");
            } else if (days < 30) {
              $(element).css("background-color", "#ffdbdb");
            } else if (days < 40) {
              $(element).css("background-color", "#ffb6b6");
            } else if (days < 50) {
              $(element).css("background-color", "#ff9292");
            } else if (days < 60) {
              $(element).css("background-color", "#ff6d6d");
            } else {
              $(element).css("background-color", "#ff4949");
            }
          });
        }, 200);
      });
    },
    getInfo() {},
    handleSizeChange(val) {
      // 显示多少页
      this.searchData.page = 1;
      this.searchData.size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      // 点击页数
      this.searchData.page = val;
      this.getList();
    },
    returnBefore() {
      this.$router.push({ path: "/rankWarn" });
    }
  },
  mounted() {
    scrollTable('.conditSchool');
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
