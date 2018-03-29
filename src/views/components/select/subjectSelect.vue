<template>
<el-col :lg="24" :md="24" :sm="24" :xs="24" class='right'>
          <el-select v-model="subject" @change="getSubject" clearable placeholder="全部科目">
            <el-option
              v-for="(item,index)  in subjectData"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          </el-col>
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {
        name: 'subjectSelect',
        props: {
          subjectDt: {
            type: String,
            default:''
          },
        },
         data() {
            return {
              subject:''  
            }
        },
        watch: {
          subjectDt() {
            this.subject = this.subjectDt;
          }
        },
        computed: {
          ...mapGetters([
            'subjectData'
          ])
        },
        created() {
          this.$store.dispatch('GetSubject');
        },       
        methods: {    
          getSubject() {
            this.$emit('changeSubject', this.subject);
          }
        },
        mounted() {
          this.subject = this.subjectDt;
        }  
    }
</script>
