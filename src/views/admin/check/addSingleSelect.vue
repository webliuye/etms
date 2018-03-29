<template>
	<master-page title="添加单选题">
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
        </el-row>
        <el-row>
          <el-col :xs="24 ">
            <el-form-item label="难度：" prop="level">
              <el-radio-group v-model="formData.level">
                <el-radio  :label="0">简单</el-radio>
                <el-radio  :label="1">一般</el-radio>
                <el-radio  :label="2">困难</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="23">
            <el-form-item label="题干：" required>
              <UE :defaultMsg="formData.contentObj.stem" :config=config ref="stem" id="stem"></UE>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  v-for="(items,index) in formData.contentObj.items" :key="index">
          <el-col :span="23 ">
            <el-form-item :label="'选项' + letters[index] + ':'" required>
              <UE :defaultMsg="items.value" :config=config :ref="'item' + letters[index]" :id="'item' + letters[index]"></UE>
            </el-form-item>
            <el-form-item>
              <el-radio-group v-model="formData.standardAnswer" v-if="!multi">
                <el-radio :label="letters[index]">正确答案</el-radio>
              </el-radio-group>
              <el-checkbox-group v-model="formData.standardAnswerArray" v-if="multi">
                <el-checkbox :label="letters[index]">正确答案</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="1" v-if="formData.questionType != 'trueFalse'">
            <el-button  @click.stop="deleteItem(index)"  type="text" icon="el-icon-delete"></el-button>
          </el-col>
        </el-row>
        <el-row v-if="formData.questionType != 'trueFalse'">
          <el-col :span="23">
            <div class="fr">
              <el-button class="pull-right" type="primary" @click="addItems()">新增选项</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <p class="highSelect">
              <a href='javascript:;' v-if="!showHighSelect" class ="el-button--text highSelecta" @click="showHighSelect = true">
                查看高级选项
                <img src="~assets/checkImg/analysis.png">
              </a>
              <a href='javascript:;' v-if="showHighSelect" class ="el-button--text highSelecta" @click="showHighSelect = false">
                隐藏高级选项
                <img src="~assets/checkImg/shrink.png">
              </a>
              <span></span>
            </p>
          </el-col>
        </el-row>
        <el-row v-if="showHighSelect">
          <el-col :span="23">
            <el-form-item label="解析：">
              <UE :defaultMsg="formData.analysis" :config=config ref="analysis" id="analysis"></UE>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="showHighSelect">
          <el-col :span="12">
            <el-form-item label="分值：">
              <el-input v-model="formData.questionScore" type="number" :max="100" :min="1" placeholder="请输入分值"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="showHighSelect">
          <el-col :xs="24 ">
            <el-form-item label="试题标签：" prop="Tag">
              <el-tag

                v-for="(tag,index) in formData.tagArray"
                :key="index"
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
        </el-row>
        <el-row>
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
import UE from "views/components/ue.vue";
import VersionSelect from "views/components/versionSelect";
import guideSelect from "views/mixins/check/guideSelect";
import { mapGetters } from "vuex";
import {
  gettwoThemeTree,
  getoneSectionTree,
  gettwoSectionTree,
  getListTree,
  addSource,
  getSourceDetail,
  getThemeGuide,
  getLocalSourceId
} from "api/source";
import { addTestProblem, getTestInfo, reviseTestInfo } from "api/test";
export default {
  components: { MasterPage, UE, VersionSelect },
  data() {
    return {
      multi: false
    };
  },
  computed: {},
  mixins: [guideSelect],
  created() {
    var vm = this;
    if (this.$route.params.type == "multiSelect") {
      //判断是否多选
      this.multi = true;
    } else if (this.$route.params.type == "trueFalse") {
      this.formData.contentObj.items = [{ value: "" }, { value: "" }];
    }
    if (this.$route.params.isEdit && this.$route.params.isEdit !== "false") {
      this.isEdit = true;
    } else {
      this.isEdit = false;
    }
    if (this.isEdit) {
      this.formData.contentObj = [];
      if (this.$route.params.id) {
        this.formData.id = this.$route.params.id;
        getTestInfo(this.$route.params.id).then(res => {
          this.formData.analysis = res.analysis;
          this.formData.catalogueId = res.catalogueId;
          this.formData.level = res.level;
          this.formData.questionScore = res.questionScore;
          this.formData.questionType = res.questionType;
          this.formData.standardAnswer = res.standardAnswer;
          if (this.multi) {
            this.formData.standardAnswerArray = res.standardAnswer.split("");
          }
          if (res.tag && res.tag.length > 2) {
            this.formData.tagArray = res.tag
              .substring(1, res.tag.length - 1)
              .split("][");
          }
          let tLen = res.content.length;
          res.content = res.content[tLen - 1] === '}'?res.content : res.content.slice(0,tLen - 1);
          this.formData.content = res.content;
          this.formData.contentObj = JSON.parse(res.content);
        });
      }
    }
  },
  methods: {
    changeCatalogue(val) {
      this.formData.catalogueId = val;
    },
    submitForm(text) {
      if (!this.loading) {
        return;
      }
      this.$refs["formData"].validate(valid => {
        if (valid) {
          var vm = this;
          var t = this.getUEContent();
          if (t) {
            this.$message({
              message: "选项不能为空",
              type: "warning"
            });
            return;
          }
          if (!this.formData.contentObj.stemContent.trim()) {
            this.$message({
              message: "题干不能为空",
              type: "warning"
            });
            return;
          }
          if (this.multi) {
            //多选
            this.formData.standardAnswer = this.formData.standardAnswerArray
              .sort()
              .join("");
          }
          if (!this.formData.standardAnswer) {
            this.$message({
              message: "请选择正确答案",
              type: "warning"
            });
            return;
          }
          this.formData.content = JSON.stringify(this.formData.contentObj);
          this.formData.tag = this.formData.tagArray
            .map(function(e) {
              return "[" + e + "]";
            })
            .join("");
          this.loading = false;
          if (vm.isEdit) {
            reviseTestInfo(this.formData)
              .then(res => {
                this.loading = true;
                this.$message({
                  message: "修改成功！",
                  type: "success"
                });
                this.$router.push({ name: "QuestionBank" });
              })
              .catch(err => {
                this.loading = true;
              });
          } else {
            addTestProblem(this.formData)
              .then(res => {
                this.loading = true;
                if (text === "save") {
                  this.$message({
                    message: "操作成功！",
                    type: "success"
                  });
                  this.$router.push({ name: "QuestionBank" });
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
        }
      });
    }
  },
  mounted() {}
};
</script>

<style rel="stylesheet/scss" lang="less" scoped>
.form-catalog {
  margin: 0 auto;
  width: 96%;
  max-width: 1100px;
}
.el-radio-group .el-radio {
  width: 72px;
}
.highSelect {
  width: 100%;
  position: relative;
  text-align: center;
  .highSelecta {
    position: relative;
    z-index: 2;
    display: block;
    height: 40px;
    line-height: 40px;
    width: 140px;
    font-size: 14px;
    margin: 0 auto;
    text-align: center;
    background-color: #fff;
  }
  span {
    display: block;
    width: 100%;
    position: absolute;
    z-index: 1;
    height: 20px;
    border-bottom: 1px solid #eee;
    top: 0;
  }
}
</style>
