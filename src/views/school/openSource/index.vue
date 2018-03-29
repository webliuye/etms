<template>
  <master-page title="申请开通">
    <div class="dashboard-container">
       <h2 style="margin:0 0 24px;"><img src="~assets/sourceImg/v_vip.png" style="vertical-align:middle">ip资源申请</h2>
       <!-- <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:688px;"> -->
       <div style="margin:0 auto;width:768px;">  
         <el-row :gutter="24">
           <el-col :span="4" >
              <!-- <el-steps :space="100" direction="vertical" :active="4">
                <el-step title="申请"></el-step>
                <el-step title="客服联系"></el-step>
                <el-step title="付款开通"></el-step>
                <el-step title="资源使用"></el-step>
              </el-steps> -->
           </el-col>
           <el-col :span="20">
             <p>
              尊敬的用户：
             </p>    
             <p>
               请填写您的正确联系电话和联系人姓名，方便客服人员跟您进行沟通确认。
             </p>          
             <el-form :model="linkman" :rules="rules" ref="linkman" label-width="70px" style="width:100%;max-width: 500px;">
              <el-form-item label="联系人" prop="name">
                <el-input  v-model="linkman.name" ></el-input>
              </el-form-item>            
              <el-form-item label="电话" prop="tel">
                <el-input v-model="linkman.tel" :maxlength="11"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('linkman')">申请开通</el-button>
                <el-button @click="callCustom">咨询客服</el-button>
              </el-form-item>
            </el-form>
           
           </el-col>
         </el-row>
       </div>
    </div>
  </master-page>
</template>

<script>
import MasterPage from "views/layout/MasterPage";
import { opensource } from "api/source";
export default {
  name: "openSource",
  components: { MasterPage },
  data() {
    return {
      linkman: {
        name: "",
        tel: ""
      },
      userInfo: "",
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        tel: [
          { required: true, message: "请输入联系电话", trigger: "change" },
          { message: "请输入正确的电话号码", trigger: "change" }
        ]
      }
    };
  },
  computed: {},
  created() {
    this.linkman.tel = this.$store.state.user.userInfo.mobile || "";
    this.linkman.name = this.$store.state.user.userInfo.name || "";
    userInfo: this.$store.state.user.userInfo;
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          opensource({
            contactName: this.linkman.name,
            contactPhone: this.linkman.tel
          })
            .then(res => {
              if(res==1){
                 this.$alert("您的申请已提交成功，我们将尽快跟您联系，谢谢！", "申请成功", {
                    confirmButtonText: "确定",
                    callback: action => {
                      this.$store.state.user.userInfo.mobile = this.linkman.tel;
                      setTimeout(() => {
                        this.$router.go(-1);
                      }, 2000);
                    }
                  });
              }else if(res==0){
                this.$alert("尊敬的用户，当前单位已提交申请，请勿重复提交请耐心等待我司客服联系，谢谢 ", "提示", {
                    confirmButtonText: "确定",
                    callback: action => {
                      this.$store.state.user.userInfo.mobile = this.linkman.tel;
                      setTimeout(() => {
                        this.$router.go(-1);
                      }, 2000);
                    }
                  });

              }else if(res==-1){
                 console.log("接口报错");
              }
             
            })
            .catch(err => {
              console.log("接口报错");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    callCustom() {
      var userdata = [
        {
          key: "type",
          value: this.userInfo.roleNames,
          label: "用户类型"
        },
        {
          key: "unitname",
          value: this.userInfo.orgName,
          label: "单位名称"
        }
      ];
      var args = {
        uid: this.userInfo.id,
        name: this.userInfo.orgName,
        email: this.userInfo.email,
        mobile: this.userInfo.mobile,
        groupid: "93586",
        data: JSON.stringify(userdata)
      };
      ysf.config(args);
      ysf.product({
        show: 0, // 1为打开， 其他参数为隐藏（包括非零元素）
        title: "实验教学9.0",
        desc: "来自实验教学9.0",
        note: "实验教学9.0"
      });
      ysf.open();
      
    }
  },
  mounted() {}
};
</script>
<style rel="stylesheet/scss" lang="less" scoped>
h2 {
  color: #666;
}
p {
  color: #666;
  margin: 0 0 16px;
  font-size: 12px;
}
</style>