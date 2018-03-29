<template>
	<div>
		<div class="all-content" v-if="setNeed" >
      <div style="position:fixed;width:160px;top:0; left:0;height:100%;background:rgba(0,0,0,0.3);z-index:10000"></div>
      <div >
        	<SuperSet :active="active" ></SuperSet>
      </div>
      <!--  -->
		</div>
		<div class="all-content" v-if="setNeedTwo">
			<el-tabs v-model="activeName" class="index-change" @tab-click="tabClick">
				<el-tab-pane label="我的实验" name="second">
					<TeacherSup v-if="activeName == 'second'"  :Arrange="true" ></TeacherSup>
				</el-tab-pane>
				<el-tab-pane label="学校计划" name="first">
					<div >
						<div class="grid-content" style="padding:16px 24px;">
							<p class="title">
								<strong>待办事项</strong>本学年实验计划: 应做
								<span>{{planNumber.totalCount}}</span> 份,已做
								<span>{{planNumber.infactCount}}</span> 份.
								<el-button type="primary" @click="goPlan" class="fr">制定计划</el-button>
							</p>
						</div>
						<!-- <div class="grid-content">
							<div class="plan-div">
								<img src="../../../assets/img/plan.png" />
								<p>我的计划</p>
							</div>
							<div class="to-div">
								<img src="../../../assets/img/toR.png" />
							</div>
							<div class="plan-div">
								<img src="../../../assets/img/booking.png" />
								<p>我的预约</p>
							</div>
							<div class="to-div">
								<img src="../../../assets/img/toR.png" />
							</div>
							<div class="plan-div">
								<img src="../../../assets/img/arrange.png" />
								<p>我的安排</p>
							</div>
							<div class="to-div">
								<img src="../../../assets/img/toR.png" />
							</div>
							<div class="plan-div">
								<img src="../../../assets/img/log.png" />
								<p>我的日志</p>
							</div>
						</div> -->
						<div class="main-content">
							<div class="grid-content" style="padding:8px 24px;">
								<el-row style="width:100%;">
									<el-col :span="10">
										<p>
											<strong>实验开出完成度</strong>
										</p>
									</el-col>
									<el-col :span="4">
										<p style="text-align:right;padding:0 16px">
											<span>整体完成度</span>
										</p>
									</el-col>
									<el-col :span="9">
										<p>
											<el-progress :stroke-width="8" :percentage="totalPercent"></el-progress>
										</p>
									</el-col>
									<el-col :span="1">
										<p>
											<span>{{totalNumber}}</span>
										</p>
									</el-col>
								</el-row>
							</div>
							<div class="planCon" style="margin-top:8px;">
								<el-row style="width:100%;">
									<el-col :span="12">
										<p>
											<span>实验计划名称</span>
										</p>
									</el-col>
									<el-col :span="12">
										<P style="text-align:right;">
											<span>实验开出完成度</span>
										</P>
									</el-col>
								</el-row>
							</div>
							<div class="planCon" v-for="(item,index)  in progressList" :key="index">
								<el-row style="width:100%;">
									<el-col :span="14">
										<p>
											<span>
												<a class="el-button--text" @click="classInfo(item)">{{item.name}}</a>
											</span>
										</p>
									</el-col>
									<el-col :span="9">
										<p>
											<el-progress :stroke-width="8" :percentage="item.percentCount" ></el-progress>
										</p>
									</el-col>
									<el-col :span="1">
										<p>
											<span>{{item.NumberCount}}</span>
										</p>
									</el-col>
								</el-row>
							</div>
						</div>
					</div>
				</el-tab-pane>
				<el-tab-pane label="代登记实验" name="third" v-if="powerLog">
					<TeacherEasy v-if="activeName == 'third'" :Arrange="true" ></TeacherEasy>
				</el-tab-pane>
			</el-tabs>


		</div>


	</div>


</template>

