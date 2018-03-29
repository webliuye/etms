<template>
	<master-page>
		<div>
			<div>
				<div class="testContent">
					<div class="testLeft">
						<div class="singleSelect"  v-if="answerSheet.singleSelect.length > 0">
							<p class="selectTitle">单项选择题</p>
							<SingleSelect :singleData="answerSheet.singleSelect" :indexLength='1' :analysis="true"></SingleSelect>
						</div>
						<div class="singleSelect"  v-if="answerSheet.multiSelect.length > 0">
							<p class="selectTitle">多项选择题</p>
							<MultiSelect :multiData="answerSheet.multiSelect" :indexLength='1 + answerSheet.singleSelect.length' :analysis="true"></MultiSelect>
						</div>
						<div class="singleSelect"  v-if="answerSheet.judgeSelect.length > 0">
							<p class="selectTitle">判断题</p>
							<JudgeSelect :judgeData="answerSheet.judgeSelect" :indexLength='1 + answerSheet.singleSelect.length + answerSheet.multiSelect.length' :analysis="true"></JudgeSelect>
						</div>
						<div class="singleSelect"  v-if="answerSheet.sortSelect.length > 0">
							<p class="selectTitle">排序题</p>
							<SortSelect :sortData="answerSheet.sortSelect" :indexLength='1 + answerSheet.singleSelect.length + answerSheet.multiSelect.length + answerSheet.judgeSelect.length' :analysis="true"></SortSelect>
						</div>
						<div style="margin-top:16px; height:40px;">
							<el-button class="fr" type="primary" @click="cancel()">返回</el-button>
						</div>
					</div>
					<div class="testRight">
						<AnswerSheet :answerSheet="answerSheet" @anchorScroll="anchorScroll"></AnswerSheet>
					</div>
				</div>
			</div>
		</div>
	</master-page>
</template>

<script>
	import MasterPage from 'views/layout/MasterPage';
	import SingleSelect from 'views/components/check/singleSelect';
	import MultiSelect from 'views/components/check/multiSelect';
	import JudgeSelect from 'views/components/check/judgeSelect';
	import AnswerSheet from 'views/components/check/answerSheet';
	import SortSelect from 'views/components/check/sortSelect';
	import { handTestResult } from "api/test";
	export default {
		name : 'handExams',
		components: {MasterPage, SingleSelect, AnswerSheet, MultiSelect, JudgeSelect, SortSelect},
		data() {
			return {
				progress:{
					number:0
				},
				answerSheet:{
					singleSelect:[],
					multiSelect:[],
					judgeSelect:[],
					sortSelect:[]
				},
				handWarn:false,
				singleData:[],
				multiData:[],
				judgeData:[],
				sortData:[]
			};
		},
		created() {
			var vm = this;
			if(this.$route.params.id){
				handTestResult(this.$route.params.id).then(res => {
					this.correct = res.avgCorrect;
					res.questions.forEach(function(item){
						let tLen = item.content.length;
						if(item.content[tLen-1] !== '}'){
							item.content = item.content.slice(0,tLen-1);
						}
						item.contentObj = JSON.parse(item.content);
						item.answerShow = false;
						if(!item.userAnswer){
							item.property = 'notDo';
						}else if(item.userAnswer == item.standardAnswer){
							item.property = 'down';
						}else{
							item.property = 'sign';
						}
						if(item.questionType == 'singleSelect'){
							vm.answerSheet.singleSelect.push(item);
						}else if(item.questionType == 'multiSelect'){
							vm.answerSheet.multiSelect.push(item);
						}else if(item.questionType == 'trueFalse') {
							vm.answerSheet.judgeSelect.push(item);
						}else if(item.questionType == 'sortSelect') {
							vm.answerSheet.sortSelect.push(item);
						}
					});
				});
			}else{
				this.$message({
          message: "不存在试卷id",
          type: "warning"
        });
        this.$router.go(-1);
			}
		},
		methods: {
			cancel() {
				this.$router.go(-1);
			},
			anchorScroll(index){
		    let jump = document.querySelectorAll('.problemNumber');
        let total = jump[index].offsetTop;
        let distance = document.documentElement.scrollTop || document.body.scrollTop;
        // 平滑滚动，时长500ms，每10ms一跳，共50跳
        let step = total / 50;
        if (total > distance) {
          smoothDown()
        } else {
          let newTotal = distance - total;
          step = newTotal / 50;
          smoothUp();
        }
        function smoothDown () {
          if (distance < total) {
            distance += step;
　　　　　　　document.body.scrollTop = distance;
            document.documentElement.scrollTop = distance;
            setTimeout(smoothDown, 10);
          } else {
            document.body.scrollTop = total;
            document.documentElement.scrollTop = total;
          }
        }
        function smoothUp () {
          if (distance > total) {
            distance -= step;
　　　　　　　document.body.scrollTop = distance;
            document.documentElement.scrollTop = distance;
            setTimeout(smoothUp, 10);
          } else {
            document.body.scrollTop = total;
            document.documentElement.scrollTop = total;
          }
       } 
			}
		},
		mounted() {
			$(window).scroll(function(e){   //可能还要优化，需要找到更好的方法
				let s = $(window).scrollTop();
				$('.testRight').css('top',s + 'px');
			});
		}
	}
</script>

<style rel="stylesheet/scss" lang="less" scoped>
.singleSelect {
	.selectTitle {
		margin: 0;
		margin-bottom: 16px;
		padding: 0 16px;
		font-size: 14px;
		font-weight: bold;
		border-left:4px solid #00a0e9;
	}
}
.testContent {
	  width: 100%;
	  padding-right: 314px;
	  position: relative;
	  .testLeft {
	    padding-right:16px; 
	    border-right:1px solid  #e0e0e0;
	  }
	}
	.testRight {
	    position: absolute;
	    width: 314px;
	    top: 0;
	    right: 0;
	    padding-left: 16px;
	  }
</style>