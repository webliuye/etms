<template>
		<div class="filter-container">
			<div class="search-select">
        <div class="fr selectwidth1">
          <SubjectSelect @changeSubject="changeSubject"></SubjectSelect>
        </div>
        <div class="fr selectwidth">
          <TermSelect @changeTerm="changeTerm"></TermSelect>
        </div>
        <div class="fr selectwidth">
          <YearSelect @changeYear="changeYear"></YearSelect>
        </div>
      </div>
      <div>
        <NormalChart :style="{width:'100%',height:'260px'}" :titleObj="barTitle" :dataX="subjectName" :dataName="learnName" :dataNum="subjectData" :chartColor="chartColor"></NormalChart>
      </div>
      <div class="table-div">
        <table cellpadding="0" cellspacing="0" class="table-in2 fixedTable" id='table-in5'>
          <thead>
            <tr>
              <td style="width:15%;">科目</td>
              <td style="width:15%;">类型</td>
              <td style="width:15%;">年级</td>
              <td class="tdTwo" style="width:12%;">应开数</td>
              <td class="tdTwo" style="width:12%;">实开数</td>
              <td class="tdTwo" style="width:15%;">开出率</td>
              <td style="width:16%;">是否达标</td>
            </tr>
          </thead>
         </table> 
         <table cellpadding="0" cellspacing="0" class="table-in2">
          <tbody v-for="(item,index) in list" :key="'00' + index"  v-if="item.groupData.length + item.demoData.length > 0">
            <tr v-if="item.groupData.length > 0">
              <td style="width:15%;" :rowspan="item.groupData.length + item.demoData.length">{{item.subjectName}}</td>
              <td style="width:15%;" :rowspan="item.groupData.length">分组实验</td>
              <td style="width:15%;">{{item.groupData[0].gradeName}}</td>
              <td style="width:12%;" class="tdTwo">{{item.groupData[0].mustNumber}}</td>
              <td style="width:12%;" class="tdTwo">{{item.groupData[0].factNumber}}</td>
              <td style="width:15%;" class="tdTwo">{{item.groupData[0].rate | numberTrans}}</td>
              <td style="width:16%;">{{item.groupData[0].status?'是':'否'}}</td>
            </tr>
            <tr v-for="(items,index) in item.groupData" v-if="index != 0" :key="'11' + index">
              <td>{{items.gradeName}}</td>
              <td class="tdTwo">{{items.mustNumber}}</td>
              <td class="tdTwo">{{items.factNumber}}</td>
              <td class="tdTwo">{{items.rate | numberTrans}}</td>
              <td>{{items.status?'是':'否'}}</td>
            </tr>
            <tr v-if="item.demoData.length > 0">
              <td v-if="item.groupData.length < 1" :rowspan="item.groupData.length + item.demoData.length">{{item.subjectName}}</td>
              <td :rowspan="item.demoData.length">演示实验</td>
              <td>{{item.demoData[0].gradeName}}</td>
              <td class="tdTwo">{{item.demoData[0].mustNumber}}</td>
              <td class="tdTwo">{{item.demoData[0].factNumber}}</td>
              <td class="tdTwo">{{item.demoData[0].rate | numberTrans}}</td>
              <td>{{item.demoData[0].status?'是':'否'}}</td>
            </tr>
            <tr v-for="(items,index) in item.demoData" v-if="index != 0" :key="'22' + index">
              <td>{{items.gradeName}}</td>
              <td class="tdTwo">{{items.mustNumber}}</td>
              <td class="tdTwo">{{items.factNumber}}</td>
              <td class="tdTwo">{{items.rate | numberTrans}}</td>
              <td>{{items.status?'是':'否'}}</td>
            </tr>
          </tbody>
        </table>
      </div>
		</div>
</template>

