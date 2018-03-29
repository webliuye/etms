<template>
  <section id="item-select">
    <el-form-item label="查找目录" v-if=" showList.indexOf('stand') !== -1 " >
      <el-select class="width200" v-model="listQuery.guidesId"   placeholder="目录标准">
        <el-option v-for="(item,index) in standList" v-show="!(item.id == guidesId)" :key="index" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="查找目录" v-if=" showList.indexOf('standState') !== -1 " >
      <el-select class="width200" clearable v-model="listQuery.id"   placeholder="目录标准">
        <el-option v-for="(item,index) in standStateList" v-show="!(item.id == guidesId)" :key="index" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if=" showList.indexOf('subject') !== -1 ">
      <el-select class="width110" clearable  v-model="listQuery.subject" @change="subjectChage" placeholder="选择科目">
          <el-option v-for="(item,index) in subjectData"  :key="index" :label="item.label" :value="item.value">
          </el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if=" showList.indexOf('grade') !== -1 ">
      <el-select class="width110"  clearable  v-model="listQuery.grade"  placeholder="选择年级">
          <el-option v-for="(item,index) in gradeData" :key="index" :label="item.label" :value="item.value">
          </el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if=" showList.indexOf('term') !== -1 ">
      <el-select class="width110"  clearable  v-model="listQuery.term"  placeholder="选择学期">
          <el-option v-for="(item,index) in termData" :key="index" :label="item.label":value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if=" showList.indexOf('material') !== -1 ">
      <el-select class="width110"  clearable  v-model="listQuery.teachingMaterial"  placeholder="教程版本">
          <el-option v-for="(item,index) in teachData" :key="index" :label="item.label":value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if=" showList.indexOf('course') !== -1 ">
      <el-select class="width110"  clearable  v-model="listQuery.courseMode"  placeholder="开课方式">
          <el-option v-for="(item,index) in courseData" :key="index" :label="item.label":value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if=" showList.indexOf('isMust') !== -1 ">
      <el-select class="width110"  clearable  v-model="listQuery.isMust"  placeholder="是否必做">
          <el-option v-for="(item,index) in isMustList" :key="index" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item  v-if=" showList.indexOf('search') !== -1 ">
      <el-input placeholder="搜索的内容" v-model="listQuery.name" class="width120" @keyup.enter.native="handleFilter">
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button icon="el-icon-search" @click="handleFilter"></el-button>
    </el-form-item>
  </section>
</template>

<script>

    import store from 'store';
    import { mapGetters } from 'vuex'
    import { getplanGrade} from 'api/common';
    import { getTableList } from 'api/guides';
    export default {
        name: 'item-select',
         data() {
            return {
                standList: '',
                standStateList: '',
                isMustList:[{value:"1",label:"是"}, {value:"0",label:"否"}],
                listQuery: {
                  courseMode: '',
                  grade: '',
                  isMust: '',
                  name: '',
                  subject: '',
                  teachingMaterial: '',
                  term: '',
                  page:1,
                  size:10,
                  id:null ,
                  guidesId:undefined
                },
                guidesId:undefined,
                selectList: undefined,
                gradeData:[]
            }
        },
        props: ['showList'] ,
        computed: {
          ...mapGetters([
            'subjectData',
            'termData',
            'teachData',
            'courseData'
          ])
        },
        watch: {
          listQuery: {
            handler(curVal,oldVal){
              if(this.$router.currentRoute.name == "GuidesView"){
                this.$store.commit('SET_GUIDESELECT',curVal);
              }else{
                this.$store.commit('SET_PLANSELECT',curVal);
              }
　　　　　　},
            deep:true
          }
        },
        created() {
          if(this.$router.currentRoute.name == "GuidesView" && this.$store.state.commonData.guideSelect){
            this.listQuery = this.$store.state.commonData.guideSelect;
          }else if(this.$store.state.commonData.planSelect){
            this.listQuery = this.$store.state.commonData.planSelect;
          }
          this.guidesId =  this.$route.params.id;
          this.getStand();
          this.getStandState();
          this.$store.dispatch('GetSubject');
          this.$store.dispatch('GetGrade');
          this.$store.dispatch('GetTerm');
          this.$store.dispatch('GetTeach');
          this.$store.dispatch('GetCourse');
          this.getGrade();
        },
        methods: {
            subjectChage () {
              this.getGrade();
              this.listQuery.grade = '' ;
            },
            getGrade(){
              getplanGrade(this.listQuery).then(res => {
                this.gradeData = res;
                this.listQuery.grade=res[0].value;
              });
            },
            handleFilter() {
              this.$emit('searchList',this.listQuery);
            },
            getStand () {
              getTableList().then(response => {
                this.standList = response;
              }).catch(err => {
                console.log(err);
              });
            },
            getStandState () {
              getTableList({'state':1}).then(response => {
                this.standStateList = response;
                var len = response.length;
                if(!this.listQuery.id){
                  this.listQuery.id = response[len-1].id;
                }
                this.$emit('searchList',this.listQuery);
              }).catch(err => {
                console.log(err);
              });
            }
        }
    }
</script>
<style type="text/less">
  .text-right{
    text-align: right;
  }
  .width145{
    width: 145px;
  }
  .width120{
    width: 120px;
  }
  .floatL{
    float: left;
  }
  #item-select .el-form-item {
    margin-right:8px;
    margin-bottom:8px;
  }
</style>
