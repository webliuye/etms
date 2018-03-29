<template>
  <master-page title="编辑实验计划目录预览">
    <form-value :formData="content" :isLocal="isLocal"></form-value>
  </master-page>
</template>

<script>
  import MasterPage from '../layout/MasterPage';
  import formValue from './../components/formValue';
  export default {
    components: { MasterPage, formValue },
    data() {
      return {
        isLocal:true,
        content:{}
      }
    },
    created() {        
      this.content = this.$store.state.commonData.editPreviewData;     
    }   
  }
</script>
