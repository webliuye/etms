<template>
	<master-page title="实验题库">
		<div class="dashboard-container">
			<div class="version-div">
        <div class="left-tree" style="max-height:640px;">
          <SourceTree @changeCode="changeCode" :lookAll="lookAll"></SourceTree>
        </div>
      </div>
      <div class="right-content">
      	<div class="search-select">
      		<el-button type="primary" class="fl" @click="addMoreProblem">批量上架</el-button>
          <el-button type="primary" class="fl" @click="changeProblem">批量下架</el-button>
          <el-button type="primary" icon="el-icon-upload2" class="fr" @click="upload">导入</el-button>
          <el-button type="primary" icon="el-icon-plus" class="fr" @click="addJudgeSelect">添加判断题</el-button>
          <el-button type="primary" icon="el-icon-plus" class="fr" @click="addMultiSelect">添加多选题</el-button>
          <el-button type="primary" icon="el-icon-plus" class="fr" @click="addSingleSelect">添加单选题</el-button>
          <el-button type="primary" icon="el-icon-plus" class="fr" @click="addSortSelect">添加排序题</el-button>
        </div>
        <div class="search-select">
        	<div class="fr">
            <el-input
              placeholder="根据题干搜索"
              v-model="searchData.questionName">
              <i
              class="el-icon-search el-input__icon"
              slot="suffix"
              @click="findItem">
              </i>
            </el-input>
          </div>
          <div class="fr selectwidth">
            <el-select v-model="searchData.status" clearable placeholder="题目状态" @change="findItem">
              <el-option value="0" label="未上架"></el-option>
              <el-option value="1" label="已上架"></el-option>
            </el-select>
          </div>
          <div class="fr selectwidth">
            <el-select v-model="searchData.isOwn" clearable placeholder="来源" @change="findItem">
              <el-option value="1" label="本地"></el-option>
              <el-option value="0" label="上级"></el-option>
            </el-select>
          </div>
          <div class="fr selectwidth">
            <el-select v-model="searchData.questionType" clearable placeholder="题型类别" @change="findItem">
              <el-option v-for="(item,index) in problemType" :value="item.value" :key="index" :label="item.label"></el-option>
            </el-select>
          </div>
        </div>
        <div class="table-div checkIndex">
        	<el-table :data="list" fit highlight-current-row style="width: 100%" ref="editTable" @selection-change="selectChange">
        		<el-table-column type="selection">  </el-table-column>
        		<el-table-column prop="stem" label="题干" min-width="180" show-overflow-tooltip>
              <template slot-scope="scope">
                {{(JSON.parse(scope.row.content)).stemContent}}
              </template>
            </el-table-column>
            <el-table-column prop="questionType" label="类型" min-width="88" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-for="(item,index) in problemType" :key="index" v-if="scope.row.questionType==item.value">{{item.label}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" align="center" label="来源" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{['上级','本地'][scope.row.isOwn]}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" align="center" label="状态" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{['未上架','已上架'][scope.row.status]}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="操作" width="176" show-overflow-tooltip>
            	<template slot-scope="scope">
            		<a href='javascript:;' v-if="scope.row.isOwn == 1 && scope.row.status != 1" class ="el-button--text" @click="editorTest(scope.row)">编辑</a>
                <a href='javascript:;' v-if="scope.row.isOwn == 1 && scope.row.status != 1" class ="el-button--text" @click="groundTest(scope.row)">上架</a>
                <a href='javascript:;' v-if="scope.row.isOwn == 1 && scope.row.status == 1" class ="el-button--text" @click="underTest(scope.row)">下架</a>
            		<a href='javascript:;' v-if="scope.row.isOwn == 1 && scope.row.status != 1" class ="el-button--text" @click="deleteTestList(scope.row.id)">删除</a>
            	</template>
            </el-table-column>
        	</el-table>
        	<div v-show="!listLoading" class="pagination">
            <Pagination :pages="pages" :searchData="searchData" @getTableData="getList"></Pagination>
          </div>
        </div>
      </div>
      <el-dialog title="导入试题" :visible.sync="dialogUpload"  width="30%">
         <el-upload class="upload-demo"
            ref="upload"
            :action="action"
            :multiple="false"
            :show-file-list="false"
            :headers="headers"
            :on-change="handleChange"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :before-upload="beforeAvatarUpload"
            :on-success="successFile"
            :on-error="failedFile">
          <el-button slot="trigger" size="small" type="primary">点击导入</el-button>
        </el-upload>
        <div class="el-upload__tip">只能导入word文档且大小不超过100MB。每次只能上传一个文件  </div>
        <a href="javascript:;" @click="downloadExl" class="el-button el-button--text" style="padding-left:0;">下载模板</a>
      </el-dialog>
		</div>
	</master-page>
</template>

<script>
import MasterPage from "views/layout/MasterPage";
import SourceTree from "views/components/sourceTree";
import Pagination from "views/components/page/pagination";
import {scrollTable} from "utils/index"
import {
  getTestProblemList,
  deleteTest,
  changeManyStatus,
  changeTestStatus
} from "api/test";
import { mapGetters } from "vuex";
export default {
  name: "questionBank",
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
        questionType: null,
        status: null,
        questionName: "",
        isOwn: null
      },
      formData: {
        textbookCode: null,
        standardCode: null
      },
      catalogueId: 0,
      treeData: [],
      selectList: null,
      lookAll: "查看所有试题",
      dialogUpload:false,
      action:this.$store.getters.objApi.BASE_API + '/api/test/question/import',
      fileList:[],
      headers:{
         "Authorization": "Bearer " + this.$store.getters.token
      }
    };
  },
  computed: {
    ...mapGetters(["problemType"])
  },
  created() {
    this.$store.dispatch("GetProblemType");
    //  if(this.$store.state.commonData.adminTestSearch){
    //    this.searchData = this.$store.state.commonData.adminTestSearch;
    //  }
    //  if(this.$store.state.source.expandTreeData){
    //    this.treeData = this.$store.state.source.expandTreeData;
    //  }
    // if(this.$store.state.source.currentSource){
    //    var tData = this.$store.state.source.currentSource;
    //    this.searchData = jQuery.extend(this.searchData,this.formData,tData);
    //    if(tData.type == 5){
    //      this.catalogueId = tData.id;
    //    }
    //  }
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
    downloadExl() {
      var link = document.createElement("a");
      link.href = this.$store.getters.objApi.BASE_API + '/api/test/question/downloadTemplate';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    upload(){
      this.dialogUpload = true;
    },
    beforeAvatarUpload(file) {
      let isTrue = true;
      const isLt200M = file.size / 1024 / 1024 < 100;
      var fileArray2 = file.name.split(".");
      var fileType = fileArray2[fileArray2.length - 1].toLowerCase();
      if (fileType !== 'docx') {
        this.$message.error("只能上传docx的文件格式!");
        isTrue = false;
      }
      if (isTrue) {
        if (!isLt200M) {
          this.$message.error("上传文件大小不能超过 100MB!");
          this.progressBoolean = false;
        }
      }
      return isTrue && isLt200M;
    },
    successFile() {
      this.dialogUpload = false;
      this.$message({
        message: '上传成功',
        type: 'success'
      });
      this.getList();
    },
    failedFile() {
      this.$message.error('导入失败,只能导入word文档且大小不超过100MB');
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-1);
    },
    groundTest(row) {
      var data = {};
      data.status = 1;
      data.id = row.id;
      this.$confirm("你确定要上架这个试题?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        changeTestStatus(data).then(res => {
          this.$message({
            message: "上架成功！",
            type: "success"
          });
          this.getList();
        });
      });
    },
    underTest(row) {
      var data = {};
      data.status = 0;
      data.id = row.id;
      this.$confirm("你确定要下架这个试题?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        changeTestStatus(data).then(res => {
          this.$message({
            message: "下架成功！",
            type: "success"
          });
          this.getList();
        });
      });
    },
    getList() {
      this.listLoading = true;
      getTestProblemList(this.searchData).then(res => {
        res.data.forEach(function(s){
          s.content = s.content[s.content.length - 1] === '}'?s.content : s.content.slice(0,s.content.length-1);
        });
        this.list = res.data;
        this.pages.total = res.total;
        if (this.pages.total > this.searchData.size) {
          this.listLoading = false;
        }
      });
    },
    deleteTestList(id) {
      this.$confirm("你确定要删除这个试题?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteTest(id).then(res => {
          this.$message({
            message: "删除成功！",
            type: "success"
          });
          this.getList();
        });
      });
    },
    changeCode(data, nodeData) {
      this.catalogueId = 0;
      if (data.type == 5) {
        this.catalogueId = data.standardCode;
      }
      this.searchData = jQuery.extend(this.searchData, this.formData, data);
      this.getList();
    },
    addSortSelect() {
      this.$router.push({
        name: "AddSortSelect",
        params: {
          catalogueId: this.catalogueId,
          isEdit: false,
          type: "sortSelect"
        }
      });
    },
    addSingleSelect() {
      this.$router.push({
        name: "AddSingleSelect",
        params: {
          catalogueId: this.catalogueId,
          isEdit: false,
          type: "singleSelect"
        }
      });
    },
    addMultiSelect() {
      this.$router.push({
        name: "AddMultiSelect",
        params: {
          catalogueId: this.catalogueId,
          isEdit: false,
          type: "multiSelect"
        }
      });
    },
    addJudgeSelect() {
      this.$router.push({
        name: "AddTrueFalse",
        params: {
          catalogueId: this.catalogueId,
          isEdit: false,
          type: "trueFalse"
        }
      });
    },
    editorTest(row) {
      if (row.questionType == "sortSelect") {
        this.$router.push({
          name: "EditSortSelect",
          params: {
            catalogueId: row.catalogueId,
            textbookCode: row.textbookCode,
            id: row.id,
            isEdit: true,
            type: row.questionType
          }
        });
      } else {
        this.$router.push({
          name: "editorSingleSelect",
          params: {
            catalogueId: row.catalogueId,
            textbookCode: row.textbookCode,
            id: row.id,
            isEdit: true,
            type: row.questionType
          }
        });
      }
    },
    addMoreProblem() {
      const ids = [];
      if (!this.selectList || this.selectList.length < 1) {
        this.$message({
          message: "请选择需要上架的试题！只能上架本地试题",
          type: "warning"
        });
        return false;
      }
      for (let i = 0; i < this.selectList.length; i++) {
        ids[i] = this.selectList[i].id;
      }
      this.$confirm("你确认要上架这些试题吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        var data = {};
        data.status = "1";
        data.ids = ids;
        changeManyStatus(data)
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
    changeProblem() {
      const ids = [];
      if (!this.selectList || this.selectList.length < 1) {
        this.$message({
          message: "请选择需要下架的试题！只能下架本地试题",
          type: "warning"
        });
        return false;
      }
      for (let i = 0; i < this.selectList.length; i++) {
        ids[i] = this.selectList[i].id;
      }
      this.$confirm("你确认要下架这些试题吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        var data = {};
        data.status = "0";
        data.ids = ids;
        changeManyStatus(data)
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
    findItem() {
      this.searchData.page = 1;
      this.getList();
    },
    selectChange(selection) {
      this.selectList = selection.filter(function(s) {
        return s.isOwn == 1;
      });
    }
  },
  mounted() {
    scrollTable('.checkIndex');
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit("SET_ADMINTESTSEARCH", this.searchData);
    next();
  }
};
</script>

<style rel="stylesheet/scss" lang="less" scoped>
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
