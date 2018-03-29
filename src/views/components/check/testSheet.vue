<template>
	<div class="answerSheet">
		<h3>答题卡</h3>
		<p>
			<span class="down"></span>
			<span>已作答</span>
			<span class="notDo"></span>
			<span>未作答</span>
		</p>
		<div class="singleSelect">
			<p v-if="answerSheet.singleSelect.length > 0" class="selectItem">【单项选择题】</p>
			<p v-if="answerSheet.singleSelect.length > 0">
				<span v-for="(item,index) in answerSheet.singleSelect" :class="[item.userAnswer?'down':'notDo']" @click="jump(index)">{{index + 1}}</span>
			</p>
			<p v-if="answerSheet.multiSelect.length > 0" class="selectItem">【多项选择题】</p>
			<p v-if="answerSheet.multiSelect.length > 0">
				<span v-for="(item,index) in answerSheet.multiSelect" :class="[item.userAnswer?'down':'notDo']" @click="jump(index + answerSheet.singleSelect.length)">{{index + answerSheet.singleSelect.length + 1}}</span>
			</p>
			<p v-if="answerSheet.judgeSelect.length > 0" class="selectItem">【判断题】</p>
			<p v-if="answerSheet.judgeSelect.length > 0">
				<span v-for="(item,index) in answerSheet.judgeSelect" :class="[item.userAnswer?'down':'notDo']" @click="jump(index + answerSheet.singleSelect.length + answerSheet.multiSelect.length)">{{index + answerSheet.singleSelect.length + answerSheet.multiSelect.length + 1}}</span>
			</p>
			<p v-if="answerSheet.sortSelect.length > 0" class="selectItem">【排序题】</p>
			<p v-if="answerSheet.sortSelect.length > 0">
				<span v-for="(item,index) in answerSheet.sortSelect" :class="[item.userAnswer?'down':'notDo']" @click="jump(index + answerSheet.singleSelect.length + answerSheet.multiSelect.length + answerSheet.judgeSelect.length)">{{index + answerSheet.singleSelect.length + answerSheet.multiSelect.length + answerSheet.judgeSelect.length + 1}}</span>
			</p>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'answerSheet',
		props: {
			answerSheet: {
				type: Object,
				default:{
					singleSelect:[],
					multiSelect:[],
					judgeSelect:[],
					sortSelect:[]
				}
			}
		},
		data() {
			return {
			};
		},
		created() {

		},
		methods: {
			getScope(row) {
				console.log(row);
			},
			jump(index) {
				this.$emit('anchorScroll',index);
			}
		},
		mounted() {
			
		}
	}
</script>

<style rel="stylesheet/scss" lang="less" scoped>
	.answerSheet {
		h3 {
			font-size: 14px;
			color: #555;
			margin: 0;
			height: 36px;
			line-height: 36px;
			border-bottom: 1px solid #e0e0e0;
		}
		p {
			font-size: 12px;
			color: #555;
			height: 32px;
			line-height: 16px;
			padding: 8px 0;
			margin: 0;
			span {
				float: left;
				display: inline;
				margin-right: 24px;
			}
			.down {
				height: 16px;
				width: 16px;
				background-color: #f0c301;
				margin-right: 8px;
			}
			.notDo {
				height: 16px;
				width: 16px;
				border: 1px solid #e0e0e0;
				margin-right: 8px;
			}
			.sign {
				height: 16px;
				width: 16px;
				background-color: #ff4949;
				margin-right: 8px;
			}
		}
		.singleSelect {
			margin-top: 8px;
			p {
				span {
					float: left;
					display: inline;
					margin-right: 16px;
					width: 22px;
					height: 22px;
					margin-bottom: 9px;
					color: #333;
					line-height: 22px;
					text-align: center;
					font-size: 12px;
					cursor: pointer;
				}
				.down {
					color: #fff;
				}
				.sign {
					color: #fff;
				}
				&.selectItem {
					margin-top: 16px;
				}
			}
		}
	}
</style>