<template>
  <master-page title="实验日志目录预览">
    <form-value :formData="content" :isLocal="isLocal"></form-value>
    <div class="text-center"><el-button type="primary" @click= "finish">完成</el-button></div>
  </master-page>
</template>

<script>
  import MasterPage from '../../layout/MasterPage';
  import { getPlanPreview } from 'api/plan';
  import formValue from './../../components/formValue';
  export default {
    components: { MasterPage, formValue },
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
  		},
      finish(){
        this.$router.go(-1);
      }
  	}   
  }
</script>
