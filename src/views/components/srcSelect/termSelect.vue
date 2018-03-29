<template>
          <el-select v-model="term" @change="changeTerms" clearable placeholder="选择学期">
            <el-option
              v-for="(item,index)  in termData"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
</template>

<script>
    import { getTerm } from 'api/sourceIndex';
    export default {
        name: 'termSelect',
         props: {
          termId:{
             type: String,
            default:''
          }
        },
         data() {
            return {
              term:'',
              termData:null
            }
        },
        created() {
          getTerm().then(res=>{
            this.termData=res;
          })
        },       
        methods: {    
          changeTerms() {
            this.$emit('changeTerm', this.term);
          }
        },
        mounted() {
          if(this.termId){
            this.term=this.termId;
          }
        }  
    }
</script>
