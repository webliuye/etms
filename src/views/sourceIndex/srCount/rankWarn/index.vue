<template>
<master-page title="实验开出预警">
    <div class="filter-container">
      <el-button class="pull-right main-returnA" type="text" @click="$router.go(-1)">返回</el-button>
    </div>
    <div class="dashboard-container ">
      <div class="search-select">
        <div class="fr" v-show="changeSchool">
          <el-input placeholder="学校名称" v-model="searchData.schoolName">
            <i
            class="el-icon-search el-input__icon"
            slot="suffix"
            @click="findItem">
            </i>
          </el-input>
        </div>
        <div class="fr selectwidth">
          <YearSelect @changeYear="changeYear"></YearSelect>
        </div>
      </div>
      <div class="table-div srcrankWarn">
        <el-table v-show="changeSchool" :data="schoolList" fit highlight-current-row style="width: 100%" ref="editTable">
          <el-table-column prop="unitName" align="left" label="学校名称" min-width="250">
            <template slot-scope="scope">
              <router-link :to="{name: 'ConSchool',params:{id:scope.row.unitId,name:scope.row.unitName}}" class="el-button el-button--text">
                <span>{{scope.row.unitName}}</span>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column prop="amount" align="right" sortable label="开课次数" min-width="120"></el-table-column>
          <el-table-column prop="classAmount" align="right" sortable label="班级数" min-width="120"></el-table-column>
          <el-table-column prop="rate" align="right" sortable label="班级平均开课数" min-width="200">
            <template slot-scope="scope">
              {{Number(scope.row.rate).toFixed(2)}}
            </template>
          </el-table-column>
          <el-table-column prop="classDate" align="right" sortable label="最近上课时间" class-name="bgColor" min-width="180">
            <template slot-scope="scope">
              <span :class="scope.row.className">{{scope.row.classDate.slice(0,10)}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
</master-page>
</template>

<script>
    import YearSelect from 'views/components/srcSelect/yearSelect';
    import MasterPage from 'views/layout/MasterPage1';
    import { mapGetters } from 'vuex';
    import { testWarnData} from 'api/sourceIndex';
      import {scrollTable} from "utils/index"
    export default {
      name: 'roomCount',
      components: {MasterPage, YearSelect },
      data() {
        return {
          listLoading: true,
          schoolList:null,
          list: null,
          checkList:[],
          searchData:{
            subject:null,
            staffName:null,
            unitName:null,
            gradeId:null,
            schoolName:'',
            termYear:'',
            page:1,
            size:10
          },
          activeName2:'first',
          chartData:[],
          dataNum:[],
          changeSchool:true
        }
      },
      created() {
        this.getSchoolList();
      },
      methods : {
        getSchoolList(){
          this.searchData.page=1;
          this.searchData.termYear=this.searchData.termYear;
          this.searchData.schoolName=this.searchData.schoolName;
            testWarnData(this.searchData).then(res=>{
                this.schoolList = res;
                var that=this;
              setTimeout(function(){   //设置背景色
               $('td.bgColor').each(function(index,element){
              var classDate = Date.parse(new Date(that.schoolList[index].classDate));
              var  newDate=new Date();
              var days=Math.floor((newDate-classDate)/86400000);
              if(days < 20) {
                $(element).css("background-color","");
              }else if (days < 30) {
                $(element).css("background-color","#ffdbdb");
              }else if (days < 40) {
                $(element).css("background-color","#ffb6b6");
              }else if (days < 50) {
                $(element).css("background-color","#ff9292");
              }else if (days < 60) {
                $(element).css("background-color","#ff6d6d");
              }else {
                $(element).css("background-color","#ff4949");
              }
            });
            },200);
            }
          )

        },
        handleClick(tab, event) {
          // this.changeSchool = !this.changeSchool;
          if(tab.name=='first'){
             this.getSchoolList();
          }else{
            this.findItem1();
          }
        },
        tableRowClassName(row, index) {
          return 'info-row';
        },
        changeYear(year){
          this.searchData.termYear = year;
        },
        findItem() {
          this.searchData.page = 1;
          this.getSchoolList();
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
      mounted(){
        scrollTable('.srcrankWarn')
      }
    }
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.dashboard-container { font-family: '微软雅黑';
}
.home-p {
  width: 100%;
  border-bottom: 1px solid #e1e4e3;
  line-height: 1.6em;
  font-size: 12px;
}
.right { float:right; display: inline;}
.expand {
  padding: 0 0 0 50px;
}
table {
  border-collapse: separate;
  border:none;
}

  td {
    //  border:1px solid #ccc;
    //  text-align: center;
    padding:0 18px;
    border: 1px solid #e1e4e3;
    border-collapse: collapse;
    border-right:none;
    border-top: none;
  }
td:last-child {
  border-right:1px solid #e1e4e3;
}
th{
  padding:0 18px;
  border: 1px solid #e1e4e3;
  border-collapse: collapse;
  border-right:none;
}
th:last-child {
  border-right: 1px solid #e1e4e3;
}
tbody {
  border: none;
}
</style>
