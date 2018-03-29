<template>
    <div class="dashborad">
        <!-- <School v-if="schoolBl"></School>
        <Manager v-if="manageBl"></Manager>  --> 
        <component v-bind:is="currentView"></component>
    </div>
</template>
<script>
  import School from 'views/dashboard/default/school'
  import Manager from 'views/dashboard/default/manage'
  export default {
    name: 'dashboard-default',
    components: {
      Manager,School
    },
    data() {
      return {
        currentView:'',
        schoolBl:false,
        manageBl:false
      } 
    },
    created() {
      this.orgType = this.$store.state.user.userInfo.orgType;  
      if(this.orgType == '225'){
        //this.schoolBl = true;
        this.currentView = 'School';
      } else{
        this.currentView = 'Manager';
        //this.manageBl = true;
      }
     
    }
  }
</script>
<style  rel="stylesheet/less" lang="less" scoped>
@base-bg: #00a0e9;
@hoverColor: #00a0e9;
</style>