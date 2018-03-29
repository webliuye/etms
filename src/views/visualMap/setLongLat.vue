<template>
	<master-page title="经纬度设置">
		<div class="dashboard-container">
			<div class="search-select">
				<div class="fr" style="width:100%">
          <el-input v-model="name" placeholder="请输入详细地点名称" id="nameSelect">
            <i
            class="el-icon-search el-input__icon"
            slot="suffix"
            @click="findItem">
            </i>
          </el-input>
        </div>
			</div>
			<div class="version-div">
        <div class="left-tree" style="max-height:640px;">
          <AreaTree @changeCode="changeCode" :isTop="true" :isSchool="false"></AreaTree>
        </div>
      </div>
      <div class="right-content">
      	<el-row :gutter="24">
      		<el-col :span="12">
      			<div class="table-div">
      				<table cellpadding="0" cellspacing="0" class="table-in2">
      					<thead>
									<tr>
				            <td style="text-align:left" width="30%">学校名称</td>
						        <td class="is-center" width="20%">经度</td>
						        <td class="classname is-center" width="20%">纬度</td>
						        <td>
						        	<el-select v-model="searchData.sign" clearable placeholder="选择设置状态" @change="filterMethod">
			                  <el-option
			                    v-for="(item,index)  in filters"
			                    :key="index"
			                    :label="item.text"
			                    :value="item.value">
			                  </el-option>
			                </el-select>
						        </td>
						      </tr>
								</thead>
								<tbody>
									<tr v-for="(item,index) in list" :key="index">
										<td class="oneLine" style="text-align:left">{{item.schoolName}}</td>
										<td class="tdTwo">{{item.longitude}}</td>
										<td class="tdTwo">{{item.latitude}}</td>
										<td style="text-align:center">
											<a href='javascript:;' class ="el-button--text" @click="setLngLatValue(item)">{{item.state}}</a>
										</td>
									</tr>
								</tbody>
      				</table>
							<!-- <el-table :data="list" fit highlight-current-row style="width: 100%" ref="editTable">
								<el-table-column prop="schoolName" label="学校名称" min-width="160" show-overflow-tooltip></el-table-column>
								<el-table-column prop="longitude" label="经度" min-width="120" show-overflow-tooltip></el-table-column>
								<el-table-column prop="latitude" label="纬度" min-width="120" show-overflow-tooltip></el-table-column>
								<el-table-column prop="state" label="查看" width="80" show-overflow-tooltip :filters="filters" :filter-method="filterMethod" filter-placement="bottom-end">
									<template slot-scope="scope">
										<a href='javascript:;' class ="el-button--text"@click="setLngLatValue(scope.row)">{{scope.row.state}}</a>
									</template>
								</el-table-column>
							</el-table> -->
						</div>
						<div v-show="!listLoading" class="pagination">
		          <Pagination :pages="pages" :searchData="searchData" @getTableData="getList"></Pagination>
		        </div>
      		</el-col>
      		<el-col :span="12">
      			<div id="container" class="container"></div>
      		</el-col>
				</el-row>
			</div>
		</div>
	</master-page>
