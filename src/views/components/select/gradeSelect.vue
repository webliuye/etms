<template>
          <el-select v-model="grade" @change="getGradeValue" clearable placeholder="全部年级">
            <el-option
              v-for="(item,index)  in gradeData"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { getplanGrade} from 'api/common';
    export default {
        name: 'gradeSelect',
        props: {
          subject: {
            type: String,
            default:''
          },
          gradeId:{
             type: String,
            default:''
          }
        },
        data() {
            return {
              grade:'',
              gradeData:[],
              query:{
                subject:''
              }
            }
        },  
        created(){

        },
        watch: {
          subject() {
            this.grade = '';
            this.gradeData = [];
            this.getGradeList();
          }
        },     
        methods: {   
          getGradeList() {
            if(!this.subject) return;
            getplanGrade({subject:this.subject}).then(res => {
              this.gradeData = res;
            });
          }, 
          getGradeValue() {
            this.$emit('changeGrade', this.grade);
          }
        },
        mounted() {
          this.getGradeList();
          if(this.gradeId){
            this.grade=this.gradeId;
          }
        }  
    }
</script>
