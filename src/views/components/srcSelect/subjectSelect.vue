<template>
<el-col :lg="24" :md="24" :sm="24" :xs="24" class='right'>
          <el-select v-model="subject" @change="getSubject" clearable placeholder="全部科目">
            <el-option
              v-for="(item,index)  in subjectData"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          </el-col>
</template>

<script>
    import {getSubjects} from 'api/sourceIndex';
    export default {
        name: 'subjectSelect',
         data() {
            return {
              subject:'' ,
              subjectData:null 
            }
        },
      
        created() {
         getSubjects().then(res=>{
           this.subjectData=res;
         })
        },       
        methods: {    
          getSubject() {
            this.$emit('changeSubject', this.subject);
          }
        },
        mounted() {
        }  
    }
</script>
