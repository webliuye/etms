<template>
	<div>
		<div class="singleSelect">
			<p class="problemNumber">{{index+1}}</p>
			<p class="stem" v-html="judgeData.content.stem"></p>
			<p class="items" v-for="(items,_index) in judgeData.content.items" :key="_index">
				<span :class="['tags',letters[_index] == judgeData.userAnswer?'choiceTags':'']">{{letters[_index]}}</span>
				<span class="tagsCotent" v-html="items.value"></span>
			</p>
			<div class="analysis" v-if="analysis">
				<p>
					<span v-if="judgeData.userAnswer != judgeData.standardAnswer" class="ownAnswer">
						<img src="~assets/checkImg/error.png">
						您的答案： <i>{{judgeData.userAnswer||'未作答'}}</i>
					</span>
					<span v-if="judgeData.userAnswer != judgeData.standardAnswer" class="trueAnswer">
						参考答案： <i>{{judgeData.standardAnswer}}</i>
					</span>
					<span v-if="judgeData.userAnswer == judgeData.standardAnswer" class="trueAnswer">
						您的答案： <i>{{judgeData.standardAnswer}}</i>
					</span>
					<a href='javascript:;' v-if="!answerShow" class ="el-button--text fr" @click="showAnswer()">查看解析  <img src="~assets/checkImg/analysis.png" alt=""></a>
					<a href='javascript:;' v-if="answerShow" class ="el-button--text fr" @click="closeAnswer()">隐藏解析  <img src="~assets/checkImg/shrink.png" alt=""></a>
				</p>
				<p v-if="answerShow">
					<span class="aly">答案解析:</span>
					<span class="answerValue" v-html="judgeData.analysis"></span>
					<src-link :catalogueId="judgeData.catalogueId"></src-link>
				</p>
			</div>
		</div>

	</div>
</template>

<script>
import srcLink from "views/components/srcLink";
export default {
  components: { srcLink },
  name: "exercise",
  props: {
    judgeData: {
      type: Object,
      default: {}
    },

    analysis: {
      type: Boolean,
      default: false
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
    border-radius: 10px;
  }
</style>
