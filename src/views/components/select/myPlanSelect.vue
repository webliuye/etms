<template>
          <el-select v-model="plan" @change="getPlan" class="plan-sele" placeholder="请选择实验计划">
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
    import { getPlan } from 'api/index';
    export default {
        name: 'planSelect',
        props: {
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
        computed: {
          ...mapGetters([
            'myPlanSelect'
          ])
        },
        created() {
          this.$store.dispatch('GetClassTime');
          this.plan = this.planId;
        },
        watch: {
          planId() {
            this.plan = this.planId;
          }
        },
        methods: {
          getPlanList() {
            getPlansme().then(res => {
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
