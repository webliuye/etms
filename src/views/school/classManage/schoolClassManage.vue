<template>
	<div class="dashboard-container">
    <div class="search-select">
      <div class="fl selectwidth1">
        <el-select v-model="gradeVal" @change="tabClick" clearable placeholder="全部年级">
          <el-option
            v-for="(item,index)  in gradeData"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
		<div class="table-div">
			<table cellpadding="0" cellspacing="0" class="table-in3 table-class-in3">
				<thead>
					<tr>
            <td class="tdLeft" rowspan="2" width="10%">年级</td>
		        <td class="tdLeft" rowspan="2" width="15%">班级</td>
		        <td class="classname is-center" :colspan="subjectData.length">科目</td>
		      </tr>
		      <tr>
		      	<td v-for="(item,index) in subjectData" :key="item.value">{{item.label}}</td>
		      </tr>
				</thead>
				<tbody v-for="(itm,idx) in allDataArray" :key="'01' + idx" v-if="itm.classData && itm.classData.length > 0">
					<tr v-for="(item,index) in itm.classData" :key="index">
            <td v-if="index == 0" class="tdLeft" :rowspan="itm.classData.length">{{itm.gradeName}}</td>
						<td class="tdLeft oneLine">{{item.className}}</td>
						<td v-for="(items,indexs) in subjectData" :key="'04' + indexs">
              <span v-for="(imms,dex) in item.list" :key="'000'+dex">
                <el-select v-if="imms.subjectId == items.value"  v-model="imms.staffId" @change="changeStaff(imms)" filterable clearable placeholder="选择教师">
                  <el-option
                    v-for="(itemss,index22)  in staffData"
                    :key="'01'+index22"
                    :label="itemss.name"
                    :value="itemss.id">
                  </el-option>
                </el-select>
              </span>
						</td>
					</tr>
				</tbody>
        <tbody v-if="noClass" v-loading="loading" element-loading-text="加载中">
          <tr>
            <td :colspan="subjectData.length + 2" style="padding:0 24px;color:#666;text-align:center"><span>{{noClassInfo}}</span>
            </td>
          </tr>
        </tbody>
			</table>
		</div>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';
  import { getAllTeacher } from 'api/manageCenter';
	import { getGrade, getSubject, getStaffg } from 'api/common';
	import { getMineClass, getGradeClass, setStaffClass } from "api/manageCenter";
	export default {
		name: 'schoolClassManage',
		data() {
			return {
        noClass: true,  
        noClassInfo:'',
        loading: false,
        gradeVal:'',
				gradeData: [],
        allDataArray:[],
        allDataObj:{},
				subjectData:[],
        staffData:[]
			};
		},
		// computed: {
  //     ...mapGetters([
  //       'subjectData'
  //     ])
  //   },
    created() {
      const vm = this;
      this.loading = true;
    	this.$store.dispatch('GetSubject').then(res => {
        this.subjectData = res;
      });
      getAllTeacher().then(res => {
        vm.staffData = res;
      });
      getGrade().then(res => {
        if(res && res.length > 0){
          this.gradeData = res;
          this.gradeData.forEach(function(s){
            vm.allDataObj[s.value] = {};
            vm.allDataObj[s.value].gradeId = s.value;
            vm.allDataObj[s.value].gradeName = s.label;
            vm.allDataObj[s.value].classData = [];
            vm.allDataArray.push(vm.allDataObj[s.value]);
          });
          getGradeClass().then(res => {
            vm.loading = false;
            if(res && res.length > 0){
              res.forEach(function(v) {
                if(vm.allDataObj[v.gradeId]){
                  vm.allDataObj[v.gradeId].classData.push(v);
                }
              });
            }
            vm.noClass = !vm.allDataArray || vm.allDataArray.length === 0 || (vm.allDataArray.length === 1 && vm.allDataArray[0].classData.length === 0);
            vm.noClassInfo = '该年级暂无班级设置';
          });
        }
      });
    },
    methods: {
    	changeStaff(data) {
    		var objData = {};
    		objData.staffId = data.staffId;
    		objData.subjectId = data.subjectId;
    		objData.classId = data.classId;
    		setStaffClass(objData).then(res => {
    			if(!res || res === 'false'){
    				this.$message.error('操作失败');
    			}else{
            this.$message({
              message: '设置成功',
              type: 'success',
              duration:1500
            });
          }
    		}).catch(error => {

    		});
    	},
    	tabClick() {
        const vm = this;
        this.allDataArray = [];
        if(!this.gradeVal){
          this.gradeData.forEach(function(s){
            vm.allDataArray.push(vm.allDataObj[s.value]);
          });
        }else{
          this.allDataArray.push(vm.allDataObj[vm.gradeVal]);
        }
        vm.noClass = !vm.allDataArray || vm.allDataArray.length === 0 || (vm.allDataArray.length === 1 && vm.allDataArray[0].classData.length === 0);
    	}
    }
	}
</script>
<style rel="stylesheet/scss" lang="less" scoped>
  .table-class-in3 {
    width: 100%;
    border: 1px solid #bfcbd9;
    border-collapse: collapse;
    box-sizing: border-box;
    td {
      border: 1px solid #bfcbd9;
    }
  }
</style>
