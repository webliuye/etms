<template>
  <div class="preTest">
    <div class="title">
      <h4>实验教学视频培训教程</h4>
    </div>
    <div class="confirm" v-if="showConfirm">
      <el-row :gutter="20">
              <el-col :span="12">
                <div class="grid-content right"   >
                   <h1  @click="control('test')" title="对本试验点做知识测试">
                     知识测试
                   </h1>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content left"  >
                    <h1  @click="control('all')" title="不想做试题，点击：继续浏览视频">
                        关  &nbsp;&nbsp;&nbsp;&nbsp; 闭
                   </h1>
                </div>
              </el-col>
       </el-row>
    </div>
    <div class="testquestion" v-if="showTest">
       <div class="testBox">
          <p class="fr" style="color:#333;font-size:12px;" v-if="data&&data.content"><span>{{(momentLength+1)}}</span>/{{dataList.length}}</p>
          <div class="singleSelect"  v-if="data.questionType=='singleSelect'">
            <p class="selectTitle">单项选择题</p>
            <SingleSelect :singleData="[data]" :indexLength="momentLength+1" :analysis="false"></SingleSelect>
          </div>
          <div class="singleSelect" v-if="data.questionType=='multiSelect'">
            <p class="selectTitle">多项选择题</p>
            <MultiSelect :multiData="[data]"  :indexLength="momentLength+1" :analysis="false" ></MultiSelect>
          </div>
          <div class="singleSelect" v-if="data.questionType=='trueFalse'">
            <p class="selectTitle">判断题</p>
            <JudgeSelect :judgeData="[data]"  :indexLength="momentLength+1" :analysis="false" ></JudgeSelect>
          </div>
          <div class="singleSelect" v-if="data.questionType=='sortSelect'">
            <p class="selectTitle">排序题</p>
            <SortSelect :sortData="[data]" :indexLength="momentLength+1" :analysis="false" ></SortSelect>
          </div>

      </div>
      <div class="bottom"  v-if="data&&data.content" >
            <div class="prenext fr">
              <el-button type="primary" :disabled="momentLength==0" @click="sub()">上一题</el-button>
              <el-button    type="primary" :disabled="momentLength==dataList.length-1"  @click="add()">下一题</el-button>
              <el-button    type="primary" :disabled="loading" @click="submit()"> 提交</el-button>
            </div>
            当前答案是：<span>{{data.userAnswer}}</span>
      </div>
    </div>
    <div class="result" v-if="showResult" >
        <div class="content">
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="grid-content" style="width:100%;border-right:1px solid #ddd;">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div class="grid-content fr">
                        <h1>{{correctCount}}</h1>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="grid-content"   >
                       <p>答对题数</p>
                       <p>/{{dataList.length}}</p>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content"  >
                  <el-progress type="circle" :width="100" :percentage="correct"></el-progress>
                </div>
              </el-col>
            </el-row>
            <div style="margin-top:64px;">
               <el-button type="primary" @click="control('answer')" >查看解析</el-button>
              <el-button    type="primary" @click="control('all')" >关 &nbsp;&nbsp;&nbsp;&nbsp;闭</el-button>
            </div>
        </div>
    </div>
     <div class="anwser" v-if="showAnwser">
       <div class="testBox">
          <p class="fr" style="color:#333;font-size:12px;" v-if="data&&data.content"><span>{{(momentLength+1)}}</span>/{{dataList.length}}</p>
          <div class="singleSelect"  v-if="data.questionType=='singleSelect'">
            <p class="selectTitle">单项选择题</p>
            <SingleSelect :singleData="[data]" :indexLength="momentLength+1" :analysis="true"></SingleSelect>
          </div>
          <div class="singleSelect" v-if="data.questionType=='multiSelect'">
            <p class="selectTitle">多项选择题</p>
            <MultiSelect :multiData="[data]"  :indexLength="momentLength+1" :analysis="true" ></MultiSelect>
          </div>
          <div class="singleSelect" v-if="data.questionType=='trueFalse'">
            <p class="selectTitle">判断题</p>
            <JudgeSelect :judgeData="[data]"  :indexLength="momentLength+1" :analysis="true" ></JudgeSelect>
          </div>
          <div class="singleSelect" v-if="data.questionType=='sortSelect'">
            <p class="selectTitle">排序题</p>
            <SortSelect :sortData="[data]" :indexLength="momentLength+1" :analysis="true" ></SortSelect>
          </div>
      </div>
        <div class="bottom"  v-if="data&&data.content" >
            <div class="prenext fr" sty>
              <el-button type="primary" :disabled="momentLength==0" @click="sub()">上一题</el-button>
              <el-button type="primary" :disabled="momentLength==dataList.length-1"  @click="add()">下一题</el-button>
              <el-button  type="primary" :disabled="loading" @click="control('all')"> 关闭</el-button>
            </div>
      </div>
    </div>
  </div>
</template>

