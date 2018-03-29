<template>
	<master-page title="实验安排">
		<div class="dashboard-container classInfo">
			<el-table :data="list" fit highlight-current-row style="width: 100%;" ref="editTable">
	      <el-table-column  prop="name" label="班级名称" min-width="400"></el-table-column>
	      <el-table-column  prop="timeLabel" align="right" label="实验开出完成度" min-width="200">
	      	<template slot-scope="scope">
	      		<el-row style="width:100%;">
							<el-col :span="21" style="padding-top:3px;">
								<p><el-progress :stroke-width="8" :percentage="scope.row.percentCount" ></el-progress></p>
							</el-col>
							<el-col :span="3">
								<p><span>{{scope.row.NumberCount}}</span></p>
							</el-col>
						</el-row>
	      	</template>
	      </el-table-column>
	    </el-table>
	    <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="searchData.page" :page-sizes="pages.sizes"
          :page-size="searchData.size" layout="total, sizes, prev, pager, next, jumper" :total="pages.total">
        </el-pagination>
      </div>
		</div>
	</master-page>
</template>

<script>
	import MasterPage from '../../layout/MasterPage';
  import { getClassOpenCount } from 'api/index';
  import {scrollTable} from "utils/index"
	export default {
		components: {
        MasterPage
    },
		data() {
			return {
				listLoading: true,
				list:null,
				pages:{
          total:1,
          sizes:[10,20,30, 50]
        },
				searchData:{
					size:50,
					page:1,
					planId:''
				}
			};
		},
		created() {
			this.searchData.planId = this.$route.params.planId;
			this.getList();
		},
		methods: {
			getList() {
				getClassOpenCount(this.searchData).then(res => {
					this.list = res.data;
					this.pages.total = res.total;
					if(this.pages.total>this.searchData.size){
	          this.listLoading = false;
	        }
					this.list.forEach(function(item){
						item.percentCount = parseInt((item.infactCount/item.totalCount).toFixed(2) * 100);
						item.NumberCount = item.infactCount + "/" + item.totalCount;
					});
				}).catch(err => {
	        this.listLoading = false;
	      });
			},
			handleSizeChange(val) { // 显示多少页
        this.searchData.size = val;
        this.getList();
      },
      handleCurrentChange(val) {  // 点击页数
        this.searchData.page = val;
        this.getList();
      }
    },
    mounted(){
      scrollTable('.classInfo')
    }
	}
</script>
<style scoped>

</style>