<script>
	import { mapGetters } from 'vuex'
	import TeacherSup from 'views/dashboard/default/teacherSup'
	import TeacherEasy from 'views/dashboard/default/teacherEasy'
	import SuperSet from 'views/dashboard/default/superSet'
	import { getIndexPlan, getPlanOpenCount, getSecurityBtn} from 'api/index';
	import { setInfostate} from 'api/login';
	// import { getProgressList} from 'api/index';
	export default {
		components: {
      TeacherSup,SuperSet,TeacherEasy
    },
		data() {
			return {
				searchData:{
					week: '1'
				},
				setNeed:false,
				setNeedTwo:false,
				active:null,
				planNumber:{
					totalCount:0,
					infactCount:0
				},
				totalPercent:0,
				totalNumber:'',
				fixed:true,
				activeName:'second',
				planList:[],
				progressList:[]
			};
		},
		computed: {
	    ...mapGetters([
        'powerLog'
      ])
	  },
		created() {
			if(this.$store.state.commonData.tabAction){
				this.activeName = this.$store.state.commonData.tabAction;
			}else{
				this.activeName = 'second';
				this.$store.state.commonData.tabAction = 'second';
			}
			//this.activeName = this.$store.state.commonData.tabAction || 'second';
			getSecurityBtn().then(res => {
			});
			setInfostate().then(res=>{
				// console.log(res);
				// this.setNeed=true;
				// this.active=1;
				if(res.classState){

					if(res.classRoomState){

						if(res.openDateState){
							this.setNeedTwo = true;
							this.setNeed=false;
							// getIndexPlan(this.searchData).then(res => {
							// 	this.planAmount = res.planAmount;
							// 	this.planList = res.myplanLists;
							// 	// console.log(res);
							// });
							getPlanOpenCount().then(res => {
								// console.log(res);
								res.planTotalCount?this.totalPercent =parseInt((res.planInfactCount / res.planTotalCount)* 10000)/100 :this.totalPercent=0;

								this.planNumber.totalCount = res.totalCount;
								this.planNumber.infactCount = res.infactCount;

								this.totalNumber = res.planInfactCount + "/" + res.planTotalCount;
								this.progressList = res.planReportVoList;
								this.progressList.forEach(function(item) {
									if(item.totalCount > 0){
										//item.percentCount = parseInt((item.infactCount / item.totalCount)* 10000)/100;
										let t = parseInt((item.infactCount / item.totalCount)* 10000)/100;
										if(t < 100){
											item.percentCount = t;
										}else{
											item.percentCount = 100;
										}
									}else{
										item.totalCount = 0;
									}
									//item.totalCount>0?item.percentCount = parseInt((item.infactCount / item.totalCount)* 10000)/100:item.totalCount=0;
									item.NumberCount = item.infactCount + "/" + item.totalCount;
								});
							});
						}else{
							this.setNeedTwo = false;
							this.setNeed=true;
							this.active=2;
						}

					}else{
						this.setNeedTwo = false;
						this.setNeed=true;
						this.active=1;
					}

				}else{
					this.setNeedTwo = false;
					this.setNeed=true;
					this.active=0;
				}
			})
			// getProgressList().then(res => {
			// 	// this.progressList=res;
			// });
		},
		methods: {
			goBooking(item){
        this.$router.push({ name: 'BookingInfo', params: {id:item.planDetailId,row:item}});
      },
    //   handleClick() {
    //   	this.fixed = !this.fixed;
    //   },
      classInfo(item) {
      	this.$router.push({ name: 'DashClassInfo', params: {planId:item.id}});
      },
      goPlan() {
      	this.$router.push({ name: 'PlanView'});
      },
      tabClick() {
      	this.$store.commit('SET_TABACTION',this.activeName);
      	if(this.activeName == 'second'){
      		this.$store.commit('SET_STAFFNAME',null);
      	}
      }
		}
	}
</script>
<style lang="less" scoped>
@base-bg: #00a0e9;
@hoverColor: #00a0e9;
	.grid-content {
		border: 1px solid #ddd;
		background-color: #fff;
		padding: 16px 24px;
		display: flex;
		justify-content: space-between;
	}
	.plan-div {
		width: 182px;
		height: 84px;
		border: 1px solid #ddd;
		border-radius: 4px;
		cursor: pointer;
		justify-content: space-around;
	}
	.plan-div:hover {
		border: 1px solid #00a0e9;
	}
	.plan-div img {
		float: left;
		display: inline;
		margin-left: 24px;
		margin-top: 12px;
	}
	.plan-div p {
		float: left;
		display: inline;
		padding-left: 4px;
		padding-top: 6px;
		font-size: 14px;
		color: #333;
		line-height: 48px;
	}
	.plan-div p span {
		font-size: 24px;
	}
	.to-div {
		width: 60px;
		height: 84px;
	}
	.to-div img {
		display: block;
		margin: 0 auto;
		padding-top: 12px;
	}
	.main-content {
		border: 1px solid #eee;
		margin-top: 24px;
		width: 100%;
		font-size: 12px;
	}
	.item-content p {
		padding:  16px 24px;
		line-height: 48px;
		height: 48px;
		font-size: 14px;
		color: #333;
	}
	.item-content p .plan-name {
		display: inline-block;
		width: 16.5%;
		max-width: 260px;
		min-width: 140px;
		font-weight: bold;
		overflow: hidden;
	}
	.item-content p .class-name {
		display: inline-block;
	}
	.item-content p a {
		margin-right: 8px;
		display: inline-block;
		width: 48px;
		height: 48px;
		border-radius: 24px;
		background-color: #00a0e9;
		color: #fff;
		text-align: center;
	}
	.grid-content p.title {
		width: 100%;
		line-height: 28px;
		padding: 0;
		margin: 0;
		font-size: 12px;
	}
	.grid-content p.title span {
		font-weight: bold;
	}
	.grid-content p.title strong {
		padding-right: 24px;
	}
.planCon{
	padding:0 16px;background: #fff;
	border-bottom: 1px solid #f0f0f0;
	font-size: 12px;
}
span{
	padding-left:8px;

}


</style>
