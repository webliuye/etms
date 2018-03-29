<template>
	<div>
		<div v-for="(item,index) in judgeData" class="singleSelect commonProblemStyle">
			<p class="problemNumber">{{indexLength + index}}</p>
			<p class="stem" v-html="item.contentObj.stem"></p>
			<p class="items" v-for="(items,_index) in item.contentObj.items" @click="choiceItems(item,items,_index)">
				<span class="lettersValue"><span :class="['tags',letters[_index] == item.userAnswer?'choiceTags':'']">{{letters[_index]}}</span></span>
				<span class="tagsCotent" v-html="items.value"></span>
			</p>
			<div class="analysis" v-if="analysis">
				<p>
					<span v-if="item.userAnswer != item.standardAnswer" class="ownAnswer">
						<img src="~assets/checkImg/error.png"> 
						您的答案： <i v-if="item.userAnswer">{{item.userAnswer}}</i><i v-if="!item.userAnswer">未作答</i>
					</span>	
					<span v-if="item.userAnswer == item.standardAnswer" class="trueAnswer">
						<img src="~assets/checkImg/right.png"> 
						您的答案： <i>{{item.userAnswer}}</i>
					</span>
					<span  class="trueAnswer">
						参考答案： <i>{{item.standardAnswer}}</i>
					</span>		
					 <a href='javascript:;' v-if="!item.answerShow" class ="el-button--text fr" @click="showAnswer(item)">
					   查看解析
					   <img src="~assets/checkImg/analysis.png">
					 </a>
     			 <a href='javascript:;' v-if="item.answerShow" class ="el-button--text fr" @click="showAnswer(item)">
     			   隐藏解析
     			   <img src="~assets/checkImg/shrink.png">
     			 </a>

				</p>
				<p v-if="item.answerShow">
					<span class="aly">答案解析:</span>
					<span class="answerValue" v-html="item.analysis"></span>
					<src-link :catalogueId="item.catalogueId"></src-link>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
	import srcLink from "views/components/srcLink";
	export default {
		name : 'singleSelect',
		components: { srcLink },
		props: {
			judgeData:{
				type: Array,
				default:[]
			},
			indexLength:{
				type: Number,
				default:0
			},
			analysis:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				letters:['A','B','C','D','E','F','G','H']
			}
		},
		created() {

		},
		methods: {
			choiceItems(item,items,index){
				if(this.analysis) return;
				item.userAnswer = this.letters[index];
				this.$emit('countTest');
			},
			showAnswer(item){
				item.answerShow = !item.answerShow;
			}
		},
		mounted() {

		}
	}
</script>

<style rel="stylesheet/scss" lang="less" scoped>
	.singleSelect {
		
	}
</style>