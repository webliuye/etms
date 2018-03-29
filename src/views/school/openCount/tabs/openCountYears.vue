<template>
		<div class="filter-container">
      <div class="search-select">
        <el-button type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
      </div>
      <div class="table-div yearsCount">
        <table cellpadding="0" cellspacing="0" class="table-in2">
          <thead>
            <tr>
              <td style="width:8%;" :rowspan="3">学科</td>
              <td style="width:10%;" :rowspan="3">开课方式</td>
              <td class="trOne" style="width:10%;" :rowspan="3">年级</td>
              <td style="width:72%;" :colspan="12">年度</td>
            </tr>
            <tr>
              <td v-for="(item, index) in tableData.yearsData" :key="index" :colspan="3">{{item}}</td>
            </tr>
            <tr class="trOne">
              <td v-for="(item, index) in 12" :key="index">{{['应开数', '实开数', '开出率'][index % 3]}}</td>
            </tr>
          </thead>
        </table> 
        <table cellpadding="0" cellspacing="0" class="table-in2">  
          <tbody v-for="(item, index) in tableData.subjectArray" :key="index">
            <tr v-if="tableData.groupsData[item.subjectId].length > 0" v-for="(itm, idx) in tableData.groupsData[item.subjectId]" :key="idx">
              <td style="width:8%;" class="tdTwo" :rowspan="item.lengthValue" v-if="idx == 0">{{item.subjectName}}</td>
              <td style="width:10%;" class="tdTwo" :rowspan="tableData.groupsData[item.subjectId].length" v-if="idx == 0">分组实验</td>
              <td style="width:10%;" class="tdTwo">{{itm.gradeName}}</td>
              <td style="width:6%" v-for="(props, ids) in tableData.props" :key="ids"><span v-if="(ids % 3) != 2">{{itm[props]}}</span><span v-if="(ids % 3) == 2">{{itm[props] | numberTrans}}</span></td>
            </tr>
            <tr v-if="tableData.demosData[item.subjectId].length > 0" v-for="(itm, idx) in tableData.demosData[item.subjectId]" :key="idx + '0'">
              <td style="width:8%;" class="tdTwo" :rowspan="item.lengthValue" v-if="(idx == 0) && (tableData.groupsData[item.subjectId].length == 0)">{{item.subjectName}}</td>
              <td style="width:10%;" class="tdTwo" :rowspan="tableData.demosData[item.subjectId].length" v-if="idx == 0">演示实验</td>
              <td style="width:10%;" class="tdTwo">{{itm.gradeName}}</td>
              <td  style="width:6%" v-for="(props, ids) in tableData.props" :key="ids"><span v-if="(ids % 3) != 2">{{itm[props]}}</span><span v-if="(ids % 3) == 2">{{itm[props] | numberTrans}}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
		</div>
</template>

<script>
import { getCountByYearsData, getGuideYears } from "api/count";
import {numberTransTwo, changeDate, numberTransValue} from 'src/filters';
export default {
  name: "yearsCount",
  components: {  },
  data() {
    return {
      yearsData: [],
      searchData: {
        term: null
      },
      tableData: {
        subjectArray: [],
        yearsData: [],
        groupsData: {},
        demosData: {},
        subjectData: {},
        props: []
      }
    };
  },
  created() {
    const vm = this;
    getGuideYears(4).then(res => {
      if (Array.isArray(res) && res.length > 0) {
        this.tableData.yearsData = res;
        res.forEach(e => {    //建立对应规则
          let t = e.slice(0, 4);
          let v = vm.tableData.props;
          v.push(t + 'must');
          v.push(t + 'fact');
          v.push(t + 'rate');
        });
      } else {
        this.yearsData = [];
      }
    });
    console.log(Date.now());
    this.getList();

  },
  methods: {
    getList() {
      const vm = this;
      const obj = this.tableData;
      getCountByYearsData().then(res => {
        console.log(Date.now());
        if (Array.isArray(res) && res.length > 0) {
          res.forEach(e => {
            let subject;
            let type;
            if (!obj.subjectData[e.subjectId]) {
              obj.subjectData[e.subjectId] = {};
              subject = obj.subjectData[e.subjectId];
              subject.subjectId = e.subjectId;
              subject.subjectName = e.subjectName;
              subject.lengthValue = 0;
            } else {
              subject = obj.subjectData[e.subjectId];
            }
            type = e.catalogueType == '1' ? obj.groupsData : obj.demosData;
            let typeValue = e.catalogueType == '1' ? '分组实验' : '演示实验';
            type[e.subjectId] = type[e.subjectId] || [];
            let gradeYears = {};
            e.gradeYearOpenList.forEach(s => {
              gradeYears[s.gradeId] = gradeYears[s.gradeId] || {};
              let u = gradeYears[s.gradeId];
              let t = s.termYear.slice(0,4);
              //下载用
              u.subjectName = e.subjectName; 
              u.gradeId = s.gradeId;
              u.gradeName = s.gradeName;
              u[t + 'must'] = s.mustNum;
              u[t + 'fact'] = s.factNum;
              u[t + 'rate'] = s.rate;
              //下载用
              u[t + 'downRate'] = numberTransValue(s.rate);  
              u.type = typeValue;
            });
            Object.keys(gradeYears).forEach(u => {
              type[e.subjectId].push(gradeYears[u]);
            });
            subject.lengthValue += type[e.subjectId].length;
          });
          Object.keys(obj.subjectData).forEach(u => {
            obj.subjectArray.push(obj.subjectData[u]);
          });
        }
      });
    },
    handleDownload() {
      let listData = [];
      const vm = this;
      require.ensure([], () => {
        const { export_json_to_excel } = require('vendor/Export2Excel');
        const tHeader = ['学科','开课方式','年级'];
        vm.tableData.yearsData.forEach(s => {
          tHeader.push(s + '应开数', s + '实开数', s + '开出率(%)');
        });
        const filterVal = ['subjectName','type','gradeName']
        vm.tableData.yearsData.forEach(e => { 
          let t = e.slice(0, 4);
          filterVal.push(t + 'must');
          filterVal.push(t + 'fact');
          filterVal.push(t + 'downRate');
        });
        this.tableData.subjectArray.forEach(e => {
          listData = listData.concat(vm.tableData.groupsData[e.subjectId], vm.tableData.demosData[e.subjectId]);
        });
        var name = changeDate(new Date()) + "年度开出统计";
        const data = this.formatJson(filterVal, listData);
        export_json_to_excel(tHeader, data, name);
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  },
  mounted() {
  }
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.filter-container {
  overflow: auto;
}
.yearsCount {
  min-width: 1240px;
  overflow: auto;
  margin-top: 8px;
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
