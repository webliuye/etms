<template>
  <div class="addEqp">
    <table v-if="systemBlean"  cellpadding="0" cellspacing="0" class="table-in">
      <thead>
        <tr>
          <td>仪器药品名称</td>
<!--           <td>资产属性</td> -->
          <td>规格</td>
          <td>单位</td>
          <!-- <td>可用数</td> -->
          <td >数量</td>
          <td v-if="isLog" style="border:0;">损坏数</td>
          <td v-if="!isLogBooking">操作</td>
        </tr>
      </thead>
      <tbody v-for="(item,index) in equipmentList" :key="index">
        <tr>
          <td :rowspan="item.logsListList.length">{{item.itemsName}}</td>
<!--           <td :rowspan="item.logsListList.length">{{item.typeValue}}</td> -->
          <td>
            <el-select v-model="item.logsListList[0].spec" placeholder="请选择" @change="getAuantity(item,item.logsListList[0],0)">
              <el-option v-for="(items,index) in item.specArray" :key="index" :label="items.spec" :value="items.spec" ></el-option>
            </el-select>
          </td>
          <td>{{item.logsListList[0].uom}}</td>
          <td>{{item.logsListList[0].availQuantity}}</td>
          <td>
            <span v-if="isLogBooking">{{item.logsListList[0].take}}</span>
            <el-form-item  v-if="!isLogBooking">
              <el-input-number :min="0" :max="item.logsListList[0].availQuantity" :maxlength="5" v-model="item.logsListList[0].take"></el-input-number>
            </el-form-item>
          </td>
          <td v-if="isLog" >
            <el-form-item>
              <el-input-number :controls="false" size="small" :min="0" :max="item.logsListList[0].take" v-model="item.logsListList[0].loss"></el-input-number>
            </el-form-item>
          </td>
          <td  v-if="!isLogBooking">
            <i v-if="item.specArray.length>1" class="el-icon-plus el-button" @click="addRows(item)"></i>
          </td>
        </tr>
        <tr v-for="(specItem,index) in item.logsListList" :key="index" v-if="index != 0">
          <td>
            <el-select v-model="specItem.spec" placeholder="请选择" @change="getAuantity(item,specItem,index)">
              <el-option v-for="(items,index) in item.specArray" :key="index" :label="items.spec" :value="items.spec"></el-option>
            </el-select>
          </td>
          <td>{{specItem.uom}}</td>
          <td>{{specItem.availQuantity}}</td>
          <td>
            <span v-if="isLogBooking">{{specItem.take}}</span>
            <el-form-item v-if="!isLogBooking">
              <el-input-number :min="0" :max="specItem.availQuantity" :maxlength="5" v-model="specItem.take" required></el-input-number>
            </el-form-item>
          </td>
          <td v-if="isLog" >
            <el-form-item>
              <el-input-number :controls="false" size="small" :min="0" :max="specItem.take" v-model="specItem.loss"></el-input-number>
            </el-form-item>
          </td>
          <td  v-if="!isLogBooking">
            <i class="el-icon-minus el-button" @click="deleteRows(item,index)"></i>
          </td>
        </tr>
      </tbody>
    </table>
    <el-table v-if="!systemBlean" :data="equipmentList" border fit highlight-current-row>
      <el-table-column label="品目代码" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.itemsCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemsName" label="仪器药品名称" align="center"></el-table-column>