<script>
import { getSubjectOpenCount } from "api/count";
import NormalChart from "components/Charts/normalChart";
import YearSelect from "views/components/select/yearSelect";
import TermSelect from "views/components/select/termSelect";
import SubjectSelect from "views/components/select/subjectSelect";
import { scrollTable } from 'src/utils';
export default {
  name: "rankCount",
  components: { NormalChart, YearSelect, TermSelect, SubjectSelect },
  data() {
    return {
      searchData: {
        subject: null,
        termYear: null,
        term: null
      },
      barTitle: {
        text: "各科目达标率",
        left: "center",
        top: "12px",
        textStyle: {
          fontWeight: "bold",
          fontSize: "14"
        }
      },
      subjectName: ["科学", "物理", "化学", "生物"],
      learnName: ["小学", "初中", "高中"],
      chartColor: ["#20A0FF", "#ABCD03", "#e4353c", "#f003ff"],
      subjectData: [],
      list: null,
      listData:[]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getSubjectOpenCount(this.searchData).then(res => {
        if (res.totalLists && res.totalLists.length > 0) {
          const t = res.totalLists;
          const s = res.gradeLists;
          var science = {
            subjectId: "1",
            subjectName: "科学",
            groupData: [],
            demoData: []
          };
          var physics = {
            subjectId: "2",
            subjectName: "物理",
            groupData: [],
            demoData: []
          };
          var chemistry = {
            subjectId: "3",
            subjectName: "化学",
            groupData: [],
            demoData: []
          };
          var biology = {
            subjectId: "4",
            subjectName: "生物",
            groupData: [],
            demoData: []
          };
          var vm = this;
          vm.subjectData = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
          t.forEach(function(item) {
            if (item.subject == "科学") {
              vm.subjectData[0] = [(item.openRate * 100).toFixed(2), 0, 0, 0];
            } else if (item.subject == "物理") {
              if (item.section == "初中") {
                vm.subjectData[1][1] = (item.openRate * 100).toFixed(2);
              } else if (item.section == "高中") {
                vm.subjectData[2][1] = (item.openRate * 100).toFixed(2);
              }
            } else if (item.subject == "化学") {
              if (item.section == "初中") {
                vm.subjectData[1][2] = (item.openRate * 100).toFixed(2);
              } else if (item.section == "高中") {
                vm.subjectData[2][2] = (item.openRate * 100).toFixed(2);
              }
            } else if (item.subject == "生物") {
              if (item.section == "初中") {
                vm.subjectData[1][3] = (item.openRate * 100).toFixed(2);
              } else if (item.section == "高中") {
                vm.subjectData[2][3] = (item.openRate * 100).toFixed(2);
              }
            }
          });
          s.forEach(function(item) {
            if (item.subjectId == "1") {
              item.type == "分组实验"
                ? science.groupData.push(item)
                : science.demoData.push(item);
            } else if (item.subjectId == "2") {
              item.type == "分组实验"
                ? physics.groupData.push(item)
                : physics.demoData.push(item);
            } else if (item.subjectId == "3") {
              item.type == "分组实验"
                ? chemistry.groupData.push(item)
                : chemistry.demoData.push(item);
            } else if (item.subjectId == "4") {
              item.type == "分组实验"
                ? biology.groupData.push(item)
                : biology.demoData.push(item);
            }
          });
          this.list = [science, physics, chemistry, biology];
        } else {
          this.list = [];
          this.subjectData = [];
        }
      });
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {

    },
    changeYear(year) {
      this.searchData.termYear = year;
      this.getList();
    },
    changeTerm(term) {
      this.searchData.term = term;
      this.getList();
    },
    changeSubject(subject) {
      this.searchData.subject = subject;
      this.getList();
    }
  },
  mounted() {
    scrollTable(null, ".fixedTable", true);
  }
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.table-in2 {
  border: 1px solid #eee;
  box-sizing: border-box;
  width: 100%;
  line-height: 36px;
  text-align: center;
  border-collapse: collapse;
  thead {
    background-color: #f4f4f4;
  }
  td {
    border: 1px solid rgb(223, 230, 236);
    text-align: center;
    padding: 2px 8px;
    font-size: 12px;
  }
  td.tdTwo {
    text-align: right;
    padding-right: 16px;
  }
}
</style>
