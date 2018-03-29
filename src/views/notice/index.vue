<template>  
  <master-page title="公告管理">
    <notice-list :isAdmin="true"></notice-list>
  </master-page>
</template>

<script>
  import MasterPage from '../layout/MasterPage';
  import noticeList from './list';
  export default {
    components: {
      MasterPage,
      noticeList
    }
  }
</script>

