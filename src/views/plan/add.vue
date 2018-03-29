<template>
  <master-page title="制定实验计划">
    <el-row>
      <el-col :span="12" :offset="6">
        <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" >
          <el-form-item label="科目">
            <el-select v-model="formData.subject" placeholder="请选择科目" @change="getGrade()" class="width100">
              <el-option v-for="(item,index)  in subjectData" :key="index" :label="item.label"  :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年级">
            <el-select v-model="formData.grade" placeholder="请选择年级" class="width100" @change="changeGrade()">
              <el-option v-for="(item,index)  in gradeData" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学期">
            <el-radio-group v-model="formData.term" @change="changeTerm()">
              <el-radio v-for="(item,index)  in termData" :key="index" :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="学年">
            <span v-text="formData.year"></span>
          </el-form-item>
          <el-form-item label="实验计划" prop="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="submitForm('formData')">下一步</el-button>
            <el-button @click="cancel()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </master-page>
</template>

<script>
  import MasterPage from '../layout/MasterPage';
  import { addPlan} from 'api/plan';
  import { getplanGrade} from 'api/common';
  import store from 'store';
  import { getOpenDate } from "api/index";
  import { mapGetters } from 'vuex';
  export default {
    components: {
      MasterPage
    },
    data() {
      return {
        loading: false,
        query:{
          subject:''
        },
        formData:{
          subject:'',
          subjectLabel:'',
          gradeLabel:'',
          termLabel:'',
          grade:'',
          term:'',
          year:'',
          name:''
        },
        gradeData:[],
        rules: {
          name: [
            { required: true, message: '请输入实验计划', trigger: 'blur' },
            { min: 1, max: 50, message: '输入内容超出规定长度', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      ...mapGetters([
        'subjectData',
        'termData'
      ])
    },
    created() {
      this.$store.dispatch('GetSubject').then(() => {
        this.formData.subject = this.$store.state.commonData.subject[0].value;
        this.getGrade();
      }).catch(err => {
        this.setName();
      });
      this.$store.dispatch('GetTerm')  //获取学期数据 并根据下学期开学日期设置默认学期
      .then(() => {    
        return new Promise( (resolve, reject) => {
          getOpenDate().then( res => {
            resolve(res);
          } );
        } );
      })
      .then(res => {
        if (res.dateList[1] && res.dateList[1].startDate) {
          let t = + new Date();
          let s = + new Date(res.dateList[1].startDate);
          if (t > s) {
            this.formData.term = this.$store.state.commonData.term[1].value;  
          } else {
            this.formData.term = this.$store.state.commonData.term[0].value;  
          }
        } else {
          this.formData.term = this.$store.state.commonData.term[0].value;  
        }
        this.changeTerm();
      })
      .catch(err => {
        this.formData.term = this.$store.state.commonData.term[0].value; 
        this.changeTerm();
      });
      this.$store.dispatch('GetNowYear').then(() => {
        this.formData.year = this.$store.state.commonData.nowYear;
      });
    },   
    methods: { 
      getGrade(){
        const vm = this;
        if (!this.formData.subject) {   //获取subjectLabel
          this.formData.subjectLabel = '';
        } else {
          this.subjectData.forEach(function(s){
            if (s.value == vm.formData.subject) {
              vm.formData.subjectLabel = s.label;
            }
          });
        }
        this.gradeData = [];
        this.query.subject= this.formData.subject;
        getplanGrade(this.query).then(res=>{
          this.gradeData = res;
          if(res && res.length > 0){
            this.formData.grade = res[0].value;
          }
          this.changeGrade();
        }).catch(err => {
          this.changeGrade();
        });
      },  
      changeGrade() {
        const vm = this;
        if (!this.formData.grade){  //获取gradeLabel
          this.formData.gradeLabel = '';
        } else {
          this.gradeData.forEach(function(s){
            if (s.value == vm.formData.grade) {
              vm.formData.gradeLabel = s.label;
            }
          });
        }
        this.setName();
      },
      changeTerm() { 
        if(!this.formData.term){   //获取termLabel
          this.formData.termLabel = '';
          return;
        }
        const vm = this;
        this.termData.forEach(function(s){
          if (s.value == vm.formData.term) {
            vm.formData.termLabel = s.label;
          }
        });
        this.setName();
      },
      setName(s){
        this.formData.name = this.formData.subjectLabel + this.formData.gradeLabel + this.formData.termLabel + '计划';
      },
      cancel(){// 取消
        this.$router.go(-1);
      }, 
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            addPlan(this.formData).then(response => {
              this.loading = false;
              this.$message({
                message: '操作成功！',
                type: 'success'
              });
              this.$router.push({ name: 'PlanEdit', params: { id: response }});
            }).catch(err => {
              this.loading = false;
            });
          } else {
            return false;
          }
        });        
      }
    }
  }
</script>

