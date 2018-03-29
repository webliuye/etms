<template>
	<master-page>
		<div>
			<h3>正确率</h3>
			<div class="correct">
				<el-row>
					<el-col :span="24">
						<div style="width:120px;margin:0 auto;">
							<el-progress type="circle" :width="120" :percentage="correct"></el-progress>
						</div>						
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<p><span>{{correctValue.number}}</span>%</p>
						<p>全站平均正确率</p>
					</el-col>
					<el-col :span="12">
						<p><span>{{correctValue.rank}}</span>名</p>
						<p>全站排名</p>
					</el-col>
				</el-row>
			</div>
			<div>
				<AnswerSheet :answerSheet="answerSheet"></AnswerSheet>
			</div>
			<div style="margin-top:16px; height:40px;">
				<el-button class="fr" type="primary" @click="cancel()">返回</el-button>
				<el-button class="pull-right" style="margin-right:16px;" type="primary" @click="analysis()">查看全部解析</el-button>
			</div>
		</div>
	</master-page>
</template>
<script>
	import MasterPage from 'views/layout/MasterPage';
	import AnswerSheet from 'views/components/check/answerSheet';
	import { handTestResult } from "api/test";
	import { getPrsRank } from "api/check";
	export default {
		name : 'testResult',
		components: {MasterPage, AnswerSheet},
		data() {
			return {
				correct:0,
				answerSheet:{
					singleSelect:[],
					multiSelect:[],
					judgeSelect:[],
					sortSelect:[]
				},
				correctValue: {
					rank: 0,
					number:0
				}
			}
		},
		created() {
			var vm = this;
			if(this.$route.params.id){
				handTestResult(this.$route.params.id).then(res => {
					this.correctValue.number = res.avgCorrect;
					this.correct = parseInt((res.testSelf.questionRightNum/res.testSelf.questionTotalNum).toFixed(2) * 100);
					res.questions.forEach(function(item){
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
			getPrsRank().then(res => {
				if(res != -1){
					this.correctValue.rank = res;
				}else{
					this.correctValue.rank = 0;
				}
			});
		},
		methods: {
			analysis() {
				this.$router.push({ name: 'HandExams', params: {id: this.$route.params.id} });
			},
			cancel() {
				this.$router.push({ name: 'CheckIndex' });
			}
		},
		mounted() {

		}
	}
</script>
<style rel="stylesheet/scss" lang="less" scoped>
	h3 {
		font-size: 16px;
		color: #333;
	}
	.correct {
		width: 100%;
		p {
			width: 100%;
			text-align: center;
			font-size: 12px;
			color: #555;
			span {
				font-size: 36px;
				color: #ff4949;
				padding-right: 8px;
			}
		}
	}
</style>