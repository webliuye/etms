<template>
	<div>
		<div v-for="(item,index) in sortData" class="singleSelect commonProblemStyle">
			<p class="problemNumber">{{indexLength + index}}</p>
			<p class="stem" v-html="item.contentObj.stem"></p>
			<p class="items" v-for="(items,_index) in item.contentObj.items">
				<span class="lettersValue"><span class="tags">{{letters[_index]}}</span></span>
				<span class="tagsCotent" v-html="items.value"></span>
			</p>
			<p v-if="!analysis"><el-input v-model="item.userAnswer" placeholder="请输入正确答案(如:ABCD)"  @change="choiceItems(item)"></el-input></p>
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
		name : 'exercise',
		components: { srcLink },
		props: {
			sortData:{
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
			choiceItems(item){
        item.userAnswer=item.userAnswer.toUpperCase();
				if(this.analysis || !item.userAnswer.trim()) return;
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
		.problemNumber {
			margin: 8px 0;
		}
	}
</style>