<script>
import SingleSelect from "views/components/check/singleSelect";
import MultiSelect from "views/components/check/multiSelect";
import JudgeSelect from "views/components/check/judgeSelect";
import SortSelect from "views/components/check/sortSelect";
import {
  handTest,
  getTest,
  getTestContinuePaper,
  handTestResult
} from "api/test";
export default {
  name: "previewTest",
  components: { SingleSelect, MultiSelect, JudgeSelect, SortSelect },
  props: {
    code: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      data: {},
      momentLength: 0,
      testCode: "",
      dataList: [],
      loading: false,
      handData: {},
      correct: 0,
      correctCount: 2,
      showConfirm:true,
      showTest: false,
      showResult: false,
      showAnwser:false
    };
  },
  created() {
    // this.getData();
  },
  methods: {
    sub() {
      --this.momentLength;
      this.data = this.dataList[this.momentLength];
    },
    add() {
      this.dataList[this.momentLength] = this.data;
      ++this.momentLength;
      this.data = this.dataList[this.momentLength];
    },
    submit() {
      var that = this;
      that.loading = true;
      var boolean = false;
      var data = this.dataList;
      this.handData.data = data;
      data.forEach(function(item) {
        if (!item.userAnswer) {
          boolean = true;
        }
      });
      if (boolean) {
        this.$confirm("您还有题目没有填写答案，是否确认继续提交？", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            hand();
          })
          .catch(err => {
            that.loading = false;
            this.$message({
              type: "info",
              message: "已取消提交"
            });
          });
      } else {
        hand();
      }
      function hand() {
        that.handData.testSelfId = that.testCode;
        that.handData.status = "complete";
        handTest(that.handData)
          .then(res => {
            that.loading = false;
            that.control("result");
            that.$message({
              type: "success",
              message: "提交成功"
            });
          })
          .catch(error => {
            that.loading = false;
            that.$message({
              message: "提交失败!请重新提交",
              type: "warning"
            });
          });
      }
    },
    control(text) {
      var that = this;
      if(text=="test"){
        that.getData();
        that.showConfirm=false;
        that.showTest=true;
      }
      if (text == "result") {
        handTestResult(this.testCode).then(res => {
          that.correctCount = res.testSelf.questionRightNum;
          that.correct = Math.round(
            res.testSelf.questionRightNum / res.testSelf.questionTotalNum * 100
          );
          that.showTest = false;
          that.showResult = true;
          that.momentLength=0;
          res.questions.forEach(item => {
            var str = item.content;
            if (str.slice(str.length - 1, str.length) != "}") {
              //这是为了避免 最后一位为空格带来的parse解析错误、李滔林挖的坑
              str = str.slice(0, str.length - 1);
            }
            item.contentObj = JSON.parse(str);
          });
            that.dataList = res.questions;
            that.data = this.dataList[this.momentLength];
        });
      }
      if( text=='all'){
        this.$emit('testChange',{close:'test'});
      }
      if( text == 'answer'){
         that.showTest = false;
         that.showResult =false;
         that.showAnwser =true;
      }
    },
    getData() {
      var that = this;
      getTest({ standardCode: this.code })
        .then(res => {
          this.testCode = res.data;
          getTestContinuePaper(res.data).then(response => {
            response.questions.forEach(item => {
              var str = item.content;
              if (str.slice(str.length - 1, str.length) != "}") {
                //这是为了避免 最后一位为空格带来的parse解析错误、李滔林挖的坑
                str = str.slice(0, str.length - 1);
              }
              item.contentObj = JSON.parse(str);
              item.userAnswer = "";
            });
            this.dataList = response.questions;
            this.data = this.dataList[this.momentLength];
          });
        })
        .catch(error => {
          if (error.status == "303") {
            this.$confirm(
              "前往完成以前测试，或者强制提交未完成的测试开始当前测试(注：提交后不可恢复)",
              "您有未完成的测试",
              {
                showClose: false,
                confirmButtonText: "开始当前",
                cancelButtonText: "完成以前",
                type: "warning"
              }
            )
              .then(() => {
                var data = {
                  testSelfId: error.data,
                  status: "complete",
                  data: []
                };
                handTest(data)
                  .then(res => {
                    that.getData();
                  })
                  .catch(er => {
                    console.log(er);
                  });
              })
              .catch(err => {
                this.$router.push({
                  name: "Exercise",
                  params: { id: error.data }
                });
              });
          } else {
            if (error.data) {
              this.$message({
                message: error.data + ",创建失败",
                type: "warning"
              });
            } else {
              this.$message({
                message: "创建失败",
                type: "warning"
              });
            }
          }
        });
    }
  }
};
</script>

<style lang="less" scoped>
.preTest {
  .title {
    background: #9ecece;
    padding: 0 16px;
  }
  .selectTitle {
    color: #333;
    font-size: 12px;
    border-left: 5px solid grey;
    padding-left: 8px;
    font-weight: bold;
  }
  h4 {
    padding: 24px 0;
    margin: 0;
    font-size: 24px;
    color: aqua;
  }
  .testBox {
    padding: 4px 16px;
  }
  .bottom {
    padding: 4px 16px 16px 16px;
    font-size: 12px;
    .prenext{
      padding:8px 0;
    }
    span {
      color: #fff;
    }
  }

  .result {
    width: 100%;
    text-align: center;
    height: 60%;
    padding: 32px 0;
    .content {
      box-sizing: border-box;
      display: inline-block;
      width: 60%;
      height: 80%;
      text-align: center;
      .grid-content {
        display: inline-block;
        p {
          line-height: 32px;
        }
        h1 {
          font-size: 96px;
          margin: 0;
        }
      }
    }
  }
  .confirm{
    margin-top:64px;
    .grid-content{
     &.left {text-align: left;}
     &.right {text-align: right;}
      h1{
        cursor: pointer;
        display: inline-block;
        width:200px;
        line-height: 64px;
        border:1px solid #ddd;
        background: #9ecece;
        border-radius: 16px;
        text-align: center;
        color:#fff;
        &:hover{
          transition: all 0.3s linear;
          border: 1px solid #6acaac;
          background: #ddd;
          color:#666;
        }
      }
    }
  }
}
</style>
