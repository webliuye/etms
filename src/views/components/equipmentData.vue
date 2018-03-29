<template>
  <div style="width:100%" class="equipment">
    <table v-if="systemBlean" cellpadding="0" cellspacing="0" class="table-in equipment-zb">
      <thead>
        <tr>
          <td style="width:80px;">品目代码</td>
          <td style="width:15%;">器材名称</td>
<!--           <td>资产属性</td> -->
          <td>规格</td>
          <td style="width:8%;">单位</td>
          <td style="width:8%;">可用数</td>
          <td style="width:12%;">单组个数</td>
          <td v-if="isLog" style="width:12%;">损坏数</td>
          <td v-if="!isLogBooking" style="width:8%;">操作</td>
        </tr>
      </thead>
      <tbody v-for="(item,index) in equipmentList"  :key="index" v-if="item.logsListList">
        <tr>
          <td :rowspan="item.logsListList.length">{{item.itemsCode}}</td>
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
              <el-input type="number" :min="0" :max="item.logsListList[0].availQuantity" :maxlength="5" v-model="item.logsListList[0].take" @change="changeTake(item.logsListList[0])"></el-input>
            </el-form-item>
          </td>
          <td v-if="isLog" style="width:180px;">
            <el-form-item>
              <el-input type="number" :controls="false" size="small" :min="0" v-model="item.logsListList[0].loss" @change="changeLoss(item.logsListList[0])"></el-input>
            </el-form-item>
          </td>
          <td v-if="!isLogBooking">
            <i v-if="item.specArray.length>1" class="el-icon-plus el-button" @click="addRows(item)"></i>
          </td>
        </tr>
        <tr v-for="(specItem,index) in item.logsListList" v-if="index != 0" :key="index">
          <td>
            <el-select v-model="specItem.spec" placeholder="请选择" @change="getAuantity(item,specItem,index)">
              <el-option v-for="items in item.specArray" :key="items.value" :label="items.spec" :value="items.spec"></el-option>
            </el-select>
          </td>
          <td>{{specItem.uom}}</td>
          <td>{{specItem.availQuantity}}</td>
          <td>
            <span v-if="isLogBooking">{{specItem.take}}</span>
            <el-form-item v-if="!isLogBooking">
              <el-input type="number" :min="0" :max="specItem.availQuantity" @change="changeTake(specItem)" :maxlength="5" v-model="specItem.take" required></el-input>
            </el-form-item>
          </td>
          <td v-if="isLog" style="width:180px;">
            <el-form-item>
              <el-input type="number" :controls="false" size="small" :min="0" @change="changeLoss(specItem)" v-model="specItem.loss"></el-input>
            </el-form-item>
          </td>
          <td  v-if="!isLogBooking">
            <i class="el-icon-minus el-button" @click="deleteRows(item,index)"></i>
          </td>
        </tr>
      </tbody>
      <tbody  v-for="(item,index) in equipmentList" v-if="!item.logsListList" :key="index">
        <tr>
          <td>{{item.itemsCode}}</td>
          <td>{{item.itemsName}}</td>
          <td>无</td>
          <td>{{item.unit}}</td>
          <td>0</td>
          <td>0
            <!-- <span v-if="isLogBooking">{{item.take}}</span>
            <el-form-item  v-if="!isLogBooking">
              <el-input-number :min="0" :max="100000" :maxlength="6" v-model="item.take"></el-input-number>
            </el-form-item> -->
          </td>
          <td v-if="isLog" style="width:180px;">0
            <!-- <el-form-item>
              <el-input-number :controls="false" size="small" :min="0" :max="item.take" v-model="item.loss"></el-input-number>
            </el-form-item> -->
          </td>
          <td v-if="!isLogBooking"></td>
        </tr>
      </tbody>
    </table>
    <el-table v-if="!systemBlean" :data="equipmentList" border fit highlight-current-row style="width: 100%" class="all-equipment">
      <el-table-column label="品目代码" align="center" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.itemsCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemsName" label="器材名称" min-width="200" align="center" show-overflow-tooltip></el-table-column>
<!--       <el-table-column prop="typeValue" label="资产属性" align="center"></el-table-column> -->
      <el-table-column prop="unit" label="单位" min-width="80" align="center"></el-table-column>
      <el-table-column label="每组数量" align="center" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="isLogBooking">{{scope.row.take}}</span>
          <el-form-item v-if="!isLogBooking" style="height:40px;">
            <el-input type="number" :min="0" :maxlength="5" placeholder="" v-model.number="scope.row.take" required @change="changeTake(scope.row)"></el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column v-if="isLog" label="损坏数" align="center" min-width="90">
        <template slot-scope="scope">
          <el-form-item>
            <el-input type="number" :controls="false" size="small" :min="0" @change="changeLoss(scope.row)" v-model.number="scope.row.loss"></el-input>
          </el-form-item>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getEquipSys } from "api/equipment";
