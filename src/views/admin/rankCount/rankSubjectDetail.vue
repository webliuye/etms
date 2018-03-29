<template>
	<master-page title="学校开出率年级统计详情">
		<div class="filter-container">
      <div class="table-div">
        <table cellpadding="0" cellspacing="0" class="table-in3">
          <thead>
            <tr>
              <td style="width:10%; min-width:72px;">科目</td>
              <td style="width:10%; text-align:left;padding-left:8px;">实验章节</td>
              <td style="width:15%; text-align:left;padding-left:8px;">实验名称</td>
              <td style="width:10%; min-width:100px;">分组类型</td>
              <td  v-for="(item,index) in classData" :key="index" style="min-width:100px;">
                <span class="oneLine">
                  {{item.className}}
                </span>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in list" :key="index">
              <td>{{item.subjectName}}</td>
              <td class="tdLeft">
                <span class="oneLine" :title="item.chapterName">
                  {{item.chapterName}}
                </span>
              </td>
              <td class="tdLeft">
                <span class="oneLine" :title="item.catalogueName">
                  {{item.catalogueName}}
                </span>
              </td>
              <td>{{item.typeName}}</td>
              <td v-for="(classIdName,index) in classData" :key="'00' + classIdName.classId">
                <span v-for="(items,index) in item.classInfos" :key="items.classId" v-if="items.classId === classIdName.classId">
                  <i v-if="items.sign == 1" class="el-icon-check" ></i>
                </span>
              </td>
            </tr>
            <tr v-if="list.length == 0 || classData.length==0">
              <td :colspan="4 + classData.length" style="padding:0 24px;color:#666;text-align:center">暂无数据
              </td>
            </tr>
          </tbody>
        </table>
      </div>
		</div>
	</master-page>
</template>

<script>
import MasterPage from "views/layout/MasterPage";
import { getSchoolThreeClass, getSchoolThreeData } from "api/count";
export default {
  name: "rankCount",
  components: { MasterPage },
  data() {
    return {
      searchData: {
        termYear: null,
        unitId: "",

      },
      classData:[],
      list: []
    };
  },
  created() {
    this.searchData.termYear = this.$route.query.year;
    this.searchData.unitId = this.$route.params.id;
    this.searchData.subjectId = this.$route.query.subjectId;
    this.searchData.gradeId = this.$route.query.gradeId;
    console.log(this.searchData);
    this.getList();
  },
  methods: {
    getList() {
      getSchoolThreeClass(this.searchData).then(res => {
        this.classData = res;
        getSchoolThreeData(this.searchData).then(ress => {
          this.list = ress;
        });
      });
    }
  },
  mounted() {}
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.table-div {
  overflow-x: scroll;
}

</style>