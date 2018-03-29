<template>
  <master-page title="实验记录">
    <div class="filter-container">
        <RecordTeacher v-if="teacher"></RecordTeacher>
        <RecordManage  v-if="!teacher"></RecordManage>
    </div> 
  </master-page>
</template>

<script>
import MasterPage from '../../layout/MasterPage';
import RecordTeacher from 'views/school/record/recordTeacher';
import RecordManage from 'views/school/record/recordManage';
export default {    
  components: {
      MasterPage,RecordTeacher,RecordManage
  },
  data() {
      return {  
        roleCode:this.$store.state.user.userInfo.roleCode,
        teacher:true          
      }

  },
  created() {
    if(this.roleCode==='304'){
      this.teacher=true;  
    } else{
       this.teacher=false ; 
    }
  },
  methods: {           
  }
}
</script>
