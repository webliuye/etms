<template>
	<master-page>
		<div>
			<div>
				<div class="testContent">
					<div class="filter-container">
						<el-row>
							<el-col :span="12" >
								<div>
									<p><strong>{{title.subject}}</strong>{{title.name}}</p>
								</div>
							</el-col>
							<el-col :span="12" >
								<div class="time">
									<p><strong>{{time.hour}}:{{time.minutes}}:{{time.second}}</strong></p>
								</div>
							</el-col>
						</el-row>
					</div>
					<div class="testLeft">
						<div class="singleSelect" v-if="singleData.length > 0">
							<p class="selectTitle">单项选择题</p>
							<SingleSelect :singleData="singleData" :indexLength='1' @countTest="countTest"></SingleSelect>
						</div>
						<div class="singleSelect"  v-if="multiData.length > 0">
							<p class="selectTitle">多项选择题</p>
							<MultiSelect :multiData="multiData" :indexLength='1 + singleData.length' @countTest="countTest">></MultiSelect>
						</div>
						<div class="singleSelect"  v-if="judgeData.length > 0">
							<p class="selectTitle">判断题</p>
							<JudgeSelect :judgeData="judgeData" :indexLength='1 + singleData.length + multiData.length' @countTest="countTest">></JudgeSelect>
						</div>
						<div class="singleSelect"  v-if="sortData.length > 0">
							<p class="selectTitle">排序题</p>
							<SortSelect :sortData="sortData" :indexLength='1 + singleData.length + multiData.length + judgeData.length' @countTest="countTest">></SortSelect>
						</div>
						<div style="height:48px;">
							<div class="fr">
								<el-button class="pull-right" type="primary" @click="handTest()">交卷</el-button>
								<el-button class="pull-right" type="primary" @click="saveTest()" style="margin-right:8px;">保存</el-button>
							</div>
						</div>
					</div>
					<div class="testRight">
						<div class="progress">
							<p><strong>测试进度</strong><span>{{progress.handDo + '/' + progress.all}}</span></p>
							<el-progress :percentage="progress.number"></el-progress>
						</div>
						<TestSheet :answerSheet="answerSheet" style="margin-top:16px;" @anchorScroll="anchorScroll"></TestSheet>
					</div>
				</div>
			</div>
		</div>
		<el-dialog :visible.sync="handWarn" width="30%" :modal-append-to-body="false">
			<img  src="~assets/checkImg/notHand.png" class="imgClass">
			<p class="warnp">您还有试题未完成</p>
			<div slot="footer" class="dialog-footer">
        <el-button @click="handWarn = false">继 续</el-button>
        <!-- <el-button @click="saveTest">保 存</el-button> -->
        <el-button type="primary" @click="handTestYes">交 卷</el-button>
      </div>
		</el-dialog>
	</master-page>
</template>

