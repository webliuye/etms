<template>
  <div class="app-container formCatalog">
    <!-- <el-button class="pull-right turn-back" type="text" @click="$router.go(-1);">返回</el-button> -->
    <el-form class="form-catalog" :model="formData" :rules="rules" ref="formData" label-width="130px">
      <el-row>
        <el-col :xs="24 ">
          <el-form-item label="实验名称：" prop="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
        </el-col>
         <el-col :lg="24">
          <el-form-item label="实验类型：">
            <el-radio-group v-model="formData.type">
              <el-radio v-for="(item,index) in courseData" :key="index" :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :lg="24" >
          <el-form-item v-if="!formData.catalogueId" label="是否必做：">
            <el-radio-group v-model="formData.isMust">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="formData.catalogueId" label="是否必做：">
            <span>{{formData.isMust=='1' ? '是':'否'}}</span>
          </el-form-item>
        </el-col>
        <el-col :xs="24">
          <el-form-item label="实验仪器：" prop="equipmentArray">
             <el-table :data="formData.catalogueItemsList" fit highlight-current-row style="width: 100%">
              <el-table-column label="品目代码" min-width="160">
                <template slot-scope="scope">
                  <span>{{scope.row.itemsCode}}</span>
                </template>
              </el-table-column>
              <el-table-column label="仪器药品名称" min-width="200">
                <template slot-scope="scope">
                  <el-select  v-model="scope.row.itemsCode" placeholder="请输入" filterable remote :remote-method="remoteMethod"  @change="filterEquipment(scope.row)"  :loading="loading">
                    <el-option
                      v-for="(item,index) in equipmentData"
                      :key="index"
                      :label="item.name"
                      :value="item.itemsCode">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <!-- <el-table-column label="规格" min-width="100" align="center">
                <template slot-scope="scope">
                  <el-input  v-model="scope.row.spec" placeholder=""></el-input>
                </template>
              </el-table-column> -->
              <el-table-column prop="unit" label="单位" min-width="100">
              </el-table-column>
              <el-table-column prop="unit" label="操作" min-width="80" align="center">
                <template slot-scope="scope">
                  <a href='javascript:;' class ="el-button--text" @click="deleteEquipRows(scope)">删除</a>
                </template>
              </el-table-column>
              <!-- <el-table-column label="数量" min-width="100" align="center">
                <template slot-scope="scope">
                  <el-input type="number" :min="0" v-model="scope.row.amount" placeholder=""></el-input>
                </template>
              </el-table-column> -->
            </el-table>
            <!-- <el-button type="primary" size="small" @click="addRows" style="margin-top:8px;"><i class="el-icon-plus"></i><span>新增一行</span></el-button> -->
            <a href='javascript:;' @click="addRows" class="el-button--text" style="margin-top:8px;"><i class="el-icon-plus"></i></a>
          </el-form-item>
        </el-col>
        <el-col :xs="24 ">
          <el-form-item label="实验材料：" prop="material">
            <el-input type="textarea" v-model="formData.material"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24">
          <el-form-item>
            <el-button v-if="!isEdit" type="primary" @click="submitForm('save')">保存</el-button>
            <el-button v-if="!isEdit" type="primary" @click="submitForm('next')">保存并新增</el-button>
            <el-button v-if="isEdit" type="primary" @click="submitForm('finish')">完成</el-button>
            <el-button @click="cancel()">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>

</template>

