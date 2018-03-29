<template>
	<master-page title="上传资源">
		<div class="filter-container">
			<el-button class="pull-right main-return" type="text" @click="$router.go(-1)">返回</el-button>
        <el-form class="form-catalog" :model="formData" :rules="rules" ref="formData" label-width="130px">
          <el-row>
          <el-col :xs="24 ">
            <el-form-item label="版本目录：" prop="catalogueId">
              <!-- <span v-text="formData.uploadUrl"></span> -->
              <div>
                <VersionSelect @changeCatalogue="changeCatalogue"></VersionSelect>
              </div>

            </el-form-item>
          </el-col>
          <el-col :xs="12" :span="12">
            <el-form-item label="资源名称：" prop="name">
	            <el-input v-model="formData.name"></el-input>
	          </el-form-item>
          </el-col>
          <el-col :xs="24 ">
            <el-form-item label="资源类别：" prop="resourceType">
              <el-radio-group v-model="formData.resourceType">
                <el-radio v-for="(item,index) in sourceType" :key="index" :label="item.value">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
           <el-col :xs="24 ">
            <el-form-item label="资源上传：" prop="upload">
              <el-radio-group  v-model="formData.type" @change="changeType">
                  <el-radio :label="1">上传文件</el-radio>
                  <el-radio :label="2">资源地址</el-radio>
              </el-radio-group>
              <div>
                <el-row :gutter='16'>
                  <el-col :span="11">
                    <el-input v-if="formData.type == 1" v-model="file.name"></el-input>
                    <el-input v-if="formData.type == 2" v-model="formData.url" @blur="createId" placeholder="请输入资源地址"></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-upload v-if="formData.type == 1" style="height:28px; width:144px; float:left; display:inline;"
                      ref="upload"
                      :action="urlAjax"
                      :headers="urlHeaders"
                      :auto-upload="false"
                      :show-file-list="false"
                      :on-remove="handleRemove"
                      :on-change="changeFile"
                      :on-success="upLoadSuccess"
                      :on-progress="fileProgress"
                      :before-upload="beforeAvatarUpload"
                      :data="uploadData"
                      :file-list="fileList">
                      <div style="display:inline-block;height:28px; line-height:28px; color:#999;"> 1G以内&nbsp;&nbsp;&nbsp;&nbsp;</div>
                      <el-button size="small" type="primary" style="height:28px;" @click="handlePreview">浏览</el-button>
                    </el-upload>
                    <el-button  v-if="formData.type == 1" :disabled="loadBoolean" style="height:28px; float:left; display:inline;" size="small" type="success" @click="submitUpload">上传</el-button>
                  </el-col>
                </el-row>
                <el-row :gutter='16' v-if="progressBoolean">
                  <el-col :span="12">
                    <p>
                      <el-progress :stroke-width="4" :percentage="progressPercent"></el-progress>
                    </p>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
          </el-col>
          <el-col :xs="24 ">
            <el-form-item label="资源简介：" prop="intro">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2}"
                :maxlength="1000"
                placeholder="请输入内容"
                v-model="formData.intro">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24 ">
            <el-form-item label="资源标签：" prop="Tag">
              <el-tag
                :key="index"
                v-for="(tag,index) in formData.tagArray"
                :closable="true"
                :close-transition="false"
                @close="handleClose(tag)"
                style="margin:0 10px;"
              >
              {{tag}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="formData.tags"
                ref="saveTagInput"
                :maxlength="10"
                size="small"
                style="display:inline-block;width:200px;"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              >
              </el-input>
              <el-button v-else class="button-new-tag"  size="small"  @click="showInput"><i class="el-icon-plus"></i></el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="24">
            <el-form-item>
              <el-button v-if="isEdit" type="primary" @click="submitForm('save')">确定</el-button>
              <el-button v-if="!isEdit" type="primary" @click="submitForm('save')">保存</el-button>
              <el-button v-if="!isEdit" :disable="true" type="primary" @click="submitForm('next')">保存并新增</el-button>
              <el-button @click="cancel()">取消</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
		</div>
  </master-page>
</template>
<script>
import MasterPage from "views/layout/MasterPage";
import { mapGetters } from "vuex";
import VersionSelect from "views/components/versionSelect";
import {
  uploadSource,
  gettwoThemeTree,
  getoneSectionTree,
  gettwoSectionTree,
  getListTree,
  addSource,
  getSourceDetail,
  getThemeGuide,
  getLocalSourceId
} from "api/source";
export default {
  components: { MasterPage, VersionSelect },
  data() {
    return {
      loading: true,
      rules: {
        name: [
          { required: true, message: "请输入资源名称", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }
        ],
        resourceType: [{ required: true, trigger: "blur", message: "请选择资源类型" }],
        intro: [{ required: true, message: "请输入资源简介", trigger: "blur" }],
        catalogueId: [{ required: true, trigger: "blur", message: "请选择版本目录" }],
        url: [{ required: true, trigger: "blur", message: "请填写资源地址" }]
      },
      urlHeaders: null, // 上传文件请求header
      urlAjax: "", // 上传文件请求地址
      file: {
        name: ""
      },
      formData: {
        name: "",
        resourceType: "",
        url: "",
        intro: "",
        tag: "",
        tagArray: [],
        tags: "",
        resourceId: "",
        resourceSize: null,
        resourceByteSize: null,
        type: 1,
        catalogueId: "",
        textbookCode: null
      },
      uploadData: {
        resourceId: ""
      },
      fileList: [],
      inputVisible: false,
      isEdit: false,
      progressPercent: 0,
      progressBoolean: false,
      typeBoolean: false, //判断首次加载type为2时不清空url
      loadBoolean: true
    };
  },
  computed: {
    ...mapGetters(["sourceType", "uploadType"]),
    fileArray: function() {
      var array = [];
      this.uploadType.forEach(function(item) {
        array.push(item.label);
      });
      return array;
    }
  },
  created() {
    this.$store.dispatch("GetUploadType");
    var vm = this;
    if (this.$route.params.isEdit === "false" || !this.$route.params.isEdit) {
      this.isEdit = false;
    } else {
      this.isEdit = true;
    }
    if (this.isEdit) {
      if (this.$route.params.resourceId) {
        getSourceDetail(this.$route.params.resourceId).then(res => {
          this.uploadData.resourceId = this.$route.params.resourceId;
          this.formData.resourceId = res.resourceId;
          this.formData.name = res.name;
          this.formData.intro = res.intro;
          this.formData.resourceType = res.resourceType;
          this.formData.resourceSize = res.resourceSize;
          this.formData.resourceByteSize = res.resourceByteSize;
          this.formData.textbookCode = res.textbookCode;
          if (res.url && res.url.slice(0, 4) == "http") {
            this.typeBoolean = true;
            this.formData.type = 2;
          } else {
            this.formData.type = 1;
          }
          this.formData.url = res.url;
          this.file.name = res.url;
          if (res.tag && res.tag.length > 2) {
            this.formData.tagArray = res.tag
              .substring(1, res.tag.length - 1)
              .split("][");
          }
        });
      } else {
        this.$router.push({ name: "LocalSource" });
      }
      if (this.$route.params.catalogueId) {
      } else {
        this.$router.push({ name: "LocalSource" });
      }
    } else {
      this.formData.type = 1;
    }
    this.$store.dispatch("GetSourceType");
    this.urlHeaders = { Authorization: "bearer " + this.$store.getters.token }; // 上传文件请求header
    this.urlAjax =
      this.$store.getters.objApi.BASE_API + "/api/resources/upload"; // // 上传文件请求header
    this.$store.dispatch("GetSubject");
  },
  methods: {
    changeCatalogue(val) {
      this.formData.catalogueId = val;
    },
    upLoadSuccess(response, file, fileList) {
      this.progressPercent = 100;
      this.$message({
        message: "上传成功！",
        type: "success"
      });
      this.formData.url = response.resourceUrl;
      this.formData.resourceId = response.resourceId;
      this.formData.resourceSize = response.resourceSize;
      this.formData.resourceByteSize = response.resourceByteSize;
      this.progressBoolean = false;
    },
    createId() {
      if (!this.formData.resourceId) {
        getLocalSourceId().then(res => {
          this.formData.resourceId = res;
        });
      }
    },
    fileProgress(event, file, fileList) {
      if (parseInt(event.percent) > 50) {
        this.progressPercent = parseInt(event.percent) - 1;
      } else {
        this.progressPercent = parseInt(event.percent);
      }
    },
    beforeAvatarUpload(file) {
      this.progressBoolean = true;
      this.loadBoolean = true;
      this.formData.url = "";
      this.formData.resourceId = "";
      this.formData.resourceSize = "";
      this.formData.resourceByteSize = 0;
      const isLt200M = file.size / 1024 / 1024 < 1024;
      let isTrue = true;
      var fileArray2 = file.name.split(".");
      var fileType = fileArray2[fileArray2.length - 1].toLowerCase();
      if (this.fileArray.indexOf(fileType) < 0) {
        this.$message.error("只能上传" + this.fileArray.join("、") + "的文件格式!");
        isTrue = false;
        this.progressBoolean = false;
      }
      if (isTrue) {
        if (!isLt200M) {
          this.$message.error("上传文件大小不能超过 1G!");
          this.progressBoolean = false;
        }
      }
      return isTrue && isLt200M;
    },
    submitForm(text) {
      if (!this.loading) {
        return;
      }
      this.$refs["formData"].validate(valid => {
        if (valid) {
          var vm = this;
          if (!this.formData.url || !this.formData.resourceId) {
            this.$message({
              message: "请上传文件或输入资源地址或等待上传完成",
              type: "warning"
            });
            return;
          }
          if (
            this.formData.type == 2 &&
            this.formData.url.slice(0, 4) != "http"
          ) {
            this.$message({
              message: "资源地址的格式错误，请以http开头",
              type: "warning"
            });
            return;
          }
          this.loading = false;
          this.formData.tag = this.formData.tagArray
            .map(function(e) {
              return "[" + e + "]";
            })
            .join("");
          addSource(this.formData)
            .then(res => {
              this.loading = true;
              if (text === "save") {
                // 保存
                if (vm.isEdit) {
                  this.$message({
                    message: "修改成功！",
                    type: "success"
                  });
                } else {
                  this.$message({
                    message: "操作成功！",
                    type: "success"
                  });
                }
                this.$router.go(-1);
              } else {
                this.$message({
                  message: "操作成功！",
                  type: "success"
                });
                this.resetForm();
              }
            })
            .catch(err => {
              this.loading = true;
            });
        }
      });
    },
    cancel() {
      this.$router.push({ name: "LocalSource" });
    },
    handleClose(tag) {
      this.formData.tagArray.splice(this.formData.tagArray.indexOf(tag), 1);
    },
    handleRemove(file, fileList) {
    },
    handlePreview() {
      this.fileList=[];
    },
    changeFile(file, fileList) {
      this.file.name = file.name;
      fileList = fileList.slice(-1);
      if (this.formData.name == "") {
        this.formData.name = file.name
          .split(".")
          .slice(0, -1)
          .join(".");
      }
      if(!this.formData.resourceType){
        let fileTypeArray = file.name.split(".");
        let fileType = fileTypeArray[fileTypeArray.length - 1];
        if (fileType == "mp4") {
          this.formData.resourceType = "RS_TYPE_VIDEO";
        } else if (fileType == "swf") {
          this.formData.resourceType = "RS_TYPE_SIM";
        } else {
          this.formData.resourceType = "RS_TYPE_PLAN";
        }
      }
      if (this.progressPercent == 100) {
        this.progressPercent = 0;
      } else {
        this.formData.url = "";
        this.loadBoolean = false;
      }
    },
    submitUpload() {
      //上传
      if (this.formData.type == 1) {
        this.$refs.upload.submit();
      } else {
      }
    },
    changeType() {
      if (this.typeBoolean) {
        this.typeBoolean = false;
        return;
      }
      this.file.name = "";
      this.formData.url = "";
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.formData.tags;
      if (this.formData.tagArray && this.formData.tagArray.length > 9) {
        this.$message({
          message: "最多只能添加10个标签",
          type: "warning"
        });
        this.inputVisible = false;
        this.formData.tags = "";
        return;
      }
      if (inputValue) {
        this.formData.tagArray.push(inputValue);
      }
      this.inputVisible = false;
      this.formData.tags = "";
    },
    resetForm() {
      //this.$refs['formData'].resetFields();
      this.formData.tagArray = [];
      this.file.name = "";
      this.formData.intro = "";
      this.formData.name = "";
      this.formData.url = "";
      this.formData.tag = "";
      this.formData.tags = "";
      this.formData.resourceId = "";
      this.formData.resourceSize = null;
      this.formData.resourceByteSize = null;
      this.formData.type = 1;
    }
  }
};
</script>
<style lang="less" scoped>
.form-catalog {
  margin: 0 auto;
  width: 96%;
  max-width: 1100px;
}
.el-radio-group .el-radio {
  width: 72px;
}
</style>
