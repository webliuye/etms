<template>
          <el-select v-model="type" @change="getTypeValue" placeholder="请选择">
            <el-option value='' label="资产属性"></el-option>
            <el-option
              v-for="(item,index)  in typeValue"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {
        name: 'typeValueSelect',
         data() {
            return {
              type:''
            }
        },
        computed: {
          ...mapGetters([
            'typeValue'
          ])
        },
        created() {
          this.$store.dispatch('GettypeValue');
        },       
        methods: {    
          getTypeValue() {
            this.$emit('changeTypeValue', this.type);
          }
        },
        mounted() {
        }  
    }
</script>
