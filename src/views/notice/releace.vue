<template>
  <master-page title="发布新公告">
    <div class="new-notice">
      <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" >
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
         <el-form-item label="公告内容" prop="content" style="height:400px;">
           <VueUEditor :config="config" :id="'ue'" ref="stem" ></VueUEditor>
            <!-- <quill-editor v-model='formData.content' :options="options" ref="newEditor" @ready="onEditorReady($event)"    ></quill-editor>
             <el-upload
                :file-list="fileListData"
                :action="urlAjax"
                :headers="urlHeaders"
                :on-success="upLoadSuccess"
                clearFiles
                :before-upload="beforeAvatarUpload"
                style="display:none"
                >
                  <i class="el-icon-plus" id="getFile"></i>
             </el-upload> -->
            <!-- <input type="file" id="getFile" @change="uploadFunction($event)" /> -->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="submitForm()">确认</el-button>
          <el-button @click="cancel()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- <el-row>
      <el-col :span="12" :offset="6">

      </el-col>
    </el-row> -->
  </master-page>
</template>

<script>
import MasterPage from "../layout/MasterPage";
import VueUEditor from "views/components/ue";
import { addNotice } from "api/notice";
export default {
  components: {
    MasterPage,
    VueUEditor
  },
  data() {
    return {
      loading: false,
      editor: null,
      formData: {
        title: null,
        content: null
      },
      config: {
        toolbars: [
          [
            "undo",
            "redo",
            "|",
            "bold",
            "italic",
            "underline",
            "fontborder",
            "strikethrough",
            "superscript",
            "subscript",
            "removeformat",
            "formatmatch",
            "autotypeset",
            "blockquote",
            "pasteplain",
            "|",
            "forecolor",
            "backcolor",
            "insertorderedlist",
            "insertunorderedlist",
            "selectall",
            "cleardoc",
            "|",
            "rowspacingtop",
            "rowspacingbottom",
            "lineheight",
            "|",
            "customstyle",
            "paragraph",
            "fontfamily",
            "fontsize",
            "|",
            "directionalityltr",
            "directionalityrtl",
            "indent",
            "|",
            "justifyleft",
            "justifycenter",
            "justifyright",
            "justifyjustify",
            "|",
            "touppercase",
            "tolowercase",
            "|",
            "imagenone",
            "imageleft",
            "imageright",
            "imagecenter",
            "|",
            // "simpleupload",
            "insertimage",
            "pagebreak",
            "spechars"
          ]
        ]
      },
      fileListData: [],
      length: 0,
      rules: {
        title: [
          { required: true, message: "长度在 1 到 50 个字符", trigger: "blur" },
          { min: 1, max: 50, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.urlHeaders = { Authorization: "bearer " + this.$store.getters.token }; // 上传文件请求header
    this.urlAjax = this.$store.getters.objApi.BASE_API + "/api/file/upload"; // // 上传文件请求header
  },
  methods: {
    submitForm() {
      this.getEditorData();
      this.$refs["formData"].validate(valid => {
        if (valid) {
          this.loading = true;
          addNotice(this.formData)
            .then(response => {
              this.loading = false;
              this.$router.push({ path: "/notice" });
            })
            .catch(err => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    cancel() {
      this.$router.go(-1);
    },
    editorChange() {
      console.log("1");
    },
    getEditorData() {
      this.formData.content = this.$refs.stem.getUEContent();
    },
    onEditorReady(e) {
      // console.log(e);
      //   var range = this.$refs.newEditor.quill.getSelection();
      //   // this.length = range.index;
      //   console.log(range);
      this.$refs.newEditor.quill
        .getModule("toolbar")
        .addHandler("image", this.imageHandler);
    },
    imageHandler() {
      document.getElementById("getFile").click();
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      let isJPG = false;
      if (
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif"
      ) {
        isJPG = true;
      }
      if (!isJPG) {
        this.$message.error("上传的图片只能是jpg、png、gif格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传的图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    upLoadSuccess(response, file, fileList) {
      var length = this.$refs.newEditor.quill.getSelection();
      console.log(length);
      // this.$refs.newEditor.quill.insertEmbed( this.length, 'image',response.url);
      this.$refs.newEditor.quill.insertEmbed(length, "image", response.url);
    }
    //
    //
  }
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.new-notice {
  width: 70%;
  margin: 0 auto;
  min-width: 700px;
}
.quill-editor {
  z-index: 20;
}
.ql-container {
  height: 360px !important;
}
</style>

