<template>
	<master-page>
		<div class="searchBox">
			<el-row >
				<el-col :span="24">
					   <el-form  :model="formData"  :label-position="'left'"  style="width:60%;"> 
             <el-form-item label="类  别:" class="checkRadio sourceRadio" :label-width="formLabelWidth">
              <el-radio-group v-model="searchData.resourceType" @change="getList">
                <el-radio-button label="">全部</el-radio-button>
                <el-radio-button v-for="(item,index)  in sourceType" :key="index" :label="item.value">{{item.label}}</el-radio-button>
              </el-radio-group>
            </el-form-item> 
						</el-form>  
				</el-col>
			</el-row>			
		</div>
		<div class="conBox">
		
		</div>
		<div v-show="listLoading" class="pagination-container">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="searchData.page" :page-sizes="pages.sizes"
				:page-size="searchData.size" layout="total, sizes, prev, pager, next, jumper" :total="pages.total">
			</el-pagination>
		</div>
	
	</master-page>
</template>
<script>
import MasterPage from "views/layout/MasterPage";
import { mapGetters } from 'vuex';
export default {
  name: "learingRecord",
  components: { MasterPage },
  data() {
    return {
      searchData: {
        resourceType:"",
        size: 50,
        page: 1
		},
		formData:{

		},
		formLabelWidth:'60px',
    pages: {
        total: 1,
        sizes: [10, 20, 30, 50]
	  },
	
		listLoading:false
    };
	},
	 computed: {
      ...mapGetters([
        'sourceType'
      ])
    },
  created() {
		   this.$store.dispatch('GetSourceType');
	     this.getList();
  },
  methods: {
	getList(){
	
	},
	handleSizeChange(val) {
      // 显示多少页
      this.searchData.size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      // 点击页数
      this.searchData.page = val;
      this.getList();
    },
  },
  mounted() {}
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.searchBox {
  border-bottom: 1px solid #dddddd;
  padding-bottom: 8px;
}


</style>