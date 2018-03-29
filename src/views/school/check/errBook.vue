<template>
	<master-page>
		<div class="searchBox">
			<el-row >
				<el-col :span="16">
					<el-select v-model="searchData.questionType" clearable @change="getList" placeholder="筛选题目类型">
						<el-option
							v-for="(item,index)  in problemType"
							:key="index"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-col>
				<el-col :span="8">
					<el-input style="width:260px;" placeholder="根据题干搜索" class="fr" v-model="searchData.keyword" >
						<i
            class="el-icon-search el-input__icon"
            slot="suffix"
            @click="handleIconClick">
            </i>
					</el-input>
				</el-col>
			</el-row>
		</div>
		<div class="conBox" v-for="(item,index) in list" :key="index">
				<div class="singleSelect"  v-if="item.questionType=='singleSelect'">
					<SingleSelect :singleData="item" :index="index+searchData.size*(searchData.page-1)" :analysis="true"></SingleSelect>
				</div>
				<div class="singleSelect" v-if="item.questionType=='multiSelect'">
					<MultiSelect :multiData="item"  :index="index+searchData.size*(searchData.page-1)" :analysis="true" ></MultiSelect>
				</div>
				<div class="singleSelect" v-if="item.questionType=='trueFalse'">
					<JudgeSelect :judgeData="item"  :index="index+searchData.size*(searchData.page-1)" :analysis="true" ></JudgeSelect>
				</div>
				<div class="singleSelect" v-if="item.questionType=='sortSelect'">
					<SortSelect :sortData="item" :index="index+searchData.size*(searchData.page-1)" :analysis="true" ></SortSelect>
				</div>
		</div>
		<div v-show="listLoading" class="pagination-container">
			<Pagination :pages="pages" :searchData="searchData" @getTableData="getList"></Pagination>
		</div>
	</master-page>
</template>
<script>
import MasterPage from "views/layout/MasterPage";
import SingleSelect from 'views/components/checkSelect/singleSelect';
import MultiSelect from 'views/components/checkSelect/multiSelect';
import JudgeSelect from 'views/components/checkSelect/judgeSelect';
import SortSelect from 'views/components/checkSelect/sortSelect';
import Pagination from 'views/components/page/pagination';
import {getPrsErrBook} from 'api/check';
import { mapGetters } from "vuex";
export default {
  name: "errBook",
  components: { MasterPage , SingleSelect, MultiSelect, JudgeSelect, SortSelect, Pagination},
  data() {
    return {
			questionType:"",
      searchData: {
        questionType: "",
        keyword: "",
        size: 10,
        page: 1
	  },
      pages: {
        total: 1,
        sizes: [10, 20, 30, 50]
		},
		list:[],
	  // singleData:[],
		// multiData:[],
		// judgeData:[],
		listLoading:false
    };
  },
  computed: {
    ...mapGetters(["problemType"])
  },
  created() {
     this.$store.dispatch("GetProblemType");
	this.getList();
  },
  methods: {
	handleIconClick() {
		this.getList();

	},
	getList(){
		this.listLoading=false;
		getPrsErrBook(this.searchData).then(res=>{
			res.data.forEach(item=>{
				var str=item.content;
				if(str.slice(str.length-1,str.length)!="}"){//这是为了避免 最后一位为空格带来的parse解析错误、李滔林挖的坑
						str=str.slice(0,str.length-1);
				}
				item.content=JSON.parse(str);
			});
			this.list=res.data;
			this.pages.total=res.total;
			if(res.total>this.searchData.size){
				this.listLoading=true;
			}
		})
	}
  	// handleSizeChange(val) {
   //    // 显示多少页
   //    this.searchData.size = val;
   //    this.getList();
   //  },
   //  handleCurrentChange(val) {
   //    // 点击页数
   //    this.searchData.page = val;
   //    this.getList();
   //  },
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
