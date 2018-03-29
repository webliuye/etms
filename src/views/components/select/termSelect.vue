<template>
          <el-select v-model="term" @change="getTerm" clearable placeholder="选择学期">
            <el-option
              v-for="(item,index)  in termData"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
</template>

<script>
    import { mapGetters } from 'vuex';
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
              term:''
            }
        },
        computed: {
          ...mapGetters([
            'termData'
          ])
        },
        created() {
          this.$store.dispatch('GetTerm');
        },       
        methods: {    
          getTerm() {
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
