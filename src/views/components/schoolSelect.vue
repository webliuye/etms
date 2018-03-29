<template>
          <el-select
            v-model="searchData.schoolUnitsArray"
            multiple
            clearable
            filterable
            placeholder="请选择单位">
            <el-option
              v-for="(item,index) in dataAll.school"
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
              schoolUnitsArray:[]
            }
          }
        },
         data() {
            return {
            }
        },
        methods: {
        }
    }
</script>
<style type="text/less">
  .right { float: right; display: inline;}
  .school div.el-select__tags { overflow: hidden; }
</style>
