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
    import { mapGetters } from 'vuex';
    export default {
        name: 'typeSelect',
         props: {
          slcType:{
            type: String,
            default:''
          },
        },
         data() {
            return {
              type:''
            }
        },
       
        computed: {
          ...mapGetters([
            'typeData'
          ])
        }, 
        watch: {
           slcType() {
             this.type = this.slcType;
          }
        },
        created() {
          this.type = this.slcType;
          this.$store.dispatch('GetType');
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
