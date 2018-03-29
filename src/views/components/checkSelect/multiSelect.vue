<template>
	<div>
		<div   class="multiData">
			<p class="problemNumber">{{index+1}}</p>
			<p class="stem" v-html=" multiData.content.stem"></p>
			<p class="items" v-for="(items,_index) in  multiData.content.items" :key="_index"  @click="choiceItems(items,_index)" >
				<span :class="['tags',!multiData.userAnswer || multiData.userAnswer.indexOf(letters[_index]) < 0?'':'choiceTags']">{{letters[_index]}}</span>
				<span class="tagsCotent" v-html="items.value"></span>
			</p>
			<div class="analysis" v-if="analysis">
				<p>
					<span v-if="multiData.userAnswer != multiData.standardAnswer" class="ownAnswer">
						<img src="~assets/checkImg/error.png">
						您的答案： <i>{{multiData.userAnswer||'未作答'}}</i>
					</span>
					<span v-if="multiData.userAnswer != multiData.standardAnswer" class="trueAnswer">
						参考答案： <i>{{multiData.standardAnswer}}</i>
					</span>
					<span v-if="multiData.userAnswer == multiData.standardAnswer" class="trueAnswer">
						您的答案： <i>{{multiData.standardAnswer}}</i>
					</span>
					<a href='javascript:;' v-if="!answerShow" class ="el-button--text fr" @click="showAnswer()">查看解析 <img src="~assets/checkImg/analysis.png" alt=""></a>
					<a href='javascript:;' v-if="answerShow" class ="el-button--text fr" @click="closeAnswer()">隐藏解析 <img src="~assets/checkImg/shrink.png" alt=""></a>
				</p>
				<p v-if="answerShow">
					<span class="aly">答案解析:</span>
					<span class="answerValue" v-html="multiData.analysis"></span>
					<src-link :catalogueId="multiData.catalogueId"></src-link>
				</p>
			</div>
		</div>
	</div>
</template>
<script>
import srcLink from "views/components/srcLink";
export default {
  components: { srcLink },
  name: "multiSelect",
  props: {
    multiData: {
      type: Object,
      default: {}
    },
    analysis: {
      type: Boolean,
      default: true
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      letters: ["A", "B", "C", "D", "E", "F", "G", "H"],
      answerShow: false
    };
  },
  created() {
  },
  methods: {
    showAnswer() {
      this.answerShow = true;
    },
    choiceItems(items,index){
      if(this.answerShow) return;
      var userAnswerArray;
      var letter = this.letters[index];
      if(this.multiData.userAnswer){
        userAnswerArray = this.multiData.userAnswer.split('');
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
      this.multiData.userAnswer = userAnswerArray.sort().join('');
    },
    closeAnswer() {
      this.answerShow = false;
    }
  },
  mounted() {}
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
@import url('./check.less');
  .tags{
    border-radius: 0px;
  }
</style>
