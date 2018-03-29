<template>
	<master-page>
		<div>
			<div class="filter-container">
				<el-row>
					<el-col :span="6" >
						<div>
							<p class="checkInfo"><strong>错题总数（道）</strong></p>
							<p class="checkNumber"><span>{{problemInfo.err}}</span>道</p>
						</div>
					</el-col>
					<el-col :span="6" >
						<div>
							<p class="checkInfo"><strong>做题总数（道）</strong></p>
							<p class="checkNumber"><span class="allProblem">{{problemInfo.all}}</span>道</p>
						</div>
					</el-col>
					<el-col :span="6" >
						<div>
							<p class="checkInfo"><strong>做题时长（分钟）</strong></p>
							<p class="checkNumber"><span class="allTime">{{problemInfo.allTime}}</span>分钟</p>
						</div>
					</el-col>
					<el-col :span="6" >
						<div class="chartDiv">
							<NormalChart :style="{width:'100%',height:'220px'}"  :titleObj="barTitle" :dataX="problemName"  :dataName="accuracyName" :dataNum="problemData"></NormalChart>
						</div>
					</el-col>
				</el-row>
			</div>
			<div>
        <div class="testContent">
          <div class="testLeft">
            <div class="search-select">
              <div class="fl selectwidth">
                <el-select v-model="subjectId" placeholder="请选择科目" @change="getVolumn">
                  <el-option
                    v-for="(item,index)  in subjectData"
                    :key="index"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </div>
              <div class="fl selectwidth">
                <el-select v-model="volumnId" placeholder="请选择册次" @change="getCount">
                  <el-option
                    v-for="(item,index)  in volumnData"
                    :key="index"
                    :label="item.nodeName"
                    :value="item.textbookCode">
                  </el-option>
                </el-select>
              </div>
              <div class="fl selectwidth">
                <p>当前册次总题数:<span>{{testCount}}</span> 道</p>
              </div>
              <div class="fr">
                <el-button :disabled="testCount == 0" class="pull-right" type="primary" @click="selfTest()">实验知识自测</el-button>
              </div>
            </div>
            <div v-for="(item,index)  in testData" class="conditDiv" :key="index">
              <span class="span1">
                {{item.createTime?item.createTime.slice(0,4)+item.createTime.slice(5,7)+item.createTime.slice(8,10):''}}{{item.subjectName}}{{item.volumeName?item.volumeName:item.gardeName}}自测
              </span>
              <span class="span2">
                {{(item.questionTotalNum - item.unansweredCount) + '/' + item.questionTotalNum}}
              </span>
              <span :class="['span4',item.status==0?'redColor':'']">
                {{['未交卷','已交卷'][item.status]}}
              </span>
              <a href='javascript:;' v-if="item.status == 0" class ="el-button--text fr" @click="continueTest(item)">继续</a>
              <a href='javascript:;' v-if="item.status == 1" class ="el-button--text fr" @click="analysis(item)">查看答案</a>
              <span class="span3" v-if="item.status == 1" >正确率{{parseInt(((item.questionRightNum/item.questionTotalNum).toFixed(2))*100)}}%</span>
            </div>
            <div v-show="listLoading" class="pagination-container">
              <Pagination :pages="pages" :searchData="searchData" @getTableData="getList"></Pagination>
            </div>
          </div>
          <div class="testRight">
            <ExerciseCount :listData="rankList"></ExerciseCount>
          </div>
        </div>
			</div>
		</div>
	</master-page>
</template>

