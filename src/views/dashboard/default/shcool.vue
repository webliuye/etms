<template>
    <div class="dashborad">
      <SchoolManage v-if="manageBoolean"></SchoolManage>
      <Tester v-if="testBoolean"></Tester>
      <Teacher v-if="techerBoolean"></Teacher>
    </div>
</template>
<script>
  import Tester from 'views/dashboard/default/tester'
  import SchoolManage from 'views/dashboard/default/schoolManage'
  import Teacher from 'views/dashboard/default/teacher'
  import { mapGetters } from 'vuex'
  export default {
    name: 'School',
    components: {
      Teacher,
      Tester,
      SchoolManage
    },
    data() {
      return {
        techerBoolean:false,   //老师入口
        testBoolean:false,     //实验员入口
        manageBoolean:false,    //学校管理员入口
        roleCode:this.$store.state.user.userInfo.roleCode
      } 
    },
    created() {
      if(this.roleCode == '304'){
        this.techerBoolean = true;
      }else if(this.roleCode == '303'){
        this.testBoolean = true;
      }else{
        this.manageBoolean = true;
      }
    }
  }
</script>
<style  rel="stylesheet/less" lang="less" scoped>
@base-bg: #00a0e9;
@hoverColor: #00a0e9;
ul li {
    list-style-type:none;
}
ul {
    margin: 0;
    padding: 0;
}
.dashborad {
    padding: 16px;
    .agent-item {
        color: @base-bg;
        .el-col {
            position: relative;
            // text-align: center;
            &::before {
                border-left: 2px solid #adb2b5;
                content: "";
                height: 50px;
                left: 0;
                margin-top: 8px;
                position: absolute;
            }
        }
        .count-top {
            font-size: 13px; 
        }
        .count {
            font-size: 24px;
            line-height: 40px;
            cursor: pointer;
        }
    }
}
</style>