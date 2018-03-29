<template>
          <el-select v-model="year" @change="getYear" placeholder="请选择">
            <el-option
              v-for="(item,index)  in guideYears"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {
        name: 'yearSelect',
         data() {
            return {
              year:this.$store.state.commonData.nowYear
            };
        },
        computed: {
          ...mapGetters([
            'guideYears',
            'nowYear'
          ])
        },
        watch: {
          nowYear: function() {
           this.year = this.nowYear;
          }
        },
        created() {
          this.$store.dispatch('GetGuideYears');
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
