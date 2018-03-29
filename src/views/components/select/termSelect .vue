<template>
          <el-select v-model="term" @change="getTerm" placeholder="请选择">
            <el-option value='' label="全部学期"></el-option>
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
        }  
    }
</script>
