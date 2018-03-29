<template>
          <el-select v-model="searchData.county" clearable placeholder="请选择县/区" @change='getSchool'>
            <el-option
              v-for="(item,index) in dataAll.area"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
</template>

<script>
    export default {
        name: 'countySelect',
        props: {
          dataAll: {
            type: Object,
            default:[]
          },
          searchData: {
            type: Object,
            default: {
              county:''
            }
          }
        },
         data() {
            return {
            }
        },
        methods: {
          getSchool() {
            var that = this;
            this.dataAll.schoolArea = this.dataAll.data.filter(function(item){
              return item.type == '224' && item.parentId == that.searchData.county;
            });
            this.dataAll.school = this.dataAll.data.filter(function(item){
              return item.type == '4' && item.parentId == that.searchData.county;
            });
          }
        }
    }
</script>
<style type="text/less">
  .right { float: right; display: inline;}
</style>