</template>
<!-- <script src="https://webapi.amap.com/maps?v=1.4.1&key=0b7de3baf96b2093ca2ec54caaac39fa"></script> -->
<script>
	import MasterPage from 'views/layout/MasterPage';
	import AreaTree from "views/components/areaTree";
	import {setLngLat, getLngLat} from 'api/index';
  import Pagination from 'views/components/page/pagination';
  import { scrollTable } from 'utils/index';
  import { loadAMapJS } from 'utils/asyncLoad';
	export default {
		name:'longLat',
		components: { MasterPage, AreaTree, Pagination},
		data() {
			return {
				map:null,
				placeSearch:null,
				name:'',
				autoOptions:null,
				auto:null,
				topData:this.$store.state.commonData.userUnit,
				list:[],
				rowValue:null,
				formData: {
					schoolCode:'',
					longitude:'',
					latitude:''
				},
				filters:[
	        { text: '已设置', value: '0' },
	        { text: '未设置', value: '1' }
	      ],
				countyName:'',
				pages:{
          total:1,
          sizes:[10,15,30,50]
        },
				searchData: {
					page:1,
          size:15,
					unitId: '',
					sign:''
				},
				loadMapJs:null
			};
		},
		created() {
		  this.$store.dispatch('GetUserUnit');
		  this.getList();
		  this.loadMapJs = loadAMapJS();
		},
		methods: {
			filterMethod(value, row) {
				//return row.state === value;
				this.getList();
	    },
			getList() {
				this.listLoading = true;
				getLngLat(this.searchData).then(res => {
					if(res && res.data && res.data.length > 0){
						res.data.forEach(function(s){
							if(s.longitude){
								s.state = '修改';
							}else{
								s.state = '设置';
							}
						});
						this.list = res.data;
						this.pages.total = res.total;
	          if(this.pages.total>this.searchData.size){
	            this.listLoading = false;
	          }
					} else {
						this.list = [];
					}
				});
			},
			setLngLatValue(row) {
				this.rowValue = row;
				this.name = this.countyName + row.schoolName;
				this.formData.schoolCode = row.schoolCode;
				this.findItem();
			},
			changeCode(data) {
				this.searchData.unitId = data.unitId;
				this.countyName = data.unitName;
				this.getList();
				this.name = data.unitName;
				this.findItem();
			},
			getLngLat(e) {
				this.formData.longitude = e.lnglat.getLng();
				this.formData.latitude = e.lnglat.getLat();
				if(!this.formData.schoolCode){
					return;
				}
				setLngLat(this.formData).then(res => {
					if(res && res !== 'false'){
						this.$message({
              message: '设置成功',
              type: 'success',
              duration:1500
            });
						this.rowValue.state = '修改';
						this.rowValue.longitude = this.formData.longitude;
          	this.rowValue.latitude = this.formData.latitude;
					}else{
						this.$message.error('操作失败');
					}
				});
			},
			findItem() {
				var vm = this;
				this.placeSearch.search(this.name);
			},
			select(e) {
				this.placeSearch.setCity(e.poi.adcode);
        this.placeSearch.search(e.poi.name);  //关键字查询查询
			},
			init() {
				var vm = this;
				this.map = new AMap.Map("container", {
		      resizeEnable: true
		    });
		    this.map.on("click",function(e){
		    	vm.getLngLat(e);
		    });
	    	this.autoOptions =  {
	        input: "nameSelect"
	    	};
	    	AMap.service(["AMap.Autocomplete"], function() {
	    		vm.auto = new AMap.Autocomplete(vm.autoOptions);
	    	});
		    AMap.service(["AMap.PlaceSearch"], function() {
	        vm.placeSearch = new AMap.PlaceSearch({ //构造地点查询类
	          map: vm.map
	        });
	        //关键字查询
	        if(vm.topData){
	        	vm.placeSearch.search(vm.topData.unitName);
	        }else{
	        	vm.placeSearch.search('长沙市');
	        }

	    	});
	    	//AMap.event.addListener(vm.auto, "select", vm.select);
			}
		},
		mounted() {
			if (!this.loadMapJs) {
				this.$message.error('地图加载失败');
				console.log('地图js没加载');
			} else {
				this.loadMapJs.then(() => {
					this.init();
				});
			}
			
      //scrollTable();
			
		}
	}
</script>
<style rel="stylesheet/scss" lang="less" scoped>
	.container {
		width: 100%;
		height: 640px;
	}
	.pagination{
		margin-top:0px;
		padding:5px 0px;
		background: #fff;
		// border:1px solid #d3dce6;
		text-align: center;
	}
	.table-in2 {
  border: 1px solid #eee;
  box-sizing: border-box;
  width: 100%;
  line-height: 36px;
  font-size: 12px;
  text-align: center;
  width: 100%;
  border-collapse: collapse;
  thead {
    background-color: #f4f4f4;
  }
  td {
    border: 1px solid #eee;
    text-align: center;
    padding: 2px 8px;
  }
  tbody tr td.tdTwo {
    text-align: center;
  }
  tr.trOne td {
    text-align: right;
    padding-right: 16px;
  }
  tbody td {
    text-align: right;
    padding-right: 16px;
  }
}
</style>
