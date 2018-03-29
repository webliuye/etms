<template>  
  <master-page title="实验计划">
    <div class="filter-container">
      <ManagePlan v-if="manageBoolean"></ManagePlan>
      <TeacherPlan v-if="techerBoolean"></TeacherPlan>
    </div>
  </master-page>
</template>

<script>
  import MasterPage from '../layout/MasterPage';
  import ManagePlan from 'views/plan/managePlan'
  import TeacherPlan from 'views/plan/teacherPlan'
  export default {
    components: {
      MasterPage,ManagePlan,TeacherPlan
    },
    data() {
      return {
        techerBoolean:false,  //老师入口
        manageBoolean:false, //非老师入口
        roleCode:this.$store.state.user.userInfo.roleCode
      }
    },
    created() {
      if(this.roleCode == '304'){
        this.techerBoolean = true;
      }else{
        this.manageBoolean = true;
      }
    },
    methods: {
    }
  }
</script>
<style type="text/css" scoped>
  .search-select { padding-bottom: 8px; }
</style>

