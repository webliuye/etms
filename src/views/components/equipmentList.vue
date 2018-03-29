<template>
  <div class="app-container equipmentList">
      <div class="search-select">
        <div class="fl">
          请单击要选择的行
        </div>
        <div class="fr">
          <el-button icon="el-icon-search" @click="findEquipItem"></el-button>
        </div>
        <div class="fr selectwidth">
          <el-input placeholder="仪器名称" v-model="equipSearch.name"></el-input>
        </div>
        <div class="fr selectwidth">
          <TypeValueSelect @changeTypeValue="changeTypeValue"></TypeValueSelect>
        </div>
      </div>
      <el-table :data="equipmentData" highlight-current-row  @current-change="clickCurrentChange" border fit style="width: 100%">
        <el-table-column prop="name" label="仪器药品名称" align="center"></el-table-column>
        <el-table-column prop="itemsCode" label="仪器药品名称" align="center"></el-table-column>
      </el-table>
      <div v-show="listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="equipSearch.page" :page-sizes="pages.sizes"
          :page-size="equipSearch.size" layout="total, sizes, prev, pager, next, jumper" :total="pages.total">
        </el-pagination>
      </div>
  </div>
</template>
<script>
    import { getEquipItem } from 'api/equipment';
    import TypeValueSelect from 'views/components/select/typeValueSelect';
    import {scrollTable} from 'utils/index'
    export default {
      name: 'equipmentList',
      components: { TypeValueSelect},
      data() {
        return {
          listLoading: true,
          equipmentData:null,
          equipSearch:{
            page: 1,
            size: 50,
            name:null,
            type:null
          },
          pages:{
            total:1,
            sizes:[10,20,30, 50]
          }
        };
      },
      methods: {
        getEquipData() {
          getEquipItem(this.equipSearch).then(res => {
            this.equipmentData = res.data;
            this.pages.total = res.total;
          });
        },
        changeTypeValue(type) {
          this.equipSearch.type = type;
        },
        handleSizeChange(val) { // 显示多少页
          this.equipSearch.size = val;
          this.getEquipData();
        },
        handleCurrentChange(val) {  // 点击页数
          this.equipSearch.page = val;
          this.getEquipData();
        },
        clickCurrentChange(val) {
          if(val){
            this.$emit('choiceEquipment', val);
          }
        },
        findEquipItem(){
          this.getEquipData();
        }
      } ,
      mounted() {
        this.getEquipData();
        scrollTable('.equipmentList')
      }
    }
</script>
<style rel="stylesheet/less" lang="less">

</style>
