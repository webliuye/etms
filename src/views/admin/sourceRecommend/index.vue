<template>
	<div class="source-container">
		<div class="search-select">
			<el-button type="primary" icon="el-icon-plus" @click="addSource">添加资源</el-button>
		</div>
		<div class="table-div srcRecommend">
			<el-table :data="list" fit highlight-current-row style="width: 100%" ref="editTable">
				<el-table-column prop="subjectName" label="学科" min-width="80"></el-table-column>
				<el-table-column prop="name" label="资源名称" min-width="160" show-overflow-tooltip></el-table-column>
				<el-table-column label="资源类别" min-width="100" show-overflow-tooltip>
					<template slot-scope="scope">
              <span v-if="scope.row.resourceType=='RS_TYPE_PLAN'">教案</span>
              <span v-if="scope.row.resourceType=='RS_TYPE_SIM'">仿真实验</span>
              <span v-if="scope.row.resourceType=='RS_TYPE_VIDEO'">视频</span>
              <span v-if="scope.row.resourceType=='RS_TYPE_COURSEWARE'">课件</span>
              <span v-if="scope.row.resourceType=='RS_TYPE_QUESTION'">试题</span>
          </template>
				</el-table-column>
				<el-table-column label="推荐级别" min-width="100" align="center">
					<template slot-scope="scope">
						<el-select v-model="scope.row.recomLevel" placeholder="请选择级别" @change="changeState(scope.row)">
							<el-option v-for="(item,index) in level" :key="index" :label="item" :value="item">{{(item==1)? item+'  (推荐级别低)': item }}</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="100" align="center">
					<template slot-scope="scope">
						<a href='javascript:;' class ="el-button--text" @click="deleteSource(scope.row)">取消推荐</a>
					</template>
				</el-table-column>
			</el-table>
			<div v-show="!listLoading" class="pagination-container">
        <Pagination :pages="pages" :searchData="searchData" @getTableData="getList"></Pagination>
      </div>
		</div>
		<el-dialog :title="orderTitle" :visible.sync="dialogRevise" :modal-append-to-body="false">
			<div class="search-select">
				<div class="fr">
          <el-input
            placeholder="资源名称"
            v-model="sourceData.sourceName">
            <i
            class="el-icon-search el-input__icon"
            slot="suffix"
            @click="findItem">
            </i>
          </el-input>
        </div>
			</div>
			<div class="table-div">
				<el-table :data="sourceList" fit highlight-current-row style="width: 100%"  ref="editTable1">
					<el-table-column prop="subjectName" label="学科" min-width="80"></el-table-column>
					<el-table-column prop="name" label="资源名称" min-width="160" show-overflow-tooltip></el-table-column>
					<el-table-column label="资源类别" min-width="100" show-overflow-tooltip>
						<template slot-scope="scope">
                  <span v-if="scope.row.resourceType=='RS_TYPE_PLAN'">教案</span>
              <span v-if="scope.row.resourceType=='RS_TYPE_SIM'">仿真实验</span>
              <span v-if="scope.row.resourceType=='RS_TYPE_VIDEO'">视频</span>
              <span v-if="scope.row.resourceType=='RS_TYPE_COURSEWARE'">课件</span>
              <span v-if="scope.row.resourceType=='RS_TYPE_QUESTION'">试题</span>
            </template>
					</el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <a href='javascript:;' class ="el-button--text" @click="recommedSource(scope.row)">推荐</a>
            </template>
          </el-table-column>
				</el-table>
				<div v-show="!sourceLoading" class="pagination-container">
          <Pagination :pages="pages2" :searchData="sourceData" @getTableData="findItem"></Pagination>
	      </div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import { getLocalListData, recommendSource } from "api/source";
import Pagination from "views/components/page/pagination";
import { scrollTable } from 'utils/index'
export default {
  name: "sourceRecommend",
  components: { Pagination },
  data() {
    return {
      list: null,
      sourceList: null,
      listLoading: false,
      sourceLoading: false,
      dialogRevise: false,
      orderTitle: "资源查找",
      pages: {
        total: 1,
        sizes: [10, 20, 30, 50]
      },
      pages2: {
        total: 1,
        sizes: [10, 20, 30, 50]
      },
      searchData: {
        page: 1,
        size: 50,
        recommend: "true"
      },
      sourceData: {
        page: 1,
        size: 10,
        sourceName: "",
        status: "3",
        recommend: "false"
      },
      level: 5,
      selectList: null
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getLocalListData(this.searchData).then(res => {
        this.list = res.data;
        this.pages.total = res.total;
        if (this.pages.total > this.searchData.size) {
          this.listLoading = false;
        }
      });
    },
    addSource() {
      this.dialogRevise = true;
      this.findItem();
    },
    deleteSource(row) {
      this.$confirm("你确认要取消推荐吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        recommendSource({
          resourceId: row.resourceId,
          recomLevel: 0
        }).then(res => {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getList();
        });
      });
    },
    // handleSizeChange(val) { // 显示多少页
    //      this.searchData.size = val;
    //      this.getList();
    //    },
    //    handleCurrentChange(val) {  // 点击页数
    //      this.searchData.page = val;
    //      this.getList();
    //    },
    //    sizeChange(val) { // 显示多少页
    //      this.sourceData.size = val;
    //      this.findItem();
    //    },
    //    currentChange(val) {  // 点击页数
    //      this.sourceData.page = val;
    //      this.findItem();
    //    },
    changeState(row) {
      recommendSource(row).then(res => {
        this.$message({
          message: "修改成功",
          type: "success"
        });
      });
    },
    findItem() {
      this.sourceLoading = true;
      getLocalListData(this.sourceData).then(res => {
        this.sourceList = res.data;
        this.pages2.total = res.total;
        if (this.pages2.total > this.sourceData.size) {
          this.sourceLoading = false;
        }
      });
    },
    recommedSource(row) {
      this.$confirm("你确认要推荐此实验吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          row.recomLevel = 5;
          recommendSource(row).then(res => {
            this.dialogRevise = false;
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.getList();
          });
        })
        .catch(() => {});
    },
    changeSource() {
      const ids = [];
      if (!this.selectList || this.selectList.length < 1) {
        this.$message({
          message: "请选择选择需要推荐的实验！",
          type: "warning"
        });
        return false;
      }
      for (let i = 0; i < this.selectList.length; i++) {
        ids[i] = this.selectList[i].resourceId;
      }
      this.$confirm("你确认要推荐此实验吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var data = this.selectList[0];
          data.recomLevel = 5;
          console.log(data);
          return;
          recommendSource(data).then(res => {
            this.dialogRevise = false;
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.getList();
          });
        })
        .catch(() => {});
    },
    selectChange(selection) {
      this.selectList = selection;
    }
  },
  mounted() { scrollTable('.srcRecommend'); }
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>

</style>
