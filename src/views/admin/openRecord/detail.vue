<template>
  <master-page title="实验详情">
    <div class="afour">
      <div class="logpic"><img  src="../../../assets/img/logpic.png" ></img></div>
      <h2 >实验日志详情</h2>
      <div class="formBox">
        <el-form :model="formData" ref="formData"  >
          <el-row >
            <el-col :span="4" style="border-right:transparent;border-bottom:transparent;">
              <div class="grid-content grid-head">实验名称</div>
            </el-col>
            <el-col :span="12" style="border-right:transparent;border-bottom:transparent;">
              <div class="grid-content">{{formData.courseFormVo.name}}</div>
            </el-col>
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;">
              <div class="grid-content grid-head">实验类型</div>
            </el-col>
            <el-col :span="4"  style="border-bottom:transparent;">
              <div class="grid-content">{{formData.courseFormVo.typeName}}</div>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;">
              <div class="grid-content grid-head">上课时间</div>
            </el-col>
            <el-col :span="12"  style="border-right:transparent;border-bottom:transparent;">
               <div class="grid-content">{{formData.courseFormVo.classDate | dateStringTen}}</div>
            </el-col>
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;">
              <div class="grid-content grid-head">上课节次</div>
            </el-col>
            <el-col :span="4"  style="border-bottom:transparent;">
              <div class="grid-content">
                 <template >
                    第{{formData.courseFormVo.classTime}}节课
                </template>
              </div>
            </el-col>
          </el-row>
           <el-row >
            <el-col :span="4" style="border-right:transparent;border-bottom:transparent;">
              <div class="grid-content grid-head">上课班级</div>
            </el-col>
            <el-col :span="8" style="border-bottom:transparent; height:40px; overflow:hidden;">
              <div class="grid-content" width="100%">
                {{formData.classname}}
              </div>
            </el-col>
            <el-col :span="4"  style="border-left:transparent;border-right:transparent;border-bottom:transparent;">
              <div class="grid-content grid-head">上课地点</div>
            </el-col>
            <el-col :span="8"   style="border-bottom:transparent;">
              <div class="grid-content">
                <span>{{formData.courseFormVo.classRoomName}}</span>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;">
              <div class="grid-content grid-head">分组数</div>
            </el-col>
            <el-col :span="20"  style="border-bottom:transparent;">
              <div class="grid-content">{{formData.courseFormVo.groupNumber}}</div>
            </el-col>
          </el-row>
           <!-- <el-row >
             <el-col :span="24"  style="border-bottom:transparent;">
                <el-table :data="formData.equipmentLists" border fit highlight-current-row style="width: 100%" class="all-equipment">
						      <el-table-column prop="itemsCode" label="品目代码" align="center"></el-table-column>
						      <el-table-column prop="itemsName" label="仪器药品名称" align="center"></el-table-column>
						      <el-table-column v-if="systemBlean" prop="spec" label="规格" align="center"></el-table-column>
						      <el-table-column prop="unit" label="单位" align="center"></el-table-column>
						      <el-table-column prop="take" label="领用数量" align="center"></el-table-column>
						      <el-table-column prop="loss" label="损坏数" align="center"></el-table-column>
						    </el-table>
             </el-col>
          </el-row> -->
          <el-row>
             <el-col :span="24"  style="border-bottom:transparent;">
                <el-table v-if="!systemBlean" :data="formData.equipmentLists" border fit highlight-current-row style="width: 100%" class="all-equipment">
                  <el-table-column prop="itemsCode" label="品目代码" align="center"></el-table-column>
                  <el-table-column prop="itemsName" label="仪器药品名称" align="center"></el-table-column>
                  <el-table-column v-if="systemBlean" prop="spec" label="规格" align="center"></el-table-column>
                  <el-table-column prop="unit" label="单位" align="center"></el-table-column>
                  <el-table-column prop="take" label="单组数量" align="center"></el-table-column>
                  <el-table-column prop="loss" label="损坏数" align="center"></el-table-column>
                </el-table>
                <table v-if="systemBlean" :data="formData.equipmentLists" cellpadding="0" cellspacing="0" class="el-table table-in equipment-zb" style="width:100%;">
                  <thead>
                    <tr>
                      <td style="width:20%;">品目代码</td>
                      <td style="width:30%;">器材名称</td>
                      <td style="width:10%;">规格</td>
                      <td style="width:10%;">单位</td>
                      <td style="width:10%;">可用数</td>
                      <td style="width:10%;">数量</td>
                      <td style="width:10%;">损坏数</td>
                    </tr>
                  </thead>
                  <tbody v-for="(item,index) in formData.equipmentLists" :key="index" v-if="item.logsListList && item.logsListList.length > 0">
                    <tr>
                      <td :rowspan="item.logsListList.length">{{item.itemsCode}}</td>
                      <td :rowspan="item.logsListList.length">{{item.itemsName}}</td>
                      <td>{{item.logsListList[0].spec}}</td>
                      <td>{{item.logsListList[0].uom}}</td>
                      <td>{{item.logsListList[0].availQuantity}}</td>
                      <td>{{item.logsListList[0].take}}</td>
                      <td>{{item.logsListList[0].loss}}</td>
                    </tr>
                    <tr v-for="(specItem,index) in item.logsListList" :key="index" v-if="index != 0">
                      <td>{{specItem.spec}}</td>
                      <td>{{specItem.uom}}</td>
                      <td>{{specItem.availQuantity}}</td>
                      <td>{{specItem.take}}</td>
                      <td>{{specItem.loss}}</td>
                    </tr>
                  </tbody>
                  <tbody  v-for="(item,index) in formData.equipmentLists" :key="index" v-if="!item.logsListList">
                    <tr>
                      <td>{{item.itemsCode}}</td>
                      <td>{{item.itemsName}}</td>
                      <td>无</td>
                      <td>{{item.unit}}</td>
                      <td>0</td>
                      <td>{{item.take}}</td>
                      <td>0</td>
                    </tr>
                  </tbody>
                </table>
             </el-col>
          </el-row>
          <el-row >
              <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;"> <div class="grid-content grid-head" style="line-height:80px;">实验材料</div></el-col>
              <el-col :span="20"  style="border-bottom:transparent;">
                 <div class="grid-content" style="height:80px;overflow:hidden;">
                    <span>{{formData.courseFormVo.material}}</span>
                 </div>
              </el-col>
          </el-row>
          <el-row >
            <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;">
              <div class="grid-content grid-head" >授课老师</div>
            </el-col>
            <el-col :span="8"  style=" border-right:transparent;border-bottom:transparent;">
              <div class="grid-content" >
                <span>{{formData.courseFormVo.applyName}}</span>
              </div>
            </el-col>
              <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;">
                <div class="grid-content grid-head" >实验员</div>
              </el-col>
            <el-col :span="8"  style=" border-bottom:transparent;">
               <div class="grid-content" >
                  <span>{{formData.courseFormVo.arangeName}}</span>
               </div>
            </el-col>
          </el-row>
          <el-row >
              <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;">
                <div class="grid-content grid-head" style="line-height:80px;">损坏说明</div>
              </el-col>
              <el-col :span="20" style="border-bottom:transparent;">
                 <div class="grid-content" style="height:80px;overflow:hidden;">
                    <span>{{formData.logFormVo.suggest}}</span>
                 </div>
              </el-col>
          </el-row>
          <el-row >
              <el-col :span="4"  style="border-right:transparent;border-bottom:transparent;">
                <div class="grid-content grid-head" style="line-height:80px;">完成情况</div>
              </el-col>
              <el-col :span="20" style="border-bottom:transparent;">
                 <div class="grid-content" style="height:80px;overflow:hidden;">
                    <span>{{formData.logFormVo.result}}</span>
                 </div>
              </el-col>
          </el-row>
          <el-row >
            <el-col :span="4"  style="border-right:transparent;">
              <div class="grid-content grid-head" style="line-height:160px;">上传照片</div>
            </el-col>
            <el-col :span="20">
              <div class="grid-content photo-div" style="height:160px;overflow:hidden;padding:0;">
              	<img v-for="(item,index) in formData.photoVo" :key="index" :src="item.fileurl" class="imgWidth" />
              </div>
            </el-col>
          </el-row>
          <div class="text-right" style="margin-top:32px;margin-bottom:32px;">
            <el-form-item>
              <el-button type="primary" @click="cancel()">返回</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    </div>
  </master-page>
