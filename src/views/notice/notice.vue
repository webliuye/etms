<template>  
  <master-page title="公告列表">
    <notice-list ></notice-list>
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

