<template>
          <el-select v-model="course" @change="getCourse" clearable placeholder="开课方式">
            <el-option
              v-for="(item,index)  in courseData"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
</template>

<script>
    import { mapGetters } from 'vuex';
    export default {
        name: 'courseSelect',
         data() {
            return {
              course:''
            }
        },
        computed: {
          ...mapGetters([
            'courseData'
          ])
        },
        created() {
          this.$store.dispatch('GetCourse');
        },       
        methods: {    
          getCourse() {
            this.$emit('changeCourse', this.course);
          }
        },
        mounted() {
        }  
    }
</script>
