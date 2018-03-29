<template>
	<master-page title="预约成功">
		<div class="well-view">
			<div class="content">
				<el-row :gutter="24">
					<el-col :span="8">
						<div class="fr">
							<img  src="~assets/sourceImg/sourceP.png" >
							<p>{{bName}}</p>
						</div>
					</el-col>
					<el-col :span="16">
							<h2 style="font-size:22px;"><img  src="~assets/sourceImg/success.png" style="vertical-align:middle" > 预约成功,请等待实验员安排</h2>
							<p style="color:#c7c8c9;font-size:12px;margin:16px 0 32px 0">温馨提示：可以在首页-> 我的实验-> 实验预约 查看预约状态</p>
							<p>
								 <el-button type="primary" @click="goIndex">查看我的预约</el-button>
								 <el-button  @click="goIndex">返回首页（<span style="color:#00a0e9;">{{count}}</span> 秒）</el-button>
							</p>
							<!-- <p> <strong style="color:#E9AB17;font-size:14px;">{{count}}</strong> 秒内将为您跳转至首页。  <el-button type="text" @click="goIndex"> 返回</el-button> </p> -->
					</el-col>
				</el-row>
			</div>
		</div>
	 <div class="link-source"  @mouseover="focusEvent()" @mouseout="blurEvent()" >
		<div slot="header" class="clearfix">
			<strong>相关资源</strong>
			<el-button type="text" v-if="list.length>=6" class="fr"  @click="$router.push({ name:'SourceIndex'})">更多</el-button>
		</div>
		<template v-if="list.length>0">
			<div  v-for="(item,index)  in list" :key="item" class="itemBox" style="float:left;cursor:pointer" @click="toDetail(item)">
				<div class="link_source_img" :class="item.sourceType"></div>
				<!-- <img  src="~assets/sourceImg/sourceP.png"> -->
				<p >{{item.sourceName}}</p>
				<div class="breifCont">
					<strong>资源简介：</strong>
					<p> &nbsp;&nbsp; {{item.sourceDescription}}...</p>
					<el-button type="text" style="color:#fad67f;" @click="toDetail(item)">查看更多</el-button>
				</div>
			</div>
		</template>
		<p v-if="!list.length">该实验没有相关资源</p>
	</div>
	</master-page>
</template>

<script>
	import MasterPage from '../../layout/MasterPage';
	import { getLinkSource } from 'api/source';
	export default {
		components: { MasterPage},
		data() {
			return {
				count:5,
				timerIn:null,
				id:'',
				list:[],
				bName:''
			}
		},
		created() {
			 this.id = this.$route.params.id;
			 this.bName = this.$route.params.bName;
			 if(this.id){
				 this.getList();
			 }
			this.timerIn=setInterval(this.timer,1000);
		},
		methods:{
			timer(){
				this.count--;
				if(this.count==0){
					 this.goIndex();
				}
			},
			focusEvent(){
				 this.timerIn= window.clearInterval(this.timerIn);
			},
			blurEvent(){
				this.timerIn=setInterval(this.timer,1000);
			},
			goIndex(){
				this.$router.push({ path:'/index'});
				 this.timerIn= window.clearInterval(this.timerIn);
			},
			 getList(){
				 getLinkSource({catalogueId:this.id}).then(res=>{
					 this.list=res;
					 console.log('res返回值');
					 console.log(res);
				 })
			},
			toDetail(item){
					 this.$router.push({ name:'sourcePreview',params: {id:item.resourceId}});
			},

		},
		beforeRouteLeave (to, from, next) {
			if(this.timerIn){
				clearInterval(this.timerIn);
			}
			next();
		}
	}
</script>
<style lang="less" scoped>
	.well-view {
			padding: 20px;
			border:none;
			margin: 0 auto;
			width: 1000px;
			height:320px;
			font-size:12px;
			 vertical-align: middle;
			.content{
				//  text-align: center;
				 margin-top:100px;
			}
			.el-button{
				font-size:14px;
			}
		}

	.link-source{
		// border:1px solid  #eeeeee;
		margin:48px auto;
		width: 1000px;
		padding:16px 16px;
		font-size:12px;
		margin-top:18px;
		border-top:1px dashed #ccc;
		.clearfix{
			margin-bottom:16px;
		}
		strong{
			font-size:14px;
		}
		h4{
			color:#fad67f;
			text-align:center;
			position:relative;
			bottom:10px;
			left:0;
		}
		.itemBox{
			 width:100px;
			 min-height:106px;
			 padding:8px;
			 position:relative;
			 margin:0 8px;
			 margin-bottom:16px;

			.breifCont{
				position:absolute;
				top:0;
				left:-10%;
				width:120%;
				height:170px ;
				background:rgba(0,0,0,0.5);
				font-size:12px;
				color:#fff;
				padding:8px;
				overflow:hidden;
				opacity:0;
				transition:opacity 0.3s linear;

				p{
					padding:0;
					margin:0;
					height:96px;
					overflow:hidden;
				}
			}
			&:hover .breifCont{
				opacity:1;
				transition:opacity 0.3s linear;
			}
		}

	}
</style>

