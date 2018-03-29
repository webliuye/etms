<template>
	<div>
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="searchData.page" :page-sizes="pages.sizes" :page-size="searchData.size" layout="total, sizes, prev, pager, next, jumper" :total="pages.total">
    </el-pagination>
	</div>
</template>

<script>
	export default {
		name: 'pagination',
		props:{
			pages: {
				type: Object,
				default: {
					total:1,
          sizes:[10,20,30, 50]
				}
			},
			searchData: {
				type: Object,
				default: {
					page:1,
          size:30
				}
			}
		},
		data() {
			return {
			};
		},
		methods: {
			handleSizeChange(val) { // 显示多少页
        this.searchData.page = 1;
        this.searchData.size = val;
        this.$emit('getTableData');
      },
      handleCurrentChange(val) {  // 点击页数
        this.searchData.page = val;
        this.$emit('getTableData');
      }
		}
	}
</script>