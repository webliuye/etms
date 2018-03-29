<template>  
  <master-page title="公告详情">
    <div class="filter-container">
      <el-button class="pull-right main-return" type="text" @click="$router.go(-1)">返回</el-button> 
    </div>
    <notice-detail  ></notice-detail>

  </master-page>
</template>

<script>
  import MasterPage from '../layout/MasterPage';
  import noticeDetail from './detail';
  export default {
    components: {
      MasterPage,
      noticeDetail
    }
  }
</script>

