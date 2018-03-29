<template>
    <el-select v-model="type" @change="getType" clearable placeholder="实验类型">
      <el-option
        v-for="(item,index)  in typeData"
        :key="index"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
</template>

<script>
    import { getTestType } from 'api/sourceIndex';
    export default {
        name: 'typeSelect',
         data() {
            return {
              type:'',
              typeData:null
            }
        },
      
        created() {
          getTestType().then(res=>{
            this.typeData=res;
          })
        },       
        methods: {    
          getType() {
            this.$emit('changeType', this.type);
          }
        },
        mounted() {
        }  
    }
</script>
