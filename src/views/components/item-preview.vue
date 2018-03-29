<template>   
  <section class="item-preview" style="min-height: 100%">
    <el-row :gutter="20">
      <el-col :span="12" :offset="6"  class="detail-content">
        <el-row justify="center">
          <el-col :span="24" class="marginT40 formContent">
              <label>实验名称：</label>
              <span>{{detail.name}}</span>
          </el-col>
          <el-col :span="12" class="marginT40 formContent">
              <label>教程版本：</label>
              <span>{{detail.teachingMaterialLabel}}</span>
          </el-col>
          <el-col :span="12" class="marginT40 formContent">
              <label>科目：</label>
              <span>{{detail.subjectLabel}}</span>
          </el-col>
          <el-col :span="12" class="marginT40 formContent">
              <label>年级：</label>
              <span>{{detail.gradeLabel}}</span>
          </el-col>
          <el-col :span="12" class="marginT40 formContent">
              <label>学期：</label>
              <span>{{detail.termLabel}}</span>
          </el-col>
          <el-col :span="12" class="marginT40 formContent">
              <label>实验类型：</label>
              <span>{{detail.typeLabel}}</span>
          </el-col>
          <el-col :span="12" class="marginT40 formContent">
              <label>是否必做：</label>
              <span>{{detail.isMust | statusFilter}}</span>
          </el-col>
          <el-col :span="12" class="marginT40 formContent">
              <label>开课方式：</label>
              <span>{{detail.modeLabel}}</span>
          </el-col>
          <el-col :span="12" class="marginT40 formContent">
              <label>所在章节：</label>
              <span>{{detail.chapter}}</span>
          </el-col>
          <el-col :span="24" class="marginT40 formContent">
              <label>实验仪器与用料：</label>
              <span>{{detail.equipment}}</span>
          </el-col>
          <el-col :span="12" class="marginT40 formContent">
              <label>实验内容：</label>
              <div class="formSpan" v-html="detail.content"></div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </section>
</template>       

<script>  
  export default {
      name: 'ItemPreview',
      props: ['detail'],
      filters: {
        statusFilter(status) {
          const statusMap = {
              0: '否',
              1: '是'
          };
          return statusMap[status]
        }
      },
  }
</script>
<style>
  .marginT40{
    margin-top: 40px;
  }
  .formContent label{
    color:#777;
    font-size: 14px;
    font-weight: normal;
  }
  .formContent span{
    color:#222;
    font-size: 14px;
  }
  .formContent .formSpan{
    display: inline-block;
    font-size: 14px;
    line-height: 26px;
  }
  .detail-content{
      
  }
</style>