<template>
          <el-select v-model="searchData.city" clearable @change="getArea" placeholder="请选择市">
            <el-option
              v-for="(item,index) in dataAll.cityData"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
</template>
<script>
    export default {
        name: 'citySelect',
        props: {
          dataAll: {
            type: Object,
            default:[]
          },
          searchData: {
            type: Object,
            default: {
              city:''
            }
          }
        },
         data() {
            return {
            }
        },
        methods: {
          getArea() {
            this.searchData.county = '';
            this.searchData.schoolUnitsArray = [];
            var that = this;
            this.dataAll.area = this.dataAll.data.filter(function(item){
              return item.type == '223' && item.parentId == that.searchData.city;
            });
            this.dataAll.school = this.dataAll.data.filter(function(item){
              return item.type == '4' && item.parentId == that.searchData.city;
            });
          }
        }
    }
</script>
<style type="text/less">
  .right { float: right; display: inline;}
</style>
