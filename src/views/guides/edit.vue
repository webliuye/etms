<template>
  <master-page>
    <CommonEdit></CommonEdit>
  </master-page>
</template>

<script>
    import MasterPage from '../layout/MasterPage';
    import CommonEdit from './commonEdit';
    export default {
        components: {
          MasterPage,
          CommonEdit
        },
        data() {
          return {
          }
        },   
        created() { 
        },  
        methods: {
        }
    }
</script>
<style type="text/less">
</style>