<script>
  import { turnValueLabel } from '../../filters';
  import { getPlanInfo, getPlanPreview, addPlanDetails, updatePlanDetails } from 'api/plan';
  import { mapGetters } from 'vuex';
  import { getEquipItem } from 'api/equipment';
  import {scrollTable} from 'utils/index';
  export default {
    props: ['isEdit'],
    data() {
      return {
        loading: false,
        formData:{
          catalogueId:null,
          id:'',
          name: null,
          planId:'',
          teachingMaterial: null,
          subjectLabel: null,
          gradeLabel: null,
          termLabel: null,
          typeLabel: null,
          isMust: 1,
          type:'1',
          courseMode: '1',
          cataType:1,
          chapter: null,
          content: null,
          experimentTopic:null,
          material:null,
          catalogueItemsList:[{
            itemsCode:'',
            name:'',
            unit:''
          }]
        },
        equipSearch:{
          page: 1,
          size: 10,
          name:null
        },
        index:'',
        equipmentData:[],
        rules:{
          name: [
            {required: true, message: '请输入实验名称', trigger: 'blur'},
            {min: 3, max: 20, message: '长度在 3 到 50 个字符', trigger: 'blur'}
          ],
          experimentTopic: [
            {type:'string',required: true, message: '请选择章', trigger: 'blur'}
          ],
          chapter: [
            {required: true, message: '请选择节', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      ...mapGetters([
        'teachData',
        'courseData',
        'typeData'
      ])
    },
    created() {

    },
    mounted() {
      scrollTable('.formCatalog');
      this.id = this.$route.params.id;
      this.getInfo();

    },
    updated(){

    },
    methods: {

      getInfo() { // 获取计划信息
        if(this.$store.state.commonData.editPreviewData.name){
          this.formData = jQuery.extend(this.formData,this.$store.state.commonData.editPreviewData);
          this.$store.state.commonData.editPreviewData = {};
          this.equipmentData = this.formData.catalogueItemsList;
          return;
        }
        if(this.isEdit){
          getPlanPreview(this.$route.params.planId).then(response => {
            this.formData = jQuery.extend(this.formData,response);
            this.formData.content = this.formData.content||'';
            if(this.formData.catalogueItemsList == null || this.formData.catalogueItemsList.length == 0){
              this.formData.catalogueItemsList = [{
                itemsCode:'',
                name:'',
                type:1
              }];
            }
            this.equipmentData = this.formData.catalogueItemsList;
            this.getFormData();
          });
        } else {
          getPlanInfo(this.id).then(response => {
            this.formData = jQuery.extend(response,this.formData);
            this.getFormData();
          });
        }
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
      filterEquipment(row) {
        // if(!row.name){
        //   var catalogueId = this.equipmentData.filter(function(item){
        //     return item.itemsCode == row.itemsCode;
        //   });
        //   row.name = catalogueId.length>0?catalogueId[0].name:'';
        //   row.unit = catalogueId.length>0?catalogueId[0].unit:'';
        // }
        // this.equipmentData = this.formData.catalogueItemsList;
        var filterEquipment = this.formData.catalogueItemsList.filter(function(item){
          return item.itemsCode == row.itemsCode;
        });
        if(filterEquipment&&filterEquipment.length>1){
          this.$message({
            message: '添加的仪器药品名称已经存在',
            type: 'error'
          });
          row.itemsCode = '';
        }else{
          if(!row.name){
            var catalogueId = this.equipmentData.filter(function(item){
              return item.itemsCode == row.itemsCode;
            });
            row.name = catalogueId.length>0?catalogueId[0].name:'';
            row.unit = catalogueId.length>0?catalogueId[0].unit:'';
          }
          this.equipmentData = this.formData.catalogueItemsList;
        }
      },
      getFormData() {
        this.$store.dispatch('GetTeach').then(() => {
          if(!this.isEdit){
            this.formData.teachingMaterial = this.$store.state.commonData.teach[0].value;
          }
        });
        this.$store.dispatch('GetCourse');
        this.$store.dispatch('GetType').then(() => {
          this.formData.type = this.formData.type;
        });
      },
      preview(){// 预览
        this.getEquipmentText();
        this.$store.state.commonData.editPreviewData = this.formData;
        if(this.isEdit){
          this.$router.push({ name: 'PlanEditPreview'});
        } else {
          this.$router.push({ name: 'PlanAddPreview'});
        }
      },
      getEquipmentText() {
        this.formData.equipment = this.formData.catalogueItemsList.map(function(item){
          return item.name;
        }).filter(function(item){
          return item;
        }).join("、");
      },
      deleteEquipRows(scope){
        this.formData.catalogueItemsList.splice(scope.$index,1);
      },
      addRows() {
          this.formData.catalogueItemsList.push({itemsCode:'',name:''});
          this.equipmentData=null;

      },
      cancel(){// 取消
        this.$router.go(-1);
      },
      submitForm(text) {
        if(this.loading){
          return;
        }
        this.formData.name = this.formData.name.trim();  //去除实验名称前后空格，防止重名
        var parseData=[];
        this.formData.catalogueItemsList.forEach(function(item){  //去除空数据
        if(item.name!=''){
            parseData.push(item);
          }
        });
        this.formData.catalogueItemsList = parseData;
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            this.getEquipmentText();
            this.loading = true;
            if(this.isEdit){
              updatePlanDetails(this.formData).then(response => {
                this.loading = false;
                this.$router.push({ name: 'PlanEdit', params: { id: this.formData.planId }});
              }).catch(err => {
                this.loading = false;
              });
            } else {
              addPlanDetails(this.id,this.formData).then(response => {
                this.loading = false;
                if(text==='save'){ // 保存
                  this.$router.push({ name: 'PlanEdit', params: { id: this.id }});
                } else { // 保存并添加下一个
                  this.$message({
                    message: '操作成功！',
                    type: 'success'
                  });
                  this.resetForm();
                }
              }).catch(err => {
                this.loading = false;
              });
            }
          } else {
            return false;
          }
        });
      },
      resetForm() {
        this.$refs['formData'].resetFields();
        this.formData.name=null;
        this.formData.experimentTopic=null;
        this.formData.chapter=null;
         this.formData.material=null;
        this.formData.catalogueItemsList=[{
            itemsCode:'',
            name:''
          }];
        this.formData.content='';
      }
    }
  }
</script>
<style lang="less" scoped>
  .form-catalog{
    margin: 0 auto;
    width: 96%;
    max-width: 1100px;
  }
  .turn-back{
    margin: -85px -20px 0 0 ;
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
