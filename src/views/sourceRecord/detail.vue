<template>
  <master-page title="开通记录">
    <el-button class="pull-right main-return" type="text" @click="$router.go(-1);">返回</el-button>
    <div class="sourceRecordDetail">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="NAME" label="学段科目" min-width="180"></el-table-column>
        <el-table-column prop="TYPE" label="资源类别" min-width="180"></el-table-column>
      </el-table>
    </div>
  </master-page>
</template>

<script>
  import MasterPage from '../layout/MasterPage'
  import { getSrcRecordDetail } from "api/source";
  import {scrollTable} from "utils/index"
  export default {
    components: {
      MasterPage
    },
    data(){
      return{
         tableData:[]
      }
    },
    created() {
      var id=this.$route.params.id;
      getSrcRecordDetail(id).then(res=>{
        this.tableData=res;
      })

    },
    mounted(){
      scrollTable('.sourceRecordDetail')
    }
  }
</script>
