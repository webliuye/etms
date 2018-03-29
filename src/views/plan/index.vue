<template>
<div class="plan-core">

<el-row>
  <el-col :span="24">
    <div class="plan-add bg-blue-light" @click='addPlan'>制定实验计划</div>
  </el-col>
</el-row>

</div>  
</template>

<script>
  export default {
    name: 'plan',
    data() {
      return {

      }
    },
    methods: {
      addPlan() {
        console.log('制定实验计划')
      }
    }
  }
</script>

<style lang="less">
  .plan-core {
    padding: 30px;
  }
</style>