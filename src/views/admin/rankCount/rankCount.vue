<template>
		<div class="filter-container">
			<div class="search-select">
        <div class="fr">
          <el-input
            placeholder="学校名称"
            v-model="searchData.unitName">
            <i
            class="el-icon-search el-input__icon"
            slot="suffix"
            @click="getList">
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
      <div>
        <NormalChart :style="{width:'100%',height:'260px'}" :titleObj="barTitle" :dataX="subjectName" :dataName="learnName" :dataNum="subjectData" :chartColor="chartColor"></NormalChart>
      </div>
      <div class="table-div" id="firstTable">
      	<el-table :data="list" border fit highlight-current-row style="width: 100%;" ref="editTable" class="table-all" v-sticky="{isElementTable: true}">
      		<el-table-column  type="index" align="center" label="排行" width="74"></el-table-column>
      		<el-table-column  prop="unitName" label="学校" min-width="160" show-overflow-tooltip>
      			<template slot-scope="scope">
              <a href='javascript:;' class ="el-button--text" @click="goSchoolDetail(scope.row)">{{scope.row.unitName}}</a>
    				</template>
      		</el-table-column>
      		<el-table-column  prop="sectionName" label="学段" min-width="74" show-overflow-tooltip></el-table-column>
      		<el-table-column  align="center" label="科学">
      			<el-table-column  prop="science_GroupNumber" align="right" label="分组" min-width="80">
              <template slot-scope="scope">
                <span>{{scope.row.science_GroupNumber | numberTrans}}</span>
              </template>   
            </el-table-column>
      			<el-table-column  prop="science_DemoNumber" align="right" label="演示" min-width="80">
              <template slot-scope="scope">
                <span>{{scope.row.science_DemoNumber | numberTrans}}</span>
              </template> 
            </el-table-column>
      			<el-table-column  prop="science_Status" align="center" label="达标" min-width="80">
      				<template slot-scope="scope">
      					<span>{{scope.row.science_Status?"是":"否"}}</span>
      				</template>
      			</el-table-column>
      		</el-table-column>
      		<el-table-column  align="center" label="物理">
      			<el-table-column  prop="physics_GroupNumber" align="right" label="分组" min-width="80">
              <template slot-scope="scope">
                <span>{{scope.row.physics_GroupNumber | numberTrans}}</span>
              </template>  
            </el-table-column>
      			<el-table-column  prop="physics_DemoNumber" align="right" label="演示" min-width="80">
              <template slot-scope="scope">
                <span>{{scope.row.physics_DemoNumber | numberTrans}}</span>
              </template>   
            </el-table-column>
      			<el-table-column  prop="physics_Status" align="center" label="达标" min-width="80">
      				<template slot-scope="scope">
      					<span>{{scope.row.physics_Status?"是":"否"}}</span>
      				</template>
      			</el-table-column>
      		</el-table-column>
      		<el-table-column  align="center" label="化学">
      			<el-table-column  prop="chemistry_GroupNumber" align="right" label="分组" min-width="80">
              <template slot-scope="scope">
                <span>{{scope.row.chemistry_GroupNumber | numberTrans}}</span>
              </template>   
            </el-table-column>
      			<el-table-column  prop="chemistry_DemoNumber" align="right" label="演示" min-width="80">
              <template slot-scope="scope">
                <span>{{scope.row.chemistry_DemoNumber | numberTrans}}</span>
              </template>    
            </el-table-column>
      			<el-table-column  prop="chemistry_Status" align="center" label="达标" min-width="80">
      				<template slot-scope="scope">
      					<span>{{scope.row.chemistry_Status?"是":"否"}}</span>
      				</template>
      			</el-table-column>
      		</el-table-column>
      		<el-table-column  align="center" label="生物">
      			<el-table-column  prop="creature_GroupNumber" align="right" label="分组" min-width="80">
              <template slot-scope="scope">
                <span>{{scope.row.creature_GroupNumber | numberTrans}}</span>
              </template>   
            </el-table-column>
      			<el-table-column  prop="creature_DemoNumber" align="right" label="演示" min-width="80">
              <template slot-scope="scope">
                <span>{{scope.row.creature_DemoNumber | numberTrans}}</span>
              </template>   
            </el-table-column>
      			<el-table-column  prop="creature_Status" align="center" label="达标" min-width="80">
      				<template slot-scope="scope">
      					<span>{{scope.row.creature_Status?"是":"否"}}</span>
      				</template>
      			</el-table-column>
      		</el-table-column>
      	</el-table>
      </div>
		</div>
</template>

<script>
import { getSchoolOpenCount } from "api/count";
import NormalChart from "components/Charts/normalChart";
import YearSelect from "views/components/select/yearSelect";
import TermSelect from "views/components/select/termSelect";
export default {
  name: "rankCount",
  components: { NormalChart, YearSelect, TermSelect },
  data() {
    return {
      searchData: {
        unitName: "",
        termYear: null,
        term: null
      },
      barTitle: {
        text: "各科目实验达标率",
        left: "center",
        top: "12px",
        textStyle: {
          fontWeight: "bold",
          fontSize: "14"
        }
      },
      subjectName: ["科学", "物理", "化学", "生物"],
      learnName: ["小学", "初中", "高中"],
      subjectData: [],
      chartColor: ["#20A0FF", "#ABCD03", "#e4353c"],
      list: null
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getSchoolOpenCount(this.searchData).then(res => {
        this.list = res.sectionLists;
        var t = [];
        t.push(res.primary_science_Rate, 0, 0, 0);
        this.subjectData = [];
        this.subjectData.push([
          (res.primary_science_Rate * 100).toFixed(2),
          0,
          0,
          0
        ]);
        this.subjectData.push([
          0,
          (res.middle_physics_Rate * 100).toFixed(2),
          (res.middle_chemistry_Rate * 100).toFixed(2),
          (res.middle_creature_Rate * 100).toFixed(2)
        ]);
        this.subjectData.push([
          0,
          (res.high_physics_Rate * 100).toFixed(2),
          (res.high_chemistry_Rate * 100).toFixed(2),
          (res.high_creature_Rate * 100).toFixed(2)
        ]);
      });
    },
    goSchoolDetail(row) {
      this.$router.push({
        name: "RankSchoolDetail",
        params: { id: row.unitId, sectionId: row.sectionId },
        query: { year: this.searchData.termYear }
      });
    },
    changeYear(year) {
      this.searchData.termYear = year;
      this.getList();
    },
    changeTerm(term) {
      this.searchData.term = term;
      this.getList();
    }
  },
  mounted() {
  }
};
</script>
