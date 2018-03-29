<template>  
  <master-page title="公告详情">
    <notice-detail></notice-detail>

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

