<template>
          <el-select v-model="year" @change="getYear" placeholder="请选择">
            <el-option
              v-for="(item,index)  in years"
              :key="index"
              :label="item.year"
              :value="item.year">
            </el-option>
          </el-select>
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {
        name: 'myyearSelect',
         data() {
            return {
              year:''
            }
        },
        computed: {
          ...mapGetters([
            'years',
            'nowYear'
          ])
        },
        watch: {
          nowYear: function() {
           this.year = this.nowYear;
          }
        },
        created() {
          this.$store.dispatch('GetYear');
          this.$store.dispatch('GetNowYear');
        },
        methods: {
          getYear() {
            this.$emit('changeYear', this.year);
          }
        },
        mounted() {
          if(this.$store.state.commonData.nowYear != ''){
            this.year = this.$store.state.commonData.nowYear;
          }
        }
    }
</script>
