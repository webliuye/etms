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
    import { getGrade} from 'api/sourceIndex';

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
            this.query.subject=this.subject;
            this.getGradeList();
          }
        },     
        methods: {   
          getGradeList() {
              getGrade(this.query).then(res => {
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
