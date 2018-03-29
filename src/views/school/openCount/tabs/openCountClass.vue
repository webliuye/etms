<template>
    <div class="dashboard-container">
      <div class="search-select">
        <el-button type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
        <div class="fr selectwidth">
          <TermSelect @changeTerm="changeTerm"></TermSelect>
        </div>
        <div class="fr selectwidth">
          <YearSelect @changeYear="changeYear"></YearSelect>
        </div>
      </div>
      <el-table :data="list" border fit highlight-current-row style="width: 100%" ref="editTable"  v-sticky="{isElementTable: true}"   class="table-all">
        <template v-if="list&&list[0]&&list[0].subjectOpen"  >
            <el-table-column  prop="className" label="班级名称" show-overflow-tooltip min-width="80" ></el-table-column>
            <el-table-column  prop="gradeName" align="center" label="年级"  min-width="80"></el-table-column>
            <el-table-column  align="center" :label="item.subjectName" v-for="(item,index) in list[0].subjectOpen" :key="index" >
                <el-table-column   align="right" label="应开数"  min-width="80">
                    <template slot-scope="scope">
                        {{scope.row.subjectOpen[index]['mustNum']}}
                    </template>
                </el-table-column>
                <el-table-column   align="right" label="实开数"  min-width="80">
                   <template slot-scope="scope">
                        {{scope.row.subjectOpen[index]['factNum']}}
                    </template>
                </el-table-column>
                <el-table-column   align="right" label="开出率"  min-width="80">
                    <template slot-scope="scope">
                           {{scope.row.subjectOpen[index]['rate'] | numberTrans}}
                    </template>
                </el-table-column>
            </el-table-column>
         <el-table-column   align="right" label="总开出率"  min-width="80">
           <template slot-scope="scope">
             {{scope.row.rate | numberTrans}}
           </template>
         </el-table-column>
        </template>
      </el-table>
    </div>
</template>

<script>
    import YearSelect from 'views/components/select/yearSelect';
    import TermSelect from 'views/components/select/termSelect';
    import {changeDate, numberTransValue} from 'src/filters';
    import { getClassOpenCount } from 'api/count';
    export default {
      name: 'openRecord',
      components: { YearSelect, TermSelect},
      data() {
        return {
          list: null,
          searchData:{
            termYear:null,
            termId:null
          }
        }
      },
      created() {
        this.orgType = this.$store.state.user.userInfo.orgType;
        this.orgId = this.$store.state.user.userInfo.orgId;
        this.getList();
         this.list=[
           {className:'01',grade:'九年级',techMust:'1',techReal:'1',techRate:'1',phyMust:'1',phyReal:'1',phyRate:'1',chemMust:'1',chemReal:'1',chemRate:'1',bioMust:'1',bioReal:'1',bioRate:'12%',totalRate:'32%'}
           ]
      },
      methods : {
        getList() { // 获取表格数据
          getClassOpenCount(this.searchData).then(res => {
            this.list=res;

          });
        },
        changeYear(year){
          this.searchData.termYear = year;
          this.getList();
        },
        changeTerm(term){
          this.searchData.termId = term;
          this.getList();
        },
        handleDownload(){
          require.ensure([], () => {
            const { export_json_to_excel } = require('vendor/Export2Excel');

            var  tHeader = ['班级名称','年级'];
            var  filterVal = ['className','gradeName'];
            const list = JSON.parse(JSON.stringify(this.list));

            list.forEach(e=>{
                 e.subjectList=[]
                  e.nameList=[];
                  e.rate=Math.round(e.rate*100)+'%';
                  e.subjectOpen.forEach(t=>{
                      e['factNum'+t.subjectId]=t.factNum;
                      e['mustNum'+t.subjectId]=t.mustNum;
                      e['rate'+t.subjectId]=Math.round(t.rate*100)+'%';
                      var arr=[t.subjectName+'应开数',t.subjectName+'实开数',t.subjectName+'开出率']
                      var arra=['mustNum'+t.subjectId,'factNum'+t.subjectId,'rate'+t.subjectId]
                      e.nameList=e.nameList.concat(arr);
                      e.subjectList=e.subjectList.concat(arra)
                  })
            });
             tHeader = tHeader.concat(list[0].nameList);
             tHeader.push('总开出率');
             filterVal = filterVal.concat(list[0].subjectList);
             filterVal.push('rate');
            var name = changeDate(new Date()) + "班级开出统计";
            const data = this.formatJson(filterVal, list);
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
        },
      },
      mounted() {
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
  font-size: 14px;
}
.right { float: right; display: inline;}
.expand {
  padding: 0 0 0 50px;
}
.table-in {
  border: none;
  box-sizing: border-box;
  width: 100%;
  td {
     border:1px solid #ccc;
     text-align: center;
  }
}
.course-info {
  margin: 0 auto;

}
</style>
