<template>
	<master-page title="仪器使用统计">
		<div class="dashboard-container">
      <el-tabs v-model="activeName" @tab-click="getList">
        <el-tab-pane label="仪器统计" name="first">
          <div class="search-select">
            <div class="fr">
              <el-input
                placeholder="资产名称或代码"
                v-model="searchData.nameOrCode">
                <i
                class="el-icon-search el-input__icon"
                slot="suffix"
                @click="findItem">
                </i>
              </el-input>
            </div>
            <div class="fr selectwidth">
              <TermSelect @changeTerm="changeTerm"></TermSelect>
            </div>
            <div class="fr selectwidth">
              <YearSelect @changeYear="changeYear"></YearSelect>
            </div>
          </div>
          <div class="table-div">
            <el-table :data="list"  fit highlight-current-row style="width: 100%" ref="editTable">
              <el-table-column  prop="items_Code" align="center" label="品目代码" min-width="160" show-overflow-tooltip></el-table-column>
              <el-table-column  prop="items_Name" label="仪器药品名称" min-width="160" show-overflow-tooltip></el-table-column>
              <el-table-column  prop="unit" label="单位" min-width="80" show-overflow-tooltip></el-table-column>
              <el-table-column  prop="classHour" align="right" label="使用课时数" min-width="120"></el-table-column>
              <el-table-column  prop="useAmount" align="right" label="使用件次" min-width="100">
                <template slot-scope="scope">
                  <span>{{scope.row.useAmount}}</span>
                </template>
              </el-table-column>
            </el-table>
            <div v-show="listLoading" class="pagination-container">
              <Pagination :pages="pages" :searchData="searchData" @getTableData="getList"></Pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="耗材统计" name="second">
          <div class="search-select">
            <div class="fr">
              <el-input
                placeholder="资产名称或代码"
                v-model="searchData.nameOrCode">
                <i
                class="el-icon-search el-input__icon"
                slot="suffix"
                @click="findItem">
                </i>
              </el-input>
            </div>
            <div class="fr selectwidth">
              <TermSelect @changeTerm="changeTerm"></TermSelect>
            </div>
            <div class="fr selectwidth">
              <YearSelect @changeYear="changeYear"></YearSelect>
            </div>
          </div>
          <div class="table-div">
            <el-table :data="list" fit highlight-current-row style="width: 100%" ref="editTable">
              <el-table-column  prop="items_Code" align="center" label="品目代码" min-width="160" show-overflow-tooltip></el-table-column>
              <el-table-column  prop="items_Name" label="仪器药品名称" min-width="160" show-overflow-tooltip></el-table-column>
              <el-table-column  prop="unit" label="单位" min-width="80" show-overflow-tooltip></el-table-column>
              <el-table-column  prop="classHour" align="right" label="使用课时数" min-width="120"></el-table-column>
              <el-table-column  prop="useAmount" align="right" label="使用数量" min-width="100"></el-table-column>
              <el-table-column  prop="stockRate" align="right" label="平均使用数量" min-width="160">
                <template slot-scope="scope">
                  <span>{{scope.row.stockRate.toFixed(2)}}</span>
                </template>
              </el-table-column>
            </el-table>
            <div v-show="listLoading" class="pagination-container">
              <Pagination :pages="pages" :searchData="searchData" @getTableData="getList"></Pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
		</div>
	</master-page>
</template>

<script>
	import MasterPage from 'views/layout/MasterPage';
	import YearSelect from 'views/components/select/yearSelect';
  import TermSelect from 'views/components/select/termSelect';
  import Pagination from 'views/components/page/pagination';
  import { getEquipCount } from 'api/equipment';
  export default {
  	name : 'equipment',
  	components : { MasterPage, YearSelect, TermSelect, Pagination},
  	data () {
  		return {
        listLoading: true,
        fixed:true,
        pages:{
          total:1,
          sizes:[10,20,30, 50]
        },
  			searchData : {
          termYear : null,
          term : null,
          nameOrCode : null,
          page:1,
          size:50,
          itemstype:1
        },
        list:null,
        activeName:'first'
  		};
  	},
  	methods : {
  		changeYear(year){
        this.searchData.termYear = year;
        this.getList();
      },
      changeTerm(term){
        this.searchData.term = term;
        this.getList();
      },
      getList() {
        this.listLoading = false;
        if(this.activeName == 'first'){
          this.searchData.itemstype = 1;
        }else{
          this.searchData.itemstype = 2;
        }
        getEquipCount(this.searchData).then(res => {
          this.list = res.data;
          this.pages.total = res.total;
          if(res.total > this.searchData.size){
            this.listLoading = true;
          }
        });
      },
      // handleSizeChange(val) { // 显示多少页
      //   this.searchData.size = val;
      //   this.getList();
      // },
      // handleCurrentChange(val) {  // 点击页数
      //   this.searchData.page = val;
      //   this.getList();
      // },
      findItem() {
        this.getList();
      }
  	},
  	mounted () {
      this.getList();
  	}
  }
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.table-in {
  border: none;
  box-sizing: border-box;
  width: 100%;
  td {
     border:1px solid #ccc;
     text-align: center;
  }
}
</style>
