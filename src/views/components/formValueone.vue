<template>
  <div class="filter-container">
    <a href='javascript:;' class="pull-right main-return el-button--text" type="text" @click="$router.go(-1)">返回</a>
    <el-form class="well-view" :model="formData" ref="formData" label-width="150px">
      <el-row>
        <el-col :xs="24">
          <el-form-item label="实验名称：">
            <span v-text="formData.name"></span>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12">
          <el-form-item label="年级：">
            <span>{{formData.gradeLabel}}</span>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12">
          <el-form-item label="学期：">
              <span>{{formData.termLabel}}</span>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12">
          <el-form-item label="实验类型：">
             <span v-for="(item,index) in typeData" :key="index" v-if="item.value == formData.type">{{item.label}}</span>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12">
          <el-form-item label="是否必做：">
            <span >{{formData.isMust==1?'是':'否'}}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24">
         <el-form-item label="实验仪器：">
            <el-table :data="formData.catalogueItemsList" border fit highlight-current-row style="width: 100%">
              <el-table-column label="品目代码" prop="itemsCode" min-width="120" align="center">
              </el-table-column>
              <el-table-column label="仪器药品名称" prop="name" min-width="160">
              </el-table-column>
              <el-table-column v-if='systemBlean' label="规格" prop="spec" min-width="100" align="center"  >
              </el-table-column>
               <el-table-column label="单位" prop="unit" min-width="70" align="center" >
              </el-table-column>
              <el-table-column label="数量" prop="amount" min-width="70" align="center" >
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
        <el-col :xs="24">
          <el-form-item label="实验材料：">
            <span>{{formData.material}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  export default {
    props: ['formData','isLocal'],
    data () {
      return {
        formDatas: this.formData,
        list:[]
      }
    },
    computed: {
      ...mapGetters([
        'systemBlean', 'typeData'
      ])
    },
    created() {
       this.$store.dispatch('GetType');
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
            0: '否',
            1: '是'
        };
        return statusMap[status]
      },
      typeFilter(status) {
        const typeMap = {
          0: '分组实验',
          1: '演示实验'
        };
        return typeMap[status]
      },
      equipmentFilter(status){
       return status;
      }
    }
  }
</script>
<style>
  .turn-back{
    margin: -85px -20px 0 0 ;
  }
  .well-view {
    padding: 20px;
    border: 2px solid #ddd;
    border-radius: 5px;
    margin: 0 auto;
    max-width: 820px;
    width: 95%;
  }
  .well-view p{
    padding: 0;
    margin:0;
  }
  .ct-int img {
    max-width: 90%;
  }



</style>

