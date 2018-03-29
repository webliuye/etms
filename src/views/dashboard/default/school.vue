<template>
    <div class="dashborad">
        <Teacher v-if="schoolTeacher"></Teacher>
        <SchoolManage v-if="schoolMg"></SchoolManage> 
        <Tester v-if="schoolSy"></Tester>
    </div>
</template>
<script>
  import Tester from 'views/dashboard/default/tester'
  import Teacher from 'views/dashboard/default/teacher'
  import SchoolManage from 'views/dashboard/default/schoolManage'
  import { mapGetters } from 'vuex'
  import { getInfo} from 'api/manageCenter';
  export default {
    name: 'School',
    data() {
      return {      
        orgType:'',
        schoolBl:false,
        manageBl:false,
        schoolMg:false,
        schoolTeacher:false,
        schoolSy:false,   
        roleNames:this.$store.state.user.userInfo.roleNames,
        orgId:this.$store.state.user.userInfo.orgId,
        roleCode:this.$store.state.user.userInfo.roleCode
      
      } 
    },
    components: {
       SchoolManage,
       Teacher,
       Tester
    },
    watch:{
      
    },
    methods: {


    },
    created() {
    
      console.log(this.$store.state.user.userInfo);
      this.orgType = this.$store.state.user.userInfo.orgType;  
      if(this.orgType == '225'){
        this.schoolBl = true;
        this.schoolMg = true;
        if(this.roleCode == '304'){
          this.schoolMg = false;
          this.schoolTeacher = true;
        }
        if(this.roleCode == '303'){
          this.schoolMg = false;
          this.schoolSy = true;
        }
        if(this.roleCode == '305'){
          this.schoolBl = false;
          this.schoolMg = true;
        //   getClass().then(res => {
        //     if(res.length == 0){
        //       this.$confirm('请先建立班级，以便实验预约及管理工作。', '提示', {
        //         confirmButtonText: '确定',
        //         cancelButtonText: '取消',
        //         type: 'warning'
        //       }).then(() => {
        //           this.$router.push({ path: 'classManage' });
        //       });
        //     }
        //   });
        }
        if( this.schoolTeacher || this.schoolSy){
          getInfo().then(res => {
            if(res.userClassLists.length == 0 && this.schoolTeacher){
                this.$confirm('请先关联班级和科目以便后续操作。', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                    this.$router.push({ path: 'schoolClassManage' });
                });
            }
          });
          // getStaffSubject().then(res => {
          //   if(res.length == 0 && this.schoolSy){
          //       this.$confirm('请先关联班级和科目以便后续操作。', '提示', {
          //         confirmButtonText: '确定',
          //         cancelButtonText: '取消',
          //         type: 'warning'
          //       }).then(() => {
          //           this.$router.push({ path: 'myInformation' });
          //       });
          //   }
          // });
        }
        if(this.schoolBl){
          // getMineData().then(res => {
          //   this.mineData = res;
          //   this.myExpertDataNum = [
          //     {
          //        value: res.logtotal 
          //     },
          //     {
          //        value: res.bookingTotal 
          //     }
          //   ];
          // });
        }
      }else{
        this.manageBl = true;
        // getManageData().then(res => {
        //   this.manageData = res;
        // });  
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
.grid-content {
    border: 1px solid #ddd;
    margin-bottom: 16px;
    background: #fff;
    padding: 24px;
    .rank{
        height:320px;
        padding: 24px;
        font-size:14px;
    }
    .title {
        margin-bottom: 16px;
        font-weight: bold;
    }

    .notice-content {
        padding-left: 56px;
        width: 100%;
        background: url(../../../assets/img/notice-back.png) left 4px no-repeat;
        .notice-title {
            font-size: 14px;
            color: #666;
            font-weight: 400;
            &:hover {
                color:@hoverColor;
            }
        }
    }
}

.notice ul li {
    margin: 10px 0;
    line-height: 26px;
}
.notice-color:hover {
    color:@hoverColor;
}
.notice .notice-more {
    text-align: right;
    display: block;
    &:hover {
        color:@hoverColor;
    }
}
.course-info{
    width:400px;
    height:200px;
}
</style>