<!--       <el-table-column prop="typeValue" label="资产属性" align="center"></el-table-column> -->
      <el-table-column prop="unit" label="单位" align="center"></el-table-column>
      <el-table-column label="领用数量" align="center">
        <template slot-scope="scope">
          <span v-if="isLogBooking">{{scope.row.take}}</span>
          <el-form-item v-if="!isLogBooking">
            <el-input type="number" :min="1" :maxlength="5" v-model="scope.row.take" required></el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column v-if="isLog" label="损坏数" align="center" >
        <template slot-scope="scope">
          <el-form-item>
            <el-input-number :controls="false" size="small" :min="0" :max="scope.row.take" v-model="scope.row.loss"></el-input-number>
          </el-form-item>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
    import { getEquipSys } from 'api/equipment';
    import { mapGetters } from 'vuex';
    import{scrollTable} from 'utils/index'
    export default {
      name: 'addEquipmentData',
      props: {
        equipmentData:{
          type: Array,
          default:[]
        },
        isLog: {
          type: Boolean,
          default:false
        },
        isLogBooking: {
          type: Boolean,
          default:false
        }
      },
      data() {
        return {
          equipmentList:[]
        };
      },
      computed: {
        ...mapGetters([
          'systemBlean'
        ])
      },
      created() {
        this.$store.dispatch('GetEquipSys');
        // getEquipSys().then(res => {
        //   this.systemBlean = res;
        //   console.log(this.systemBlean);
        // });
      },
      watch:{
        equipmentData() {
          this.equipmentList = this.equipmentData;
          var res = this.equipmentList;
          console.log(res);
          if(res[0]){
            if(res[0].logsListList && res[0].logsListList.length>0){
              this.equipmentList.forEach(function(item){
                item.specArray = [];
                item.logsListList.forEach(function(items,index){
                  if(!items.spec){
                    items.spec = items.name;
                  }
                  item.specArray.push({
                    spec:items.spec,
                    availQuantity:items.availQuantity,
                    value:index,
                    code:items.code,
                    uom:items.uom,
                    name:items.name,
                    unit:items.uom
                  });
                });

                var t = false;
                item.logsListList.filter(function(items,index){
                  if(items.take && (items.take != '0')){
                    t = true;
                  }
                });
                if(t){
                  item.logsListList = item.logsListList.filter(function(items,index){
                    return (items.take && (items.take != '0'));
                  });
                }else{
                  item.logsListList = item.logsListList.filter(function(items,index){
                    return (index == 0);
                  });
                }
              });
            }
          }
        },
        equipmentList: {
          handler: function(val) {
            this.$emit('changeEquipment', val);
          },
          deep:true
        }
      },
      methods: {
        addRows(item){
          console.log(item);
          if(item.logsListList.length>=item.specArray.length){
            this.$message({
              message: '添加的行数不得超过规格数',
              type: 'error'
            });
            return;
          }else{
            item.logsListList.push({
              spec:'',
              take:0,
              availQuantity:0,
              uom:'',
              code:'',
              name:'',
              unit:''
            });
          }
        },
        deleteRows(item,index){
          item.logsListList.splice(index,1);
        },
        getAuantity(item,specItem,index) {
          console.log(item.specArray);
          var count = item.logsListList.filter(function(itemss){
            return itemss.spec == specItem.spec;
          });
          if(count.length>1){
            this.$message({
              message: '添加的规格已经存在',
              type: 'error'
            });
            specItem.spec = '';
            specItem.uom = '';
            specItem.availQuantity = 0;
          }else{
            const vm = this;
            item.specArray.forEach(function(items){
              if(items.spec == item.logsListList[index].spec){
                // vm.$set(item.logsListList[index], 'availQuantity', items.availQuantity);   //新增的属性不能响应式的在试图中显示，可以先定义
                item.logsListList[index].availQuantity = items.availQuantity;
                item.logsListList[index].uom = items.uom;
                item.logsListList[index].code = items.code;
                item.logsListList[index].name = items.name;
                item.logsListList[index].unit = items.uom;
              }
            });
          }
        }
      },
      mounted() {
        scrollTable('.addEqp');
        this.equipmentList = this.equipmentData;
      }
    }
</script>
<style rel="stylesheet/less" lang="less" scoped>
  .table-in {
    border: none;
    box-sizing: border-box;
    width: 100%;
    line-height: 36px;
    font-size: 14px;
    text-align: center;
    thead {
      background-color: #fff;
      line-height: 40px;
      td {
       text-align: center;
       padding: 0 8px;
       border-right:1px solid #000;
    }
    }
    tbody{
       td {
       text-align: center;
       padding: 0 8px;
       border:1px solid #000;

    }
    }

  }
  .error{ border:1px solid #f00; }
  .error:focus{ outline: none; }
  td .el-form-item__content {
    line-height: 0;
  }
  *{
    letter-spacing: 0;
  }
    .el-table th {
    background-color: #fff;
    text-align: left;
    font-weight: bold;
}
.el-table__header-wrapper thead div, .el-table__footer-wrapper thead div {
    background-color: #fff !important;
}
.el-table__body tr.hover-row > td {
    background-color: #fff;
}
.el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #fff;
}
.el-table__body tr.current-row > td {
    background-color: #fff;
}
</style>
