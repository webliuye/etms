<template>
          <el-select v-model="classTime1" @change="getClassTime" placeholder="请选择">
            <el-option
              v-for="(item,index)  in classTimeData"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {
        name: 'classTimeSelect',
        props: {
          classTime: {
            type: String,
            default:''
          },
        },
         data() {
            return {
              classTime1:''
            }
        },
        watch: {
          classTime() {
            this.classTime1 = this.classTime;
          }
        },
        computed: {
          ...mapGetters([
            'classTimeData'
          ])
        },
        created() {
          this.$store.dispatch('GetClassTime');
        },
        methods: {
          getClassTime() {
            this.$emit('changeClassTime', this.classTime1);
          }
        },
        mounted() {
          this.classTime1 = this.classTime;
        }
    }
</script>
