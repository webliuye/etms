<template>
	<div class="execount">
		<h3>全站排行(根据做题总数和正确率排名)</h3>
		<el-table :data="listData" fit style="width: 100%;" class="rankTable">
			<el-table-column label="排名" min-width="60" >
        <template slot-scope="scope">
          <img v-if="scope.row.index == 0" src="~assets/checkImg/mine.png">
          <img v-if="scope.row.index == 1" src="~assets/checkImg/numberone.png">
          <img v-if="scope.row.index == 2" src="~assets/checkImg/numbertwo.png">
          <img v-if="scope.row.index == 3" src="~assets/checkImg/numberthree.png">
          <span v-if="scope.row.index > 3" class="spanIndex">
						{{scope.row.index}}
          </span>
        </template>
      </el-table-column>
      <el-table-column  prop="staffName" label="名称" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column  prop="questionCount" align="right" label="总做题量(道)" min-width="100" show-overflow-tooltip></el-table-column>
		</el-table>
	</div>
</template>

<script>
import { scrollTable } from 'utils/index'
	export default {
		name: 'exerciseCount',
		props: {
			listData: {
				type: Array,
				default:[]
			}
		},
		data() {
			return {
				rankList:[]
			};
		},
		created() {
			console.log(this.rankList);
		},
		methods: {
			getScope(row) {
				console.log(row);
			}
		},
		mounted() {
      scrollTable('.execount');
		}
	}
</script>

<style rel="stylesheet/scss" lang="less" scoped>
	h3 {
		font-size: 14px;
		color: #555;
		padding-left: 16px;
		padding-top: 16px;
		margin: 0;
		height: 58px;
		line-height: 42px;
	}
	.spanIndex {
		display: block;
		width: 28px;
		height: 28px;
		line-height: 20px;
		border: 4px solid #d9f1be;
		border-radius:14px;
		color: #fff;
		background-color: #abcd03;
		text-align: center;
	}
</style>
