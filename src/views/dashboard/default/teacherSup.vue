<template>
	<div class="all-content">
		<div class="grid-content select-arrange">
			<el-row style="width:100%;" v-if="Arrange && (arrangeAll != 0)">
				<el-col :span="24">
					<p class="title pb">
						<strong style="padding-right:24px;">待办事项:</strong>待安排上课预约
						<span >{{arrangeAll}}</span> 份。
						<el-button type="primary" class="fr" @click="goArrange" v-if='powerArrang'>去安排</el-button>
					</p>
				</el-col>
			</el-row>

			<el-row style="width:100%;">
				<el-col :span="10">
					<el-select v-model="planId" @change="changePlan" class="plan-sele" placeholder="请选择实验计划" style="margin-top:8px; font-weight:bold;">
		        <el-option
		          v-for="(item,index)  in planData"
		          :key="index"
		          :label="item.name"
		          :value="item.id">
		        </el-option>
		      </el-select>
				</el-col>
				<el-col :span="4">
					<p style="text-align:right;padding:0 8px; margin:8px 0;"><span>实验开出完成度</span></p>
				</el-col>
				<el-col :span="9">
					<p style="text-align:right; margin:8px 0;"><el-progress :stroke-width="8" :percentage="planCount" style="font-size:12px;"></el-progress></p>
				</el-col>
				<el-col :span="1">
						<p style="text-align:right; margin:8px 0;"><span>{{planCountNumber}}</span></p>
				</el-col>
			</el-row>
		</div>
		<div class="box" >
			<div class="left-line">
				<div class="img"  @click="changeBolValue('isPlan')">
					<img src="../../../assets/img/trans.png" >
					<img src="../../../assets/img/active.png" :class="{clickdiv:changeBoolean.isPlan}" >
					<div>
						<img src="../../../assets/img/plans.png" >
						<p>待做实验</p>
						<h4>{{countObj.planTotal}}</h4>
					</div>
				</div>

				<div class="img"  @click="changeBolValue('isBooking')" v-if='powerBooking'>
					<img src="../../../assets/img/trans.png" >
					<img src="../../../assets/img/active.png" :class="{clickdiv:changeBoolean.isBooking}" >
					<div>
						<img src="../../../assets/img/bookings.png" >
						<p>实验预约</p>
						<h4>{{countObj.bookingTotal}}</h4>
					</div>
				</div>
				<div class="img" @click="changeBolValue('isArrange')" v-if='powerArrang'>
					<img src="../../../assets/img/trans.png" >
					<img src="../../../assets/img/active.png" :class="{clickdiv:changeBoolean.isArrange}">
					<div>
						<img src="../../../assets/img/arranges.png" >
						<p>实验安排</p>
						<h4>{{countObj.arangeTotal}}</h4>
					</div>
				</div>
				<div class="img"  @click="changeBolValue('isLog')">
					<img src="../../../assets/img/trans.png" >
					<img src="../../../assets/img/active.png" :class="{clickdiv:changeBoolean.isLog}" >
					<div>
						<img src="../../../assets/img/logs.png" >
						<p>实验日志</p>
						<h4>{{countObj.logTotal}}</h4>
					</div>
				</div>

			</div>
			<div class="r-Content">
				<div class="main-content" v-if="changeBoolean.isPlan">
					<div class="index-right" v-if="!listDataBln">
						<div class="item-content" v-for="(item,index)  in planList" :key="index">
							<img class="pos-img" src="../../../assets/img/pinr.png" />
							<p>
								<span class="plan-name">{{item.planDetailName}}</span>
								<span class="class-name"  :title="item.classIdsName?item.classIdsName.join('、'):item.classIdsName">
									<span v-for="ite in item.classInfoList" class="itespan" :key="ite.classId">{{ite.className}}</span>
								</span>
								<a href="javascript:;" @click="registerIndexLog(item)" class="fr">登记</a>
								<a href="javascript:;" @click="goBooking(item)" class="fr" v-if='powerBooking'>预约</a>
							</p>
							<p  class="typestyle"  v-if="item.resourceTypeCountList">
								<span v-for="(ite,index) in item.resourceTypeCountList" class="spanList" :key="index" @click="goSource(item)">
									<span v-for="(items,index) in allSourceType" v-if="ite.sourceType == items.value" :key="index"> <img :src="imgPaths[items.value]"> {{items.label}} ({{ite.typeCount}})</span>
								</span>
							</p>
						</div>
					</div>
				</div>
				<div class="main-content" v-if="changeBoolean.isBooking&&!listDataBln">
					<div class="item-content" v-for="(item,index)  in bookingList" :key="index">
						<img class="pos-img" src="../../../assets/img/pinr.png" />
						<p>
							<span class="booking-name">{{item.planDetailName}}</span>
							<span class="booking-class" :title="item.classNames">
								<span v-for="(ite,idx) in item.classArray" class="itespan" :key="idx">{{ite}}</span>
							</span>
							<span class="booking-time">{{item.classDate.slice(0,10)}}</span>
							<span class="booking-state" v-if="item.state == 0">
								<i class="icon-state icon-state-0"></i>待安排</span>
							<span class="booking-state" v-if="item.state == 2">
								<i class="icon-state icon-state-2"></i>已拒绝</span>
							<a href="javascript:;" @click="deleteBooking(item)" class="fr">取消</a>
							<a href="javascript:;" v-if="item.state == 0" @click="reviseBooking(item)" class="fr">修改</a>
							<a href="javascript:;" v-if="item.state == 2" @click="reviseBooking(item)" class="fr">预约</a>
						</p>
						<p class="typestyle"   v-if="item.resourceTypeCountList">
								<span v-for="(ite,idx) in item.resourceTypeCountList" class="spanList" :key="idx"  @click="goSource(item)">
									<span v-for="(items,index) in allSourceType" v-if="ite.sourceType == items.value" :key="index"> <img :src="imgPaths[items.value]"> {{items.label}} ({{ite.typeCount}})</span>
								</span>
						</p>
						<p v-if="item.state == 2" class="arrange-div">
							<span>【拒绝说明】</span>
							<strong>实验员：</strong>
							<span style="padding-right:16px;">{{item.arangeUserName}}</span>
							<strong>安排时间：</strong>
							<span style="padding-right:16px;">{{item.arangeDate}}</span>
							<strong>安排说明：</strong>
							<span>{{item.feedback}}</span>
						</p>
					</div>
				</div>
				<div class="main-content" v-if="changeBoolean.isArrange&&!listDataBln">
					<div class="item-content" v-for="(item,index)  in arrangeList" :key="index">
						<img class="pos-img" src="../../../assets/img/pinr.png" />
						<p>
							<span class="booking-name">{{item.planDetailName}}</span>
							<span class="booking-class" :title="item.classNames">
								<span v-for="(ite,idx) in item.classArray" class="itespan" :key="idx">{{ite}}</span>
							</span>
							<span class="booking-time">{{item.classDate.slice(0,10)}}</span>
							<span class="booking-state" v-if="item.state == 0">未安排</span>
							<span class="booking-state" v-if="item.state == 1">可以上课</span>
							<span class="booking-state" v-if="item.state == 2">不能上课</span>
							<a href="javascript:;" v-if="item.state == 1" @click="registerLog(item)" class="fr">登记</a>
							<a href="javascript:;" v-if="item.state != 1" @click="goBooking(item)" class="fr">预约</a>
							<a href="javascript:;" @click="arrangeDetail(item)" class="fr">详情</a>
						</p>
						<p class="typestyle"   v-if="item.resourceTypeCountList">
								<span v-for="(ite,idx) in item.resourceTypeCountList" class="spanList" :key="idx" @click="goSource(item)">
									<span v-for="(items,index) in allSourceType" v-if="ite.sourceType == items.value" :key="index"> <img :src="imgPaths[items.value]"> {{items.label}} ({{ite.typeCount}})</span>
								</span>

						</p>
						<p class="arrange-div">
							<strong>安排说明：</strong>
							<span>{{item.feedback}}</span>
						</p>
					</div>
				</div>
				<div class="main-content" v-if="changeBoolean.isLog&&!listDataBln">
					<div class="item-content" v-for="(item,index)  in logList" :key="index">
						<img class="pos-img" src="../../../assets/img/pinr.png" />
						<p>
							<span class="booking-name">{{item.courseName}}</span>
							<span class="booking-class" :title="item.listClassNames?item.listClassNames.join('、'):item.listClassNames">
								<span v-for="(ite,idx) in item.listClassNames" class="itespan" :key="idx">{{ite}}</span>
							</span>
							<span class="booking-time">{{item.classDate.slice(0,10)}}</span>
							<a href="javascript:;" @click="deleteLog(item)" class="fr">删除</a>
							<a href="javascript:;" @click="reviseLog(item)" class="fr">详情</a>
						</p>
						<p class="typestyle" v-if="item.resourceTypeCountList">
								<span v-for="(ite,idx) in item.resourceTypeCountList" class="spanList" :key="idx"  @click="goSource(item)">
									<span v-for="(items,index) in allSourceType" v-if="ite.sourceType == items.value" :key="index"> <img :src="imgPaths[items.value]"> {{items.label}} ({{ite.typeCount}})</span>
								</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	 </div>