<script>
	import MasterPage from 'views/layout/MasterPage';
	import SingleSelect from 'views/components/check/singleSelect';
	import MultiSelect from 'views/components/check/multiSelect';
	import JudgeSelect from 'views/components/check/judgeSelect';
	import SortSelect from 'views/components/check/sortSelect';
	import TestSheet from 'views/components/check/testSheet';
	import { getTestPaper, getTestContinuePaper, handTest } from "api/test";
	export default {
		name : 'exercise',
		components: {MasterPage, SingleSelect, TestSheet, MultiSelect, JudgeSelect, SortSelect},
		data() {
			return {
				loading:false,
				title:{
					subject:'',
					name:'测试卷'
				},
				time:{
					hour:'00',
					minutes:'00',
					second:'00'
				},
				Interval:null,
				progress:{
					number:0,
					handDo:0,
					all:0
				},
				handData:{
					testSelfId:null,
					status:null,
					data:[]
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
			}
		},
		created() {
			var vm = this;
 			if(this.$route.params.id){
				this.handData.testSelfId = this.$route.params.id;
				var t = 0;  //用来计数已做的
				getTestContinuePaper(this.$route.params.id).then(res => {
					this.title.subject = res.testSelf.subjectName;
					res.questions.forEach(function(item){
						let tLen = item.content.length;
						if(item.content[tLen-1] !== '}'){
							item.content = item.content.slice(0,tLen-1);
						}
						item.contentObj = JSON.parse(item.content);
						if(item.userAnswer){
							t++;
						} else {
							item.userAnswer = '';
						}
						if(item.questionType == 'singleSelect'){
							vm.singleData.push(item);
						}else if(item.questionType == 'multiSelect'){
							vm.multiData.push(item);
						}else if(item.questionType == 'trueFalse') {
							vm.judgeData.push(item);
						}else if(item.questionType == 'sortSelect') {
							vm.sortData.push(item);
						}
					});
					vm.answerSheet.singleSelect = vm.singleData;
					vm.answerSheet.multiSelect = vm.multiData;
					vm.answerSheet.judgeSelect = vm.judgeData;
					vm.answerSheet.sortSelect = vm.sortData;
					this.progress.all = vm.singleData.length + vm.multiData.length + vm.judgeData.length + vm.sortData.length;
					this.progress.handDo = t;
					if(this.progress.all > 0){
						this.progress.number = parseInt(((this.progress.handDo / this.progress.all).toFixed(2)) * 100);
					}
					if(Number(res.testSelf.duration) > 0){
						this.time.hour = parseInt(res.testSelf.duration/3600);
						if(this.time.hour < 10){
							this.time.hour = '0' + this.time.hour;
						}
						this.time.minutes = parseInt((res.testSelf.duration%3600)/60);
						if(this.time.minutes < 10){
							this.time.minutes = '0' + this.time.minutes;
						}
						this.time.second = res.testSelf.duration%60;
						this.update();
					}else{
						this.time.hour = '00';
						this.time.minutes = '00';
						this.time.second = '00';
					}
					this.startTimer();
				});
			}
		},
		methods: {
			countTest() {
				var t = 0;
				var vm = this;
				vm.singleData.forEach(function(item){
					if(item.userAnswer){
						t++;
					}
				});
				vm.multiData.forEach(function(item){
					if(item.userAnswer){
						t++;
					}
				});
				vm.judgeData.forEach(function(item){
					if(item.userAnswer){
						t++;
					}
				});
				vm.sortData.forEach(function(item){
					if(item.userAnswer){
						item.userAnswer = item.userAnswer.toUpperCase();
						t++;
					}
				});
				this.progress.handDo = t;
				if(this.progress.all > 0){
					this.progress.number = parseInt(((this.progress.handDo / this.progress.all).toFixed(2)) * 100);
				}
			},
			update() {
				var second = Number(this.time.second);
				second++;
				if(second > 59){
					this.time.second = '00';
					var minutes = Number(this.time.minutes);
					minutes++;
					if(minutes > 59){
						this.time.minutes = '00';
						var hour = Number(this.time.hour);
						hour++;
						if(hour < 9){
							this.time.hour = '0' + hour;
						}else{
							this.time.hour = String(hour);
						}
					}else if(minutes < 10){
						this.time.minutes = '0' + minutes;
					}else{
						this.time.minutes = String(minutes);
					}
				}else if(second < 10){
					this.time.second = '0' + second;
				}else{
					this.time.second = String(second);
				}
			},
			startTimer() {
				this.Interval = setInterval(this.update,1000);
			},
			handTest() {
				if(this.loading){
					return;
				}
				var boolean = false;
				var data = this.singleData.concat(this.multiData,this.judgeData,this.sortData);
				this.handData.data = data;
				data.forEach(function(item){
					if(!item.userAnswer){
						boolean = true;
					}
				});
				if(boolean){
					this.handWarn = true;
				}else{
					this.handData.status = 'complete';
					this.loading = true;
					handTest(this.handData).then(res => {
						this.loading = false;
						this.$router.push({ name: 'TestResult', params:{id:this.handData.testSelfId}});
					}).catch(error => {
						this.loading = false;
						this.$message({
              message: "提交失败!请重新提交",
		          type: "warning"
		        });
					});
				}
				//this.handWarn = true;
			},
			handTestYes() {
				if(this.loading){
					return;
				}
				this.handData.status = 'complete';
				this.loading = true;
				handTest(this.handData).then(res => {
					this.loading = false;
					this.$router.push({ name: 'TestResult', params:{id:this.handData.testSelfId}});
				}).catch(error => {
					this.loading = false;
				});
			},
			saveTest() {
				if(this.loading){
					return;
				}
				this.loading = true;
				var data = this.singleData.concat(this.multiData,this.judgeData,this.sortData);
				this.handData.data = data;
				this.handData.status = 'uncompleted';
				handTest(this.handData).then(res => {
					this.loading = false;
					this.$router.push({ name: 'CheckIndex'});
				}).catch(error => {
					this.loading = false;
				});
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
		},
		beforeRouteLeave (to, from, next) {
			clearInterval(this.Interval);
			next();
		}
	}
</script>
<style rel="stylesheet/scss" lang="less" scoped>
	.filter-container {
		height: 64px;
		line-height: 64px;
		border-right:1px solid  #e0e0e0;
		border-bottom: 1px solid  #e0e0e0;
		p {
			margin: 0;
			font-size: 14px;
			color: #555;
			strong {
				padding-right: 16px;
			}
		}
		.time {
			text-align: right;
			padding-right: 16px;
			p {
				float: right;
				display: inline;
				font-size: 16px;
				width: 118px;
				background:url('~assets/checkImg/time.png') left center no-repeat;
			}
		}
		.progress {
			p {
				height: 36px;
				line-height: 36px;
				font-size: 14px;
				span {
					float: right;
					display: inline;
					padding-right: 24px;
				}
				strong {
					font-weight: normal;
					font-size: 14px;
				}
			}
		}
		.imgClass {
			display: block;
			margin: 0 auto;
			width: 80%;
		}
		.warnp {
			width: 100%;
			text-align: center;
			margin: 0;
			font-size: 12px;
		}
	}
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
	  	padding-top: 16px;
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