<script>
import MasterPage from "views/layout/MasterPage";
import NormalChart from "components/Charts/normalChart";
import ExerciseCount from "views/components/exerciseCount";
import SubjectSelect from "views/components/select/subjectSelect";
import Pagination from 'views/components/page/pagination';
import { getInfo } from "api/manageCenter";
import { getTest, getTestRecord, getTestNumberCount } from "api/test";
import { getoneThemeTree, gettwoThemeTree } from "api/source";
import { getSelfStatic, getLastFive, getTopTen, getPrsRank, getOwnSubjects } from "api/check";
import { getVersionDataTree } from 'api/common';
export default {
  name: "checkIndex",
  components: { MasterPage, NormalChart, ExerciseCount, SubjectSelect, Pagination },
  data() {
    return {
      problemInfo: {
        err: 0,
		allTime: 0,
		all: 0
      },
      pages: {
        total: 1,
        sizes: [10, 20, 30, 50]
      },
      listLoading: true,
      searchData: {
        page: 1,
        size: 50
      },
	  problemName: [],
    testCount:0,
	  accuracyName:['正确率'],
      problemData: [],
      barTitle: {
        text: "最近5次练习正确率",
        left: "right",
        top: "32",
        textStyle: {
          fontSize: "12",
          height: "12"
        }
      },
      rankList: [],
      testData: [],
      subjectData: [],
      volumnData:[],
      volumnId:'',
      subjectId: "",
      user:this.$store.state.user.userInfo.name
    };
  },
  created() {
    getOwnSubjects({emptyToFull: true}).then(res => {
      if(!res || res.length < 1){
        this.$message({
          message: "请先去关联班级和科目",
          type: "warning"
        });
        this.$router.push({ path:'/schoolClassManage' });
      }else{
        // res.forEach(function(item){
        //   item.editionId = item.edition;
        //   item.learningPeriodId = item.learningPeriod;
        //   item.subjectId = item.subject;
        //   item.id = item.edition + item.learningPeriod + item.subject;
        // });
        this.subjectData = res;
        this.subjectId = res[0].code;
        this.getVolumn();
      }
    });
    // getInfo().then(res => {
    //   if (!res.userClassLists || res.userClassLists.length < 1) {
    //     this.$message({
    //       message: "请先去关联科目和年级",
    //       type: "warning"
    //     });
    //     this.$router.push({ name: "MyInformation" });
    //   } else {
    //     this.subjectData = res.userClassLists;
    //     this.subjectId = res.userClassLists[0].subjectId;
    //   }
    // });
    getSelfStatic().then(res => {
      if (res) {
        this.problemInfo.all = res.questionTotalNum;
        this.problemInfo.err = res.questionTotalNum - res.questionRightNum;
        this.problemInfo.allTime = (res.duration/60).toFixed();
      } else {
        this.$message.error("无返回值");
      }
      this.getRank();
    });
   	this.getFiveTest();
	  this.getList();
  },
  methods: {
    getCount() {
      var vm = this;
      var data = {};
      data.textbookCode = this.volumnId;
      getTestNumberCount(data).then(res => {
        if (res) {
          this.testCount = res;
        } else {
          this.testCount = 0;
        }
      });
    },
    getVolumn() {
      var vm = this;
      var data = {};
      data.textbookCode = this.subjectId;
      data.groups = 'grade,volume';
      getVersionDataTree(data).then(res => {
        if (res && res.length > 0) {
          this.volumnData = res;
          this.volumnId = res[0].textbookCode;
          this.getCount();
        } else {
          this.volumnData = [];
          this.volumnId = '';
          this.testCount = 0;
        }
      });
    },
	  getFiveTest(){
		  getLastFive().then(res => {
			var vm=this;
			var qsd=[]
			for (var i = 1,n=0; i <= 5; i++,n++) {
				if (res[n] && res[n].questionRightNum != 0) {
				qsd[n] = parseInt(
					res[n].questionRightNum / res[n].questionTotalNum * 100
				);
				} else {
				  qsd[n] = 0;
				}
				vm.problemName[n] = "" + i;
			}
			vm.problemData=[qsd];
			});
	  },
	  getRank(){
		  var vm=this;
      this.rankList = [];
      getPrsRank().then(res => {
  			if(res!=-1){
          if(res < 10){
            // vm.rankList[0] = {
            //   index:res,
            //   staffName:vm.user,
            //   questionCount:vm.problemInfo.all
            // };
          }else{
            vm.rankList[0] = {
              index:0,
              staffName:vm.user,
              questionCount:vm.problemInfo.all
            };
          }
  			}else{
  				vm.rankList[0]={
  					index:0,
  					staffName:'您暂未参与排名',
  					questionCount:0
  				}
  			}
			  getTopTen().then(res => {
					res.forEach(function(e,index) {
						e.index=index+1;
						vm.rankList.push(e);
					});
				});
			});
	  },
    getList() {
      this.listLoading = false;
      getTestRecord(this.searchData).then(res => {
        this.pages.total = res.total;
        this.testData = res.data;
        if (this.pages.total > this.searchData.size) {
          this.listLoading = true;
        };
        // this.getRank();
      });
    },
    // handleSizeChange(val) {
    //   // 显示多少页
    //   this.searchData.size = val;
    //   this.getList();
    // },
    // handleCurrentChange(val) {
    //   // 点击页数
    //   this.searchData.page = val;
    //   this.getList();
    // },
    selfTest() {
      var vm = this;
      var data = {};
      data.textbookCode = this.volumnId;
      getTest(data).then(res => {
        this.$router.push({ name: 'Exercise', params:{id:res.data}});
      }).catch(error => {
        if (error.status == "303") {
          this.$message({
            message: "您还有未完成的测试,请先测试完",
            type: "warning"
          });
        } else {
          if(error.data){
            this.$message({
              message: error.data + ",创建失败",
              type: "warning"
            });
          }else{
            this.$message({
              message: "创建失败",
              type: "warning"
            });
          }
        }
      });
    },
    continueTest(item){
      this.$router.push({ name: 'ConExercise', params:{id:item.id}});
    },
    analysis(item) {
      this.$router.push({ name: 'HandExams', params: {id: item.id} });
    }
  },
  mounted() {}
};
</script>

