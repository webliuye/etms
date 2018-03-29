<template>
          <el-select v-model="myClass" clearable @change="getClass" placeholder="请选择">
            <el-option
              v-for="(item,index)  in mineClass"
              :key="index"
              :label="item.className"
              :value="item.classId">
            </el-option>
          </el-select>
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {
        name: 'myclassSelect',
         data() {
            return {
              myClass:''
            }
        },
        computed: {
          ...mapGetters([
            'mineClass'
          ])
        },
        created() {
          this.$store.dispatch('GetMineClass');
        },
        methods: {
          getClass() {
            this.$emit('changeClass', this.myClass);
          }
        }
    }
</script>
