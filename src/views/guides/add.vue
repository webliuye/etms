<template>
  <master-page :title="formData.titleName">
    <!-- <el-button class="pull-right main-return" type="text" @click="$router.go(-1);">返回</el-button>  -->
    <el-form class="form-catalog" :model="formData" :rules="rules" ref="formData" label-width="150px">
      <el-row>
         <el-col :span="12">
          <el-form-item label="实验名称：" prop="name">
            <el-input v-if="cataTypeBoolean" v-model="formData.name"></el-input>
            <span v-if="!cataTypeBoolean">{{formData.name}}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24">
          <el-form-item label="实验类型：" prop="courseMode">
            <el-radio-group v-model="formData.type">
              <el-radio v-for="(item,index)  in courseData" :key="index" :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :xs="24">
          <el-form-item  label="是否必做：" prop="isMust">
            <el-radio-group v-model="formData.isMust">
              <el-radio :label='1'>是</el-radio>
              <el-radio :label='0'>否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :xs="24">
          <el-form-item label="实验仪器：" prop="equipmentArray">
            <el-table :data="formData.catalogueItemsList" border fit highlight-current-row style="width: 100%">
              <el-table-column label="品目代码" min-width="160" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.itemsCode}}</span>
                </template>
              </el-table-column>
              <el-table-column label="仪器药品名称" min-width="160" align="center">
                <template slot-scope="scope">
                  <el-select v-if="cataTypeBoolean" v-model="scope.row.itemsCode" placeholder="请输入" filterable remote :remote-method="remoteMethod"  @change="filterEquipment(scope.row)"  :loading="loading">
                    <el-option
                      v-for="(item,index) in equipmentData"
                      :key="index"
                      :label="item.name"
                      :value="item.itemsCode">
                    </el-option>
                  </el-select>
                  <span v-if="!cataTypeBoolean">{{scope.row.name}}</span>
                </template>
              </el-table-column>
              <el-table-column label="规格" min-width="100" align="center">
                <template slot-scope="scope">
                  <!-- <el-input v-if="cataTypeBoolean" v-model="scope.row.spec" placeholder=""></el-input> -->
                  <span v-if="!cataTypeBoolean">{{scope.row.spec}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="unit" label="单位" min-width="100" align="center">
              </el-table-column>
              <el-table-column label="数量" min-width="100" align="center">
                <template slot-scope="scope">
                  <el-input v-if="cataTypeBoolean" type="number" :min="1" v-model="scope.row.amount" placeholder="" @blur="changeNum(scope.row)"></el-input>
                  <span v-if="!cataTypeBoolean">{{scope.row.amount}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="unit" label="操作" min-width="80" align="center">
                <template slot-scope="scope">
                  <a href='javascript:;' class ="el-button--text" @click="deleteEquipRows(scope)">删除</a>
                </template>
              </el-table-column>
            </el-table>
            <a v-if="cataTypeBoolean" href='javascript:;' @click="addRows" class="el-button--text" style="margin-top:8px;"><i class="el-icon-plus"></i></a>
          </el-form-item>
        </el-col>
        <el-col :xs="24 ">
          <el-form-item label="实验材料：" prop="material">
            <el-input v-if="cataTypeBoolean" type="textarea" v-model="formData.material"></el-input>
            <span v-if="!cataTypeBoolean">{{formData.material}}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24">
          <el-form-item>
            <el-button v-if="!isEdit" type="primary" :loading="loading" @click="submitForm('save')">保存</el-button>
            <el-button v-if="!isEdit" type="primary" :loading="loading" @click="submitForm('next')">保存并新增</el-button>
            <el-button v-if="isEdit" type="primary" :loading="loading" @click="submitForm('finish')">完成</el-button>
            <el-button @click="cancel()">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </master-page>
</template>

<script>
  import MasterPage from '../layout/MasterPage';
  import store from 'store';
  import { mapGetters } from 'vuex'
  import { getGrade } from 'api/common';
  import { getEquipItem } from 'api/equipment';
  import { addGuidesItems, getGuidesItemsInfo, reviseMineGuidesItems, getGuidesItemsInfoDetal, getCatalogueDetail } from 'api/guides';
  export default {
    components: {MasterPage},
    data() {
      return {
        loading: false,
        formData:{
          name:null,
          type:'1',
          isMust:1,
          twothemeId:'',
          itemsFormList:{},
          id:null,
          catalogueItemsList:[{
            itemsCode:'',
            name:'',
            amount:'',
            spec:'',
            unit:''
          }]
        },
        equipSearch: {
          page: 1,
          size: 10,
          name: null
        },
        cataTypeBoolean:true,
        id:null,
        isEdit: false,
        equipmentData:null,
        equipmentList:null,
        gradeData:[],
        rules :{
          name: [
            {required: true, message: '请输入实验名称', trigger: 'blur'},
            {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      ...mapGetters([
        'courseData'
      ])
    },
    created () {
      this.formData.twothemeId = this.$route.params.twothemeId;
      this.$store.dispatch('GetCourse');
      this.id = this.$route.params.id;
      if (this.$route.params.isEdit && this.$route.params.isEdit !== 'false') {    //编辑时获取数据
        this.isEdit = true;
        var vm = this;
        this.formData.id = this.$route.params.guideId;
        getCatalogueDetail({id:this.formData.id}).then(res => {
          this.cataTypeBoolean = res.editable;
          vm.formData.termName = res.termName;
          vm.formData.oneThemeName = res.chapterName;
          vm.formData.twoThemeName = res.sectionName;
          vm.formData.gradeName = res.gradeName;
          vm.formData.name = res.name;
          vm.formData.isMust = res.isMust;
          vm.formData.type = res.type;
          vm.formData.material = res.material;
          if(res.itemsFormList){
            vm.formData.catalogueItemsList = res.itemsFormList;
            vm.formData.catalogueItemsList.forEach(function(item){
              if(item){
                item.itemsName = item.name;
              }else{
                item = {
                  itemsCode:'',
                  name:'',
                  amount:'',
                  spec:'',
                  unit:''
                }
              }
            });
          }else{
            vm.formData.catalogueItemsList = [];
          }
          this.equipmentData = this.formData.catalogueItemsList;
        });
      }
    },
    methods: {
      getGrade () {
        getGrade(this.formData.subject).then(res => {
          this.gradeData = res;
        });
      },
      deleteEquipRows(scope){   //实验器材删除一行
        this.formData.catalogueItemsList.splice(scope.$index,1);
      },
      cancel(){// 取消
        this.$router.go(-1);
      },
      remoteMethod(query) {   //动态加载仪器信息
        var t = /^\d+$/;
        if(t.test(query)){
          return;
        }
        var bLoading = false;
        if (query !== '') {
          this.formData.catalogueItemsList.forEach(function(s){
            if(s.name == query){
              bLoading = true;
            }
          });
          if(bLoading){
            this.equipmentData = this.formData.catalogueItemsList;
          }else{
            this.loading = true;
            setTimeout(() => {
              this.loading = false;
              this.equipSearch.name = query;
              getEquipItem(this.equipSearch).then(res => {
                this.equipmentData = res.data;
              });
            }, 100);
          }
        }else{
          this.equipmentData = [];
        }
      },
      changeNum(row){
        if(row.amount < 1){
          row.amount = 1;
        }
      },
      addRows() {
        this.formData.catalogueItemsList.push({itemsCode:'',name:''});
        this.equipmentData = null;//去除原有的数据
      },
      filterEquipment(row) {
        if(!row.name){  //增加
          var catalogueId = this.equipmentData.filter(function(item){
            return item.itemsCode == row.itemsCode;
          });
          row.name = catalogueId.length>0?catalogueId[0].name:'';
          row.unit = catalogueId.length>0?catalogueId[0].unit:'';
        }else{
          var catalogueId = this.equipmentData.filter(function(item){
            return item.itemsCode == row.itemsCode;
          });
          row.name = catalogueId.length>0?catalogueId[0].name:'';
          row.unit = catalogueId.length>0?catalogueId[0].unit:'';
        }
        this.equipmentData = this.formData.catalogueItemsList;
        //this.equipmentData = this.formData.catalogueItemsList;
        // var filterEquipment = this.formData.catalogueItemsList.filter(function(item){
        //   return item.itemsCode == row.itemsCode;
        // });
        // if(filterEquipment&&filterEquipment.length>1){
        //   this.$message({
        //     message: '添加的仪器药品名称已经存在',
        //     type: 'error'
        //   });
        //   row.itemsCode = '';
        // }else{
        //   if(!row.name){  //增加
        //     var catalogueId = this.equipmentData.filter(function(item){
        //       return item.itemsCode == row.itemsCode;
        //     });
        //     row.name = catalogueId.length>0?catalogueId[0].name:'';
        //     row.unit = catalogueId.length>0?catalogueId[0].unit:'';
        //   }else{
        //     var catalogueId = this.equipmentData.filter(function(item){
        //       return item.itemsCode == row.itemsCode;
        //     });
        //     row.name = catalogueId.length>0?catalogueId[0].name:'';
        //     row.unit = catalogueId.length>0?catalogueId[0].unit:'';
        //   }
        // }

      },
      submitForm (isState) {
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            this.loading = true;
            this.formData.equipment = this.formData.catalogueItemsList.map(function(item){
              return item.name;
            }).filter(function(item){
              return item;
            }).join("、");
            this.formData.itemsFormList = this.formData.catalogueItemsList.filter(function(item){
              return item.itemsCode != '';
            });
            if(this.formData.itemsFormList.length>0){
              this.formData.itemsFormList.forEach(function(item){
                item.itemsName = item.name;
              });
            }
            if ( isState === 'save' || isState === 'next' ){
              addGuidesItems(this.formData).then(res => {
                this.loading = false;
                this.$message({
                  message: '操作成功！',
                  type: 'success'
                });
                isState === 'save' ? this.$router.go(-1) : this.resetForm();
              }).catch(err => {
                this.loading = false;
                console.log(err);
              });
            }else{
              reviseMineGuidesItems(this.formData).then(response => {
                this.loading = false;
                this.$message({
                    message: '修改成功！',
                    type: 'success'
                });
                this.$router.go(-1);
              }).catch(err => {
                this.loading = false;
                console.log(err);
              });
            }
          }
        })
      },
      resetForm() {
        this.$refs['formData'].resetFields();
        //去除原有的数据
        this.formData={
          name:null,
          type:'1',
          isMust:1,
          material:null,
          catalogueItemsList:[{
            itemsCode:'',
            name:'',
            amount:'',
            spec:'',
            unit:''
          }]
        }
        this.formData.content = '';
        this.formData.twothemeId = this.$route.params.twothemeId;
      }
    },
    mounted() {
      getEquipItem(this.equipSearch).then(res => {
        this.equipmentList = res.data;
        // this.equipmentData = res.data;
      });
    }
  }
</script>
<style lang="less" scoped>
  .form-catalog{
    margin: 0 auto;
    width: 96%;
    max-width: 1100px;
    padding-top: 24px;
  }
  .equipment-table{
    width: 100%;
  }
  .equipment-table tr th{
    background-color: #f0f7f5;
  }
  .equipment-table tr td, .equipment-table tr th{
    border: 1px solid #e2e2e2;
    padding: 4px 8px;
  }
  .el-radio-group .el-radio {
    width: 72px;
  }
</style>
