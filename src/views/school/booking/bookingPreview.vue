<template>
  <master-page title="实验预览">
    <form-value :formData="content" :isLocal="isLocal"></form-value>
  </master-page>
</template>

<script>
  import MasterPage from '../../layout/MasterPage';
  import formValue from './../../components/formValue';
  import { getDetails } from 'api/booking';
  export default {
    components: { MasterPage, formValue },
    data() {
      return {
        isLocal:false,
        content:{},
        id:this.$route.params.id
      }
    },
    created() { 
      getDetails(this.id).then(res => {
        console.log(res);
        this.content = res;
        this.content.equipment = this.content.catalogueItemsList.map(function(item){
          return item.name;
        }).filter(function(item){
          return item;
        }).join("、");
      });           
    }   
  }
</script>