</template>

<script>
	import { mapGetters } from 'vuex';
	import { getIndexPlan, getBookingList, getArrangeList, deleteBook, getLogInfoList, getPlan, getPlanCount, getOpenDate} from 'api/index';
	import { getSourceTypeCount} from 'api/source';
	import { deleteOneLog} from 'api/log';
	export default {
		props:{
			Arrange: {
          type: Boolean,
          default: false
        },
		},
		data() {
			return {
				imgPaths: [],
				arrangeAll:0,
				countObj:{
					planTotal:'',
					bookingTotal:'',
					arangeTotal:'',
					logTotal:'',
					notArangeTotal:'0'
				},
				searchData:{
					planId:''
				},
				planList:[],
				bookingList:[],
				arrangeList:[],
				logList:[],
				changeBoolean:{},
				planData:[],
				planId:null,
				planCount:0,
				planCountNumber:'',
				term:'1',
				listDataBln:false
			};
		},
		computed: {
			...mapGetters([
			'powerBooking',
			'powerArrang',
			'allSourceType'
			])
	 	},
		created() {
			getPlanCount().then(res => {
				if (res && res.notArangeTotal) {
					this.arrangeAll = res.notArangeTotal;
				} else {
					this.arrangeAll = 0;
				}
			});
			const vm = this;
			this.$store.dispatch("GetAllSourceType").then(res => {
				res.forEach(function(s) {
					let t = require(`src/assets/sourceImg/tiny/${s.value}.png`);
					vm.imgPaths[s.value] = t;
				});
			});
			this.changeBoolean = this.$store.state.commonData.changeBool;
			getPlan().then(res => {
				this.planData = res;
				if(res[0] && !this.$store.state.commonData.planId){
					this.planId = res[0].id;
					this.searchData.planId = res[0].id;
					this.getPnBkCount();
					this.getListData();
				}else if(this.$store.state.commonData.planId){
					var planDa;
					var vm = this;
					planDa = res.filter(function(item){
						return item.id == vm.$store.state.commonData.planId
					});
					if(planDa.length>0){
						this.planId = this.$store.state.commonData.planId;
						this.searchData.planId = this.planId;
						this.getPnBkCount();
						this.getListData();
					}else{
						if(res.length>0){
							this.planId = res[0].id;
							this.searchData.planId = res[0].id;
							this.getPnBkCount();
							this.getListData();
						}else{
							this.planId = '';
							this.searchData.planId = '';
						}
					}
				}
			});
		},
		methods: {
			deleteLog(item) {
				let obj = {};
				obj.courseId = item.courseId;
				obj.staffId = this.$store.state.user.userInfo.staffId;
				this.$confirm('你确定要删除此条实验日志吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        	deleteOneLog(obj).then(res => {
						this.$message({
	            type: 'success',
	            message: '删除成功!'
	          });
	          this.getListData();
	          this.getPnBkCount();
					}).catch(error => {

					});
        });

			},
			changePlan() {
				this.searchData.planId = this.planId;
				this.$store.commit('SET_PLANID',this.planId);
				if(this.planId){
					this.getPnBkCount();
					this.getListData();
				}
			},
			goArrange() {
				this.$router.push({ name: 'ArrangeIndex' });
			},
			getPnBkCount() {

				getPlanCount(this.planId).then(res => {
					this.countObj = res;
					this.planCount = parseInt((this.countObj.logTotal/(this.countObj.logTotal+this.countObj.planTotal+this.countObj.bookingTotal+this.countObj.arangeTotal))*10000)/100;
					if(!this.planCount){
						this.planCount=0;
					}
					this.planCountNumber = this.countObj.logTotal + '/' + (this.countObj.logTotal+this.countObj.planTotal+this.countObj.bookingTotal+this.countObj.arangeTotal);

				});
			},
			getListData(){
				if(!this.planId){
					this.$message('暂无实验计划信息，请先制定实验计划');
					this.$router.push({ name: 'PlanView' });
					return;
				}
				this.listDataBln = false;
				var vm=this;
				if(this.changeBoolean.isPlan){
					getIndexPlan(this.searchData).then(res => {
						// this.planAmount = res.planAmount;
						if(!res.myplanLists || res.myplanLists.length < 1){
							this.listDataBln = true;
							this.planList = [];
						}else{
							this.listDataBln = false;
							if(res.myplanLists.classInfoList && res.myplanLists.classInfoList.length > 0) {
								res.myplanLists.classIdsName = [];
								res.myplanLists.classInfoList.forEach(function(s){
									res.myplanLists.classIdsName.push(s.className);
								});
							}
							vm.planList = res.myplanLists;
						}
					});
				}
				if(this.changeBoolean.isBooking){
					getBookingList(this.searchData).then(res => {

						if(!res || res.length < 1){
							this.listDataBln = true;
							this.bookingList = [];
						}else{
							this.listDataBln = false;
							this.bookingList = res;
							this.bookingList.forEach(function(item){
								item.classArray = item.classNames.split("、");
							});
						}
					});
				}
				if(this.changeBoolean.isArrange){
					getArrangeList(this.searchData).then(res => {
						if(!res || res.length < 1){
							this.listDataBln = true;
							this.arrangeList = [];
						}else{
							this.listDataBln = false;
							this.arrangeList = res;
							this.arrangeList.forEach(function(item){
								item.classArray = item.classNames.split("、");
							});
						}
					});
				}
				if(this.changeBoolean.isLog){
					getLogInfoList(this.searchData).then(res => {

						if(!res || res.length < 1){
							this.listDataBln = true;
							this.logList = [];
						}else{
							this.listDataBln = false;
							this.logList = res;
						}
					});
				}
			},
	  goBooking(item){
        this.$router.push({ name: 'BookingInfo', params: {id:item.planDetailId,row:item}});
      },
      goSource(item) {
      	this.$router.push({ name: 'Source', query: {catalogueId:item.catalogueId,textBookCode:item.textBookCode}});
      },
      reviseBooking(item){
      	this.$router.push({ name: 'RevisebookingInfo', params: {id:item.courseId,row:item}});
      },
    //   beforeWeek() {
    //   	if(this.searchData.week > 1){
	// 		  this.searchData.week--;
	// 		  this.planList=[];
    //   		this.getListData();
    //   	}
    //   },
		arrangeDetail(item) {
			this.$router.push({ name: 'ArrangeInfo', params: {courseId:item.courseId}});
		},
    //   nextWeek() {
    //   	if(this.searchData.week < 20){
	// 		  this.searchData.week++;
	// 		   this.planList=[];
    //   		this.getListData();
    //   	}
	//   },
	//   changeWeek(item){
	// 	  	this.searchData.week=item;
	// 	     this.planList=[];
    //   		this.getListData();
	//   },
      //格式化布尔值
      changeBool() {
      	this.changeBoolean.isPlan = false;
      	this.changeBoolean.isBooking = false;
      	this.changeBoolean.isArrange = false;
      	this.changeBoolean.isLog = false;
      },
      changeBolValue(val){
        this.changeBool();
        console.log(val);
      	this.changeBoolean[val] = true;
      	this.$store.commit('SET_CHANGEBOOL',this.changeBoolean);
      	this.getListData();
      },
      registerLog(item){   //安排登记日志
      	this.$router.push({ name: 'LogAdd', params: {courseId:item.courseId,isEdit:false,row:item}});
      },
      reviseLog(item) {  //修改日志
      	if(item.bookingState == '0'){   //未预约
      		this.$router.push({ name: 'LogAddIndex', params: {planDetailId:item.courseId,isEdit:true,row:item}});
      	}else{
      		this.$router.push({ name: 'LogAdd', params: {courseId:item.courseId,isEdit:true,row:item}});
      	}
      },
      registerIndexLog(item){
      	this.$router.push({ name: 'LogAddIndex', params: {planDetailId:item.planDetailId,isEdit:false,row:item}});
      },
      deleteBooking(item){
      	var vm = this;
      	this.$confirm('你确定要删除此条预约信息吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteBook(item.courseId).then(res => {
          	vm.changeBolValue('isBooking');
          	vm.getPnBkCount();
						vm.getListData();
          	vm.$message({
              type: 'success',
              message: '删除成功!'
            });
          });
        });
      }
		}
	}