</template>
<script>
import { getManageLogDetail } from "api/index";
import MasterPage from "../../layout/MasterPage";
import { mapGetters } from "vuex";
export default {
  components: {
    MasterPage
  },
  data() {
    return {
      formData: {
        courseFormVo: {
          name: ""
        },
        logFormVo: {},
        photoVo: [],
        classFormVos: [],
        classname: "",
        equipmentLists: []
      }
    };
  },
  computed: {
    ...mapGetters(["systemBlean"])
  },
  created() {
    if (this.$route.params.id === undefined) {
      this.$router.push({ path: "/openRecord" });
      return;
    }
    this.$store.dispatch("GetEquipSys");
    getManageLogDetail(this.$route.params.id).then(res => {
      this.formData = res;
      this.formData.classname = "";
      var vm = this;
      res.classFormVos.forEach(function(item) {
        vm.formData.classname += item.className + " ";
      });
      if (
        this.formData.equipmentLists &&
        this.formData.equipmentLists.length > 0
      ) {
        this.formData.equipmentLists.forEach(function(item) {
          if (item.logsListList && item.logsListList.length > 0) {
            item.logsListList = item.logsListList.filter(function(items) {
              return items.take > 0;
            });
          }
        });
      }
    });
  },
  methods: {
    cancel() {
      this.$router.go(-1);
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
.el-col-4 {
  width: 120px;
}
.el-col-3 {
  width: 90px;
}
.el-col-6 {
  width: 180px;
}
.el-col-12 {
  width: 360px;
}
.el-col-8 {
  width: 240px;
}
.el-col-24 {
  width: 720px;
}
.el-col-20 {
  width: 600px;
}
.afour {
  width: 842px;
  margin: 0 auto;
  border: 1px solid #ccc;
  -webkit-box-shadow: 1px 10px 10px 0 #999;
  -moz-box-shadow: 1px 10px 10px 0 #999;
  box-shadow: 1px 10px 10px 0 #999;
  font-family: SimSun;
  position: relative;
  .logpic {
    position: absolute;
    top: -15px;
    left: 32px;
  }
  h2 {
    font-size: 14px;
    padding: 42px 0;
    text-align: center;
  }

  .formBox {
    width: 720px;
    font-size: 12px;
    margin: 0 auto;
    padding-bottom: 32px;
    .el-row {
      .el-col {
        border: 1px solid #000;
        .grid-content {
          padding: 0 8px;
        }
        line-height: 40px;
        .el-date-editor.el-input {
          .el-input__inner {
            border: none !important;
          }
          width: 100%;
        }
        .el-select {
          width: 100%;
        }
      }
    }
  }
}
.manyClass label.el-checkbox {
  margin-left: 0;
  margin-right: 15px;
  font-weight: 500;
}
.center-input.el-input {
  line-height: 40px;
}
.imgWidth {
  display: inline-block;
  width: 160px;
  height: 160px;
  padding: 6px;
}
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
    padding: 8px;
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
</style>
