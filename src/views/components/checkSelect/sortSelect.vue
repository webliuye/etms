<template>
	<div>
		<div class="singleSelect">
			<p class="problemNumber">{{index + 1}}</p>
			<p class="stem" v-html="sortData.content.stem"></p>
			<p class="items" v-for="(items,_index) in sortData.content.items" :key="_index">
				<span class="tags">{{letters[_index]}}</span>
				<span class="tagsCotent" v-html="items.value"></span>
			</p>
			<div class="analysis" v-if="analysis">
				<p>
					<span v-if="sortData.userAnswer != sortData.standardAnswer" class="ownAnswer">
						<img src="~assets/checkImg/error.png">
						您的答案： <i v-if="sortData.userAnswer">{{sortData.userAnswer}}</i><i v-if="!sortData.userAnswer">未作答</i>
					</span>
					<span v-if="sortData.userAnswer == sortData.standardAnswer" class="trueAnswer">
							<img src="~assets/checkImg/right.png">
						您的答案： <i>{{sortData.userAnswer}}</i>
					</span>
					<span  class="trueAnswer">
						参考答案： <i>{{sortData.standardAnswer}}</i>
					</span>

					 <a href='javascript:;' v-if="!answerShow" class ="el-button--text fr" @click="showAnswer()">
					   查看解析
					   <img src="~assets/checkImg/analysis.png">
					 </a>
     			 <a href='javascript:;' v-if="answerShow" class ="el-button--text fr" @click="showAnswer()">
     			   隐藏解析
     			   <img src="~assets/checkImg/shrink.png">
     			 </a>
				</p>
				<p v-if="answerShow">
					<span class="aly">答案解析:</span>
					<span class="answerValue" v-html="sortData.analysis"></span>
					<src-link :catalogueId="sortData.catalogueId"></src-link>
				</p>
			</div>
		</div>

	</div>
</template>
<script>
	import srcLink from "views/components/srcLink";
	export default {
		name : 'sortSelect',
		components: { srcLink },
		props: {
			sortData:{
				type: Object,
				default:{}
			},
			index:{
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
				letters: ["A", "B", "C", "D", "E", "F", "G", "H"],
      	answerShow: false
			}
		},
		created() {

		},
		methods: {
			showAnswer() {
	      this.answerShow = true;
	    },
	    closeAnswer() {
	      this.answerShow = false;
	    }
		},
		mounted() {

		}
	}
</script>

<style rel="stylesheet/scss" lang="less" scoped>
@import url('./check.less');
    .tags{
      border-radius: 10px;
    }
</style>