import { mapGetters } from "vuex";
export default {
  name: "equipmentData",
  props: {
    equipmentData: {
      type: Array,
      default: []
    },
    isLog: {
      type: Boolean,
      default: false
    },
    isLogBooking: {
      type: Boolean,
      default: false
    },
    groupNumber: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      equipmentList: []
    };
  },
  computed: {
    ...mapGetters(["systemBlean"])
  },
  created() {
    this.$store.dispatch("GetEquipSys");
  },
  watch: {
    equipmentData() {
      this.equipmentList = this.equipmentData;
      var res = this.equipmentList;
      if (res[0]) {
        this.equipmentList.forEach(function(item) {
          item.specArray = [];
          if (item.logsListList) {
            item.logsListList.forEach(function(items, index) {
              items.loss = items.loss ? items.loss : 0;
              if (!items.spec) {
                items.spec = items.name;
              }
              item.specArray.push({
                spec: items.spec,
                availQuantity: items.availQuantity,
                value: index,
                code: items.code,
                uom: items.uom,
                name: items.name,
                unit: items.uom
              });
            });
            var t = false;
            item.logsListList.filter(function(items, index) {
              if (items.take && items.take != "0") {
                t = true;
              }
            });
            if (t) {
              item.logsListList = item.logsListList.filter(function(
                items,
                index
              ) {
                return items.take && items.take != "0";
              });
            } else {
              item.logsListList = item.logsListList.filter(function(
                items,
                index
              ) {
                if (items.take === null) {
                  items.take = 1;
                }
                return index == 0;
              });
            }
          } else {
            item.loss = item.loss ? item.loss : 0;
             if (item.loss === null) {
              item.take = 1;
            }
            item.take = item.take ? item.take : 1;
            if (item.take === null) {
              item.take = 1;
            }
          }
        });
      }
    },
    equipmentList: {
      handler: function(val) {
        this.$emit("changeEquipment", val);
      },
      deep: true
    }
    // groupNumber() {
    //   var vm = this;
    //   this.equipmentList.forEach(function(item){
    //     if(item.logsListList){
    //       item.logsListList.forEach(function(items){
    //         if(items.take && (items.take*vm.groupNumber>items.availQuantity)){
    //           items.take = 0;
    //         }
    //       });
    //     }
    //   });
    // }
  },
  methods: {
    addRows(item) {
      if (item.logsListList.length >= item.specArray.length) {
        this.$message({
          message: "添加的行数不得超过规格数",
          type: "error"
        });
        return;
      } else {
        item.logsListList.push({
          spec: "",
          take: 1,
          availQuantity: 0,
          uom: "",
          code: "",
          name: "",
          unit: ""
        });
      }
    },
    deleteRows(item, index) {
      item.logsListList.splice(index, 1);
    },
    changeTake(item) {
      if(item.take){
        item.take = Number(item.take);
      }
      function isNumber(obj) {
        return typeof obj === "number" && !isNaN(obj);
      }
      if (item.take >= 0 && isNumber(item.take)) {
        if (item.availQuantity) {
          if (item.take * this.groupNumber > item.availQuantity) {
            item.take = 1;
            this.$message({
              message: "实拿数与分组数相乘不能大于库存数",
              type: "error"
            });
          }
        } else {
          if (item.take < 0) {
            this.$message({
              message: "实拿数不能小于0",
              type: "error"
            });
            item.take = 1;
          }
          if (item.take > 99999) {
            this.$message({
              message: "实拿数不能大于99999",
              type: "error"
            });
            item.take = 1;
          }
        }
      } else {
        item.take = 1;
        this.$message({
          message: "请输入正确的数值",
          type: "error"
        });

      }
    },
    changeLoss(item) {
      if(item.loss) {
        item.loss = Number(item.loss);
      }
      function isNumber(obj) {
        return typeof obj === "number" && !isNaN(obj);
      }

      if (item.loss >= 0 && isNumber(item.loss)) {
        if (item.loss > item.take * this.groupNumber) {
          this.$message({
            message: "损坏数不能大于实拿数",
            type: "error"
          });
          item.loss = 0;
        }
      } else {
        item.loss = 0;
        this.$message({
          message: "请输入正确的数值",
          type: "error"
        });

      }
    },
    getAuantity(item, specItem, index) {
      var count = item.logsListList.filter(function(itemss) {
        return itemss.spec == specItem.spec;
      });
      if (count.length > 1) {
        this.$message({
          message: "添加的规格已经存在",
          type: "error"
        });
        specItem.spec = "";
        specItem.uom = "";
        specItem.availQuantity = 0;
      } else {
        const vm = this;
        item.specArray.forEach(function(items) {
          if (items.spec == item.logsListList[index].spec) {
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
    this.equipmentList = this.equipmentData;
  }
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.table-in {
  border: none;
  box-sizing: border-box;
  width: 100%;
  line-height: 36px;
  font-size: 12px;
  text-align: center;
  width: 100%;
  overflow: hidden;
  thead {
    background-color: #fff;
  }
  td {
    border: 1px solid #333;
    text-align: center;
    padding: 2px 8px;
  }
}
.error {
  border: 1px solid #f00;
}
.error:focus {
  outline: none;
}
td .el-form-item__content {
  line-height: 0;
}
.equipment-zb tr td:first-child {
  border-left: none;
}
.equipment-zb tr:first-child td {
  border-top: none;
}
.equipment-zb tr td:last-child {
  border-right: none;
}
.equipment-zb tbody:last-child td {
  border-bottom: none;
}
.el-form-item {
  margin-bottom: 0;
}
.el-form-item__content {
  height: 40px;
  line-height: 40px;
}
.all-equipment .el-table__header th.gutter {
  border: none;
  width: 0;
}
</style>
