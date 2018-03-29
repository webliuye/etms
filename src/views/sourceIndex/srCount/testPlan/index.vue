<template>
	<master-page title="目录标准管理" >
    <div class="filter-container">
      <el-button class="pull-right main-returnA" type="text" @click="$router.go(-1)">返回</el-button> 
    </div>
		<div class="filter-container">
      <div class="table-div">
        <VersionTable :tableData="list" @goPreview="goPreview"></VersionTable>
      </div>
		</div>
     
</master-page>
</template>

<script>
    import store from 'store';
    import MasterPage from 'views/layout/MasterPage1';
    import VersionTable from 'views/components/guide/versionTable';
    import { getGuidesNode} from 'api/sourceIndex';
    export default {
        components: {
            MasterPage,
            VersionTable
        },
        data() {
          return {
            list:[]      
          }
        },
        created() {
          this.getList();
        },
        methods: {
          getList () {   
           getGuidesNode().then(res=>{
             res.forEach(e=>{
                  e.name=e.stageName+e.subjectName
             });          
             this.list=res;
           })
          },
          goPreview(row) {
            
          }
        }          
    }
</script>
<style type="text/css" scoped>
  .width90{
    width: 80%;
  }  
  .editIcon{
    display: inline-block;
    cursor: pointer;
    margin-left: 20px;
    width: 40px;   
  }
  .calendar-list-container{
    background: #fff;
    border:1px solid #e0e6ed;
  }
  .swaitch-span {
  	font-size: 12px;
  	line-height: 36px;
    color: #323437;
  }
  
</style>