</script>
 <style lang="less" scoped>

.grid-content {
		border: 1px solid #e1e3e4;
		background-color: #fff;
		padding:8px 24px;
		font-size: 12px;

	}
	.select-arrange {
		padding:8px 24px 0;
		border: 1px solid #e1e3e4;
		background-color: #fff;
		font-size: 12px;
		div{
			line-height: 28px;
		}
	}
	.pb{

			margin:0;
			width: 100%;
			line-height: 28px;
			padding-bottom: 8px;
			border-bottom: 1px dashed #ddd;

	}

	.plan-div {
		width: 182px;
		height: 84px;
		border: 1px solid #eee;
		border-radius: 4px;
		cursor: pointer;
		justify-content: space-around;
	}
	.plan-div:hover {
		border: 1px solid #00a0e9;
	}
	.clickdiv {
		opacity: 1!important;
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
		font-size: 12px;
		color: #323437;
		line-height: 24px;
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
		margin-top: 16px;
		height: auto;
		position: relative;
	}
	.main-content p {
		width: 100%;

	}
	.main-content p .booking-name{
		display: inline-block;
		width: 24%;
		max-width: 360px;
		min-width: 160px;
		font-weight: bold;
		white-space:nowrap;
		text-overflow:ellipsis;
		overflow: hidden;
	}
	.main-content p .booking-class{
		display: inline-block;
		width: 32%;
		height: 48px;
		overflow: hidden;
	}
	.main-content p .booking-time{
		display: inline-block;
		width: 10%;
		min-width: 80px;
		overflow: hidden;
	}
	.main-content p .booking-state{
		display: inline-block;
		width: 7%;
		min-width: 60px;
		overflow: hidden;
	}
	.index-left {
		position: absolute;
		width: 60px;
		left: 0;
		top: -12px;
		height: 460px;
	}
	.index-right {
		width: 100%;
		height: auto;
		overflow: auto;
	}
	.item-content {
		position: relative;
		width: 100%;
		height: auto;
		padding-bottom: 24px;
		background: url('../../../assets/img/plan-bg.png') center center no-repeat;
		background-size: 100% 100%;
	}
	.pos-img {
		position: absolute;
		left: 10px;
		top: -6px;
	}
	.item-content p {
		margin-top: 6px;
		padding:  8px 16px 0 48px;
		line-height: 48px;
		height: 36px;
		font-size: 12px;
		color: #333;
	}
	.item-content p .plan-name {
		display: inline-block;
		width: 30%;
		max-width: 360px;
		min-width: 240px;
		font-weight: bold;
		text-overflow: ellipsis;
  	white-space: nowrap;
		overflow: hidden;
	}
	.item-content p .class-name {
		display: inline-block;
		width: 40%;
		height: 48px;
		overflow: hidden;
	}
	.item-content p a {
		margin-right: 8px;
		margin-top: 8px;
		display: inline-block;
		width: 64px;
		line-height: 32px;
		// border-radius: 24px;
		background-color: #00a0e9;
		color: #fff;
		text-align: center;
	}
	.slot-div {
		width: 16px;
		height: 16px;
		border-radius: 8px;
		background-color: #00a0e9;
		margin: 8px auto;
	}
	.border-div {
		position:relative;
		height: 496px;
		width: 2px;
		background-color: #00a0e9;
		margin: 0 auto;
	}
	.week-content {
		position: relative;
		left: -29px;
		height: 496px;
		width: 60px;
		overflow: hidden;
	}
	.week-content-t {
		position: absolute;
		width: 60px;
		height: 1000px;
		transition: top 0.5s;
	}
	.week-a {
		display: block;
		width: 100%;
		text-align: center;
		font-size: 12px;
		// color:#80888a;
	}
	.week-value {
		width: 60px;
		height: 72px;
		padding: 6px 0;
		background-color: #ececec;
		margin: 0 auto;
		margin-bottom: 212px;
	}
	.span-wkvalue {
		display: block;
		width: 60px;
		height: 60px;
		border-radius: 30px;
		border: 6px solid #00a0e9;
		line-height: 48px;
		font-size: 12px;
		color: #00a0e9;
		text-align: center;
	}
	.span-wkvalue strong {
		font-size: 18px;
	}
	 .icon-state { display: inline-block; width: 8px; height: 8px; font-size: 0; margin-right: 5px; border-radius: 20px; }
 .icon-state-0{ background-color: #f7ba2a; }
 .icon-state-1{ background-color: #abcd03; }
 .icon-state-2{ background-color: #ff4949; }
 .icon-state-3{ background-color: #50bfff; }
 .item-content p.arrange-div {
 	margin-top: 16px;
 	padding:8px 24px 0 48px;
 	line-height: 24px;
 	border-top: 1px dashed #00a0e9;
 }
 .select-plan {
 		padding:8px 24px;
		border: 1px solid #e1e3e4;
		background-color: #fff;
		padding:8px 24px;
		font-size: 12px;
		height:74px;

	div{
		line-height: 28px;
		height: 28px;
		font-size: 12px;
		margin: 0;
		padding: 0;
		span{padding-left:10px;}
		.el-progress {

	}
	}
  }
.all-content{
  min-height: calc(~"100vh - 100px");
	padding:0 0 24px;
	.box{
		margin-top:16px;
	}
	.left-line{
		width:88px;
		position: relative;
		height: 460px;
		float: left;
		overflow: hidden;
		z-index:1;
	}
	.r-Content{
		width:100%;
		height:auto;
		padding-left:88px;

	}
	.img{
		position: absolute;
		cursor: pointer;
		width: 75px;
		height: 145px;
		overflow: hidden;
		div{
			position: absolute;
			width:100%;
			height:auto;
			top:55%;
			left:50%;
			transform:translate(-50%,-50%);
			text-align: center;
			img{
				display: inline;
			}
			p{
				margin:0;padding:0;
				text-align: center;
				font-size: 12px;
				color:#80888a;
			}
			h4{
				font-size:24px;
				font-weight: normal;
				margin:0;
				padding:0;
				color:#20a0ff;
			}
		}
		img:nth-child(2){
			position: absolute;
			opacity: 0;
			top:-35px;
			left:-26px;
			&:hover{
				opacity:0.3;
			}
		}
		>img:first-child {
			display: block;
			margin-left: -26px;
      margin-top: -35px;
		}
		&:nth-child(1){
			top:-15px;
			z-index: 2000;
			height: 145px;
		}
		&:nth-child(2){
			top:95px;
			z-index: 12;

		}
		&:nth-child(3){
			top:205px;
			z-index: 11;
		}
		&:nth-child(4){
			top:315px;
			z-index: 10;
		}

	}

}
.grid-content p.title span {
		font-weight: bold;
	}
.week-box{
	// position: fixed;
	// right: 16px;
	// bottom: 4px;
	width:100%;

	height:50px;
	padding:16px 24px;
	padding-left:104px;
	position: relative;
	.before {
		position: absolute;
		top:16px;
		left:92px;
		width:48px;
		height:48px;
		background:url('~assets/img/left.png') no-repeat;
		z-index:  1001;
		cursor: pointer;
	}
	.after{
		position: absolute;
		top:16px;
		right:-1px;
		width:48px;
		height:48px;
		background:url('~assets/img/right.png') no-repeat;
		z-index:  1001;
		cursor: pointer;
	}

	a{
		width:10%;
		display: inline-block;
	}
	.lineBox{
		width:100%;
		height:50px;
		overflow: hidden;
		position: relative;
		display: inline-block;
		.line-content{
			width:100%;
			position: absolute;
			top:8px;
			left:0;
			transition: all 0.3s linear;
		}
		.line{
			margin-top:16px;
			height:1px;
			width:200%;
			background: #20a0ff;

		}
		.item{
			display: inline-block;
			float: left;
			width:5%;
			text-align:center;
			cursor: pointer;
			span{
				position: relative;
				display:inline-block;
				width:12px;
				height:12px;
				border-radius:16px;
				transition:all 0.3s linear;
			}
			.chosse{
				background:#00a0e9;
				span.linkT{
					position: relative;
					font-size:14px;
					width:62px;
					top:24px;
					left:-24px;
					display: block;
					color:#20a0ff;
				}
			}
			.farway{
				border:1px solid #666;
				background:#fff;
				span{
					display: none;
				}
				&:hover{
					background:#00a0e9;
					border:none;
					span{
						position: relative;
						font-size:14px;
						width:62px;
						top:24px;
						left:-24px;
						display: block;
						color:#20a0ff;
					}
				}
			}
			.normal{
				border:1px solid #00a0e9;
				background:#fff;
				span{
					display: none;
				}
				&:hover{
					background:#00a0e9;
					border:none;
					span{
						position: relative;
						font-size:12px;
						width:62px;
						top:24px;
						left:-24px;
						display: block;
						color:#20a0ff;
					}
				}
			}

		}

	}

}
.week-div {
	position: fixed;
	right: 16px;
	bottom: 4px;
	width: 162px;
	height: 38px;
	z-index: 2001;
	border-radius: 18px;
	background-color: #20a0ff;
	border: 1px solid #20a0ff;
	a {
		height: 36px;
		line-height: 36px;
		text-align: center;
		margin-right: 0;
		float: left;
		display: inline;
		width: 40px;
		text-align: center;
		color: #fff;
	}
	a:first-child {
	}
	a:last-child {
	}
}
.contentWeek {
	background: #fff;
	width: 80px;
	height: 36px;
	float: left;
	display: inline;
	overflow: hidden;
	position: relative;
}
.valueWeek {
	position: absolute;
	left: 0;
	top: 0;
	width: 2000px;
	height: 36px;
	transition: left 0.5s;
}
.valueWeek span {
	float: left;
	display: inline;
	width: 80px;
	height: 36px;
	line-height: 36px;
	font-size: 12px;
	color: #20a0ff;
	text-align: center;
}
.itespan{
			padding:5px 8px;border:1px solid #ccc;margin:0 4px;border-radius:12px;
}
.r-Content p.noData {
	width: 100%;
	text-align: center;
	color: #333;
	font-size: 16px;
	line-height: 600px;
	height: 480px;
	background: #fff;
}
.spanList{
	span{
		padding-right:16px;
		line-height:14px;
		cursor:pointer;
		img{
			vertical-align:middle;
		}
	}
}
.typestyle{
	padding:0 0 0 48px;line-height:24px;height:24px;
}
</style>
