<template>
  <master-page title="实验安排目录预览">
    <form-value :formData="content" :isLocal="isLocal"></form-value>
  </master-page>
</template>

<script>
  import MasterPage from '../../layout/MasterPage';
  import { getPlanPreview } from 'api/plan';
  import formValue from './../../components/formValueone';
  export default {
    components: {MasterPage,formValue},
    data() {
      return {
        isLocal:false,
        content:{},
        listQuery:{
          id: this.$route.params.id
        }
      }
    },
    created() { 
  	  this.getDetail ();	 
  	},
  	methods: {
  		getDetail () {
  			getPlanPreview(this.$route.params.id).then(response => {
  	      this.content = response;
          this.content.equipment = this.content.catalogueItemsList.map(function(item){
            return item.name;
          }).filter(function(item){
            return item;
          }).join("、");
  	    });
  		}
  	}   
  }
</script>