<style rel="stylesheet/scss" lang="less" scoped>
.filter-container {
  height: 160px;
  overflow: hidden;
  border-bottom: 1px solid #e0e0e0;
}
.testContent {
  width: 100%;
  padding-right: 314px;
  position: relative;
  .testLeft {
    padding-right:16px;
    border-right:1px solid  #e0e0e0;
    min-height: 720px;
  }
  .testRight {
    position: absolute;
    width: 314px;
    top: 0;
    right: 0;
    padding-left: 16px;
  }
}
.chartDiv {
  height: 240px;
  margin-top: -30px;
}
.search-select {
  padding-top: 16px;
  border-bottom: 1px solid #e3e3e3;
  p {
    margin: 0;
    line-height: 28px;
    font-size: 12px;
    color: #555;
    span {
      color: #ff4949;
    }
  }
}
// .rankTable {
// 	border: none;
// }
// .el-table td {
// 	border: none;
// }
.el-tooltip img {
  display: inline-block;
  vertical-align: middle;
}
.checkInfo {
  width: 100%;
  font-size: 14px;
  color: #333;
  text-align: center;
  width: 100%;
}
.checkNumber {
  font-size: 12px;
  color: #555;
  text-align: center;
  span {
    font-size: 42px;
    color: #ff4949;
    padding-right: 16px;
    &.allProblem {
      color: #f0c301;
    }
    &.allTime {
      color:#999;
    }
  }
}
.conditDiv {
  width: 100%;
  height: 61px;
  border-bottom: 1px solid #e8e8e8;
  span {
    float: left;
    display: inline;
    height: 60px;
    line-height: 60px;
    font-size: 12px;
    color: #555;
    &.span3 {
      float: right;
      display: inline;
      width: 20%;
      text-align: left;
    }
    &.redColor {
      color:#ff4949;
    }
  }
  a {
    font-size: 12px;
    margin-top: 16px;
    line-height: 28px;
  }
  .span1 {
    width: 30%;
  }
  .span2 {
    width: 15%;
  }
  .span4 {
    width: 15%;
  }
}
</style>
