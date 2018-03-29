<template>
  <master-page title="资源使用统计">
    <div class="dashboard-container">
      <div class="version-div">
        <div class="left-tree" style="max-height:640px;">
          <SourceTree @changeCode="changeCode"></SourceTree>
        </div>
      </div>
      <div class="right-content">
          <div class="search-select">
            <el-button type="primary" icon="el-icon-plus" @click="addSource">添加资源</el-button>
            <el-button type="primary" @click="addMoreSource">批量上架</el-button>
            <el-button type="primary" @click="changeSource">批量下架</el-button>
            <div class="fr">
              <el-input
                placeholder="资源名称"
                v-model="searchData.sourceName">
                <i
                class="el-icon-search el-input__icon"
                slot="suffix"
                @click="findItem">
                </i>
              </el-input>
            </div>
            <div class="fr selectwidth">
              <el-select v-model="searchData.status" clearable placeholder="资源状态" @change="findItem">
                <el-option value="0" label="待转码"></el-option>
                <el-option value="1" label="已转码"></el-option>
                <el-option value="2" label="转码失败"></el-option>
                <el-option value="3" label="已上架"></el-option>
                <el-option value="4" label="已下架"></el-option>
              </el-select>
            </div>
            <div class="fr selectwidth">
              <el-select v-model="searchData.resourceType" clearable placeholder="资源类别" @change="findItem">
                <el-option
                  v-for="(item,index) in allSourceType"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="table-div localSource">
            <el-table :data="list" fit highlight-current-row style="width: 100%" ref="editTable" :row-class-name="tableRowClassName" @selection-change="selectChange">
              <el-table-column type="selection">  </el-table-column>
              <el-table-column prop="name" label="资源名称" min-width="140" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="resourceType" label="资源类别" min-width="88" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-for="(item,index) in allSourceType" v-if="scope.row.resourceType == item.value" :key="index">{{item.label}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="resourceType" label="资源来源" min-width="88" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.url[0]=='/'">本地上传</span>
                    <span v-if="scope.row.url[0]!='/'">第三方地址</span>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" align="center" label="上传时间" min-width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.createTime.slice(0,10)}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="createByName" label="上传者" min-width="80" show-overflow-tooltip></el-table-column>
              <el-table-column prop="state" align="center" label="状态" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-if="scope.row.url[0]=='/'">{{['待转码','已转码','转码失败','已上架','已下架'][scope.row.status]}}</span>
                  <span v-if="scope.row.url[0]!='/'">无转码</span>
                </template>
              </el-table-column>
              <el-table-column prop="amount" label="操作" width="160" show-overflow-tooltip>
                <template slot-scope="scope">
                  <a href='javascript:;' class ="el-button--text" v-if="scope.row.status!='3'" @click="editSource(scope.row)">编辑</a>
                  <a href='javascript:;' class ="el-button--text" v-if="scope.row.status=='4' || scope.row.status=='1'" @click="groundSource(scope.row)">上架</a>
                  <a href='javascript:;' class ="el-button--text" v-if="(scope.row.status=='0' || scope.row.status=='2') && scope.row.url[0]!='/'" @click="groundSource(scope.row)">上架</a>
                  <a href='javascript:;' class ="el-button--text" v-if="scope.row.status=='3'" @click="underSource(scope.row)">下架</a>
                  <a href='javascript:;' class ="el-button--text" v-if="scope.row.status!='3'" @click="deleteSource(scope.row)">删除</a>
                  <a href='javascript:;' class ="el-button--text" v-if="scope.row.url[0]=='/' && scope.row.status != '0' && scope.row.status != '2'" @click="toDetail(scope.row)">预览</a>
                </template>
              </el-table-column>
            </el-table>
            <div v-show="!listLoading" class="pagination">
              <Pagination :pages="pages" :searchData="searchData" @getTableData="getList"></Pagination>
              <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="searchData.page" :page-sizes="pages.sizes"
                :page-size="searchData.size" layout="total, sizes, prev, pager, next, jumper" :total="pages.total">
              </el-pagination> -->
            </div>
          </div>
      </div>
    </div>
  </master-page>
</template>

<script>
import MasterPage from "views/layout/MasterPage";
import SourceTree from "views/components/sourceTree";
import { mapGetters } from "vuex";
import { getLocalListData, reviseSource, reviseManySource } from "api/source";
import Pagination from "views/components/page/pagination";
import { scrollTable } from 'utils/index'
export default {
  name: "sourceCount",
  components: { MasterPage, SourceTree, Pagination },
  data() {
    return {
      list: null,
      listLoading: false,
      pages: {
        total: 1,
        sizes: [10, 20, 30, 50]
      },
      searchData: {
        page: 1,
        size: 50,
        resourceType: null,
        status: null
      },
      formData: {
        textbookCode: null,
        standardCode: null
      },
      catalogueId: 0,
      orgType: this.$store.state.user.userInfo.orgType,
      orgId: this.$store.state.user.userInfo.orgId,
      treeData: [],
      selectList: null
    };
  },
  computed: {
    ...mapGetters(["allSourceType"])
  },
  created() {
    this.$store.dispatch("GetAllSourceType");
    if (this.$store.state.source.currentSource) {
      var tData = this.$store.state.source.currentSource;
      this.searchData = jQuery.extend(this.searchData, this.formData, tData);
      if (tData.type == 5) {
        this.catalogueId = tData.standardCode;
      }
    }
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
    findItem() {
      this.getList();
    },
    changeCode(data, nodeData) {
      this.catalogueId = 0;
      if (data.type == 5) {
        this.catalogueId = data.standardCode;
      }
      this.searchData = jQuery.extend(this.searchData, this.formData, data);
      this.getList();
    },
    addSource() {
      this.$router.push({
        name: "AddSource",
        params: { catalogueId: this.catalogueId, isEdit: false }
      });
    },
    editSource(row) {
      //编辑
      this.$router.push({
        name: "EditSource",
        params: {
          catalogueId: row.catalogueId,
          textbookCode: row.textbookCode,
          resourceId: row.resourceId,
          isEdit: true
        }
      });
    },
    changeSource() {
      const ids = [];
      for (let i = 0; i < this.selectList.length; i++) {
        var selectValue = this.selectList[i];
        if (selectValue.status == 3) {
          ids.push(selectValue.resourceId);
        }
      }
      if (ids.length < 1) {
        this.$message({
          message: "请选择需要下架的实验！",
          type: "warning"
        });
        return false;
      }
      this.$confirm("你确认要下架这些实验吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        var data = {};
        data.status = "invalid";
        data.resourceIds = ids.join(",");
        reviseManySource(data)
          .then(res => {
            this.$message({
              message: "下架成功",
              type: "success"
            });
            this.getList();
          })
          .catch(err => {
            this.$message({
              message: "下架失败,请重新选择",
              type: "error"
            });
          });
      });
    },
    addMoreSource() {
      const ids = [];
      for (let i = 0; i < this.selectList.length; i++) {
        var selectValue = this.selectList[i];
        if (selectValue.status == 1 || selectValue.status == 4) {
          ids.push(selectValue.resourceId);
        }
      }
      if (ids.length < 1) {
        this.$message({
          message: "请选择需要上架的实验！",
          type: "warning"
        });
        return false;
      }
      this.$confirm("你确认要上架这些实验吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        var data = {};
        data.status = "valid";
        data.resourceIds = ids.join(",");
        reviseManySource(data)
          .then(res => {
            this.$message({
              message: "上架成功",
              type: "success"
            });
            this.getList();
          })
          .catch(err => {
            this.$message({
              message: "上架失败,请重新选择",
              type: "error"
            });
          });
      });
    },
    selectChange(selection) {
      this.selectList = selection;
      console.log(selection);
    },
    deleteSource(row) {
      this.$confirm("你确定要删除[" + row.name + "]?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        reviseSource({
          resourceId: row.resourceId,
          status: "remove"
        }).then(res => {
          this.$message({
            message: "删除成功！",
            type: "success"
          });
          this.getList();
        });
      });
    },
    groundSource(row) {
      this.$confirm("你确定要上架[" + row.name + "]?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        reviseSource({
          resourceId: row.resourceId,
          status: "valid"
        }).then(res => {
          this.$message({
            message: "操作成功！",
            type: "success"
          });
          this.getList();
        });
      });
    },
    // handleSizeChange(val) { // 显示多少页
    //   this.searchData.size = val;
    //   this.getList();
    // },
    // handleCurrentChange(val) {  // 点击页数
    //   this.searchData.page = val;
    //   this.getList();
    // },
    underSource(row) {
      this.$confirm("你确定要下架[" + row.name + "]?下架资源只能通过状态栏搜索", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        reviseSource({
          resourceId: row.resourceId,
          status: "invalid"
        }).then(res => {
          this.$message({
            message: row.name + "下架成功，如要查看已下架资源，请在资源列表中过滤已下架状态查看相关资源",
            type: "success"
          });
          this.getList();
        });
      });
    },
    toDetail(item) {
      this.$router.push({
        name: "SourcePreview",
        params: { id: item.resourceId }
      });
    },
    tableRowClassName(row) {
      if (row.status == "4") {
        return "positive-row";
      }
    }
  },
  mounted() {
    scrollTable('.localSource');
    this.getList();
  }
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.table-in {
  border: none;
  box-sizing: border-box;
  width: 100%;
  td {
    border: 1px solid #ccc;
    text-align: center;
  }
}
.left-tree {
  top: 0;
}
.pagination {
  margin-top: 0px;
  padding: 5px 0px;
  background: #fff;
  // border:1px solid #d3dce6;
  text-align: center;
}
</style>
