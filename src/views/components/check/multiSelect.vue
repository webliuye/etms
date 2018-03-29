<template>
	<div>
		<div v-for="(item,index) in multiData" class="multiData commonProblemStyle" :key="'1'+index">
			<p class="problemNumber">{{indexLength + index}}</p>
			<p class="stem" v-html="item.contentObj.stem"></p>
			<p class="items" v-for="(items,_index) in item.contentObj.items" @click="choiceItems(item,items,_index)" :key="'2'+_index">
				<span class="lettersValue"><span :class="['tags',!item.userAnswer || item.userAnswer.indexOf(letters[_index]) < 0?'':'choiceTags']">{{letters[_index]}}</span></span>
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
					<span class="trueAnswer">
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
		name : 'multiSelect',
		components: { srcLink },
		props: {
			multiData:{
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
    watch:{
      multiData(val){
         this.multiData=val;
      }
    },
		created() {
		},
		methods: {
			choiceItems(item,items,index){
				if(this.analysis) return;
				var userAnswerArray;
				var letter = this.letters[index];
				if(item.userAnswer){
					userAnswerArray = item.userAnswer.split('');
				}else{
					userAnswerArray = [];
				}
				if(userAnswerArray.indexOf(letter) < 0){
					userAnswerArray.push(letter);
				}else{
					userAnswerArray = userAnswerArray.filter(function(s){
						return s != letter;
					});
				}
        item.userAnswer = userAnswerArray.sort().join('');
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
	.multiData {

	}
</style>
