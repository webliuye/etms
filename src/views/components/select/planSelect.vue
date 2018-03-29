<template>
          <el-select v-model="plan" @change="getPlan" placeholder="请选择实验计划">
            <el-option
              v-for="(item,index)  in planData"
              :key="index"
              :label="item.planName"
              :value="item.planId">
            </el-option>
          </el-select>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { getPlansme } from 'api/booking';
    export default {
        name: 'planSelect',
        props: {
          year: {
            type: String,
            default:''
          },
          planId:{
            type: String,
            default:''
          }
        },
         data() {
            return {
              plan:'',
              planData:[]
            }
        },
        created() {
          this.plan = this.planId;
        },
        watch: {
          year() {
            this.getPlanList();
          },
          planId() {
            this.plan = this.planId;
          }
        },
        methods: {
          getPlanList() {
            if(this.year == '' || this.year == ' '){
              return;
            }
            getPlansme(this.year).then(res => {
              this.planData = res;
              if(this.plan == '' && res[0]){
                this.plan = res[0].planId;
              }
            });
          },
          getPlan() {
            this.$emit('changePlan', this.plan);
          }
        },
        mounted() {
          this.getPlanList();
          this.plan = this.planId;
        }
    }
</script>
