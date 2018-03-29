<template>
	<master-page title="历史存档">
		<div>
			<img style="display:block;" v-if="loading" src="~assets/img/history.gif">
			<el-button :disabled="loading" type="primary" @click="saveHistory" class="saveClass">{{name}}</el-button>
			<div style="margin-top:16px;">
				<el-button class="saveClass" type="primary" @click="deleteLastAllClass">毕业班级</el-button>
			</div>
		</div>
	</master-page>
</template>

<script>
	import MasterPage from '../layout/MasterPage';
	import {saveHistoryData} from 'api/count';
	import {deleteLastClass} from 'api/count';
	export default {
		components: {
        MasterPage
    },
		data() {
			return {
				name:'历史存档',
				loading:false
			};
		},
		created() {

		},
		methods: {
			//删除毕业班级
      deleteLastAllClass() {
        deleteLastClass().then(res => {
          this.$message({
            message: '操作成功！',
            type: 'success'
					});
        }).catch(error => {
        	this.$message({
            message: '操作失败！',
            type: 'error'
					});
        });
      },
			saveHistory() {
				this.$confirm('确认封存当前学年历史数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        	this.name = '存储中';
        	this.loading = true;
        	saveHistoryData().then(res => {
        		console.log(res);
        		this.$message({
              message: '存储成功！',
              type: 'success'
						});
        		this.name = '存储完毕';
        		this.loading = false;
        	}).catch(error => {
        		this.name = '历史存档';
        		this.loading = false;
        		this.$message({
              message: '存储失败！',
              type: 'error'
						});
        	});
        });
			}
		},
		mounted() {

		}
	}
</script>

<style rel="stylesheet/scss" lang="less" scoped>
	.saveClass {
		display: block;
	}
</style>