//用于资源首页的公共样式
<template>
	<div class="srclogin" id="srclogin" >
		<div class="title">
			<div>
				<img  src="~assets/sourceImg/lianyi.png" alt="啊哦，图片丢了~">
				<span style="display:inline-block;height:16px;padding-top:3px;">-做实验更简单</span>
				<div class="fr title-right">
					<a class="user-center" v-if="!login" @click="toLogin()" >登录</a>
					<a class="user-change" v-if="login" @click="goSystem()" >进入系统</a>
					<a class="user-out"  v-if="login" @click="logout">退出</a>
				</div>
				<div class="fr title-center"  v-if="login">
				  您好，<span style="color:#20a0ff;">{{userName}}</span>
				</div>
			</div>
		</div>
    <el-dialog
      title=""
      :visible.sync="loginshow"
      width="420px"
      :before-close="handleClose" :close-on-click-modal="false" style="top: 20%;">
      <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left"
        label-width="0px"
        class="login-form">
          <h3 slot="title">登录</h3>
          <el-form-item prop="username">
              <div class="el-input"  >
                  <input  type="text" autoComplete="on" name="username" rows="2"  validateevent="true" class="el-input__inner"  style="height:36px;" v-model="loginForm.username"  placeholder="用户名"/>

              </div>
          </el-form-item>
          <el-form-item prop="password">
               <div class="el-input"  >
                  <input  type="password" autoComplete="on" name="password" rows="2"   validateevent="true" class="el-input__inner"  style="height:36px;" v-model="loginForm.password" @keyup.enter="handleLogin" placeholder="密码"/>

              </div>
          </el-form-item>
          <el-form-item prop="vcode" v-if="code>=1" >
              <el-row>
                  <el-col :span="16">
                       <div class="el-input"  >
                             <input  type="text"  name="password" rows="2"   validateevent="true" class="el-input__inner"  style="height:36px;" @keyup.enter.native="handleLogin"
                             v-model="loginForm.vcode"  placeholder="验证码"/>
                    </div>
                  </el-col>
                  <el-col :span="1">
                      &nbsp;
                  </el-col>
                  <el-col :span="7" class="valid-img"><img :src="validUrl"  @click="changeImg" /></el-col>
              </el-row>
          </el-form-item>
          <el-form-item>
            <template>
        <el-checkbox v-model="checked">记住用户名</el-checkbox>
      </template>
          <el-button type="primary" size="large" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
              登录
          </el-button>
          </el-form-item>
      </el-form>
    </el-dialog>
     <form id="myForm" v-show="false" ref="myForm"  method="post">
        <input type="text" name="state" v-model="formdata.state">
        <input type="text" name="clientId" v-model="formdata.clientId">
        <input type="text" name="redirectUri" v-model="formdata.redirectUri">
        <input type="submit" id="submitBtn">
    </form>
    <slot></slot>
    <div style="background:#ddd;" >
            <div   style="width:1024px;margin:0 auto; text-align:right;font-size:12px;color:#666;padding:4px 0;">
            <span >技术支持：湖南联羿科技有限公司</span> <span>客服电话：400-690-1580</span>
            </div>
    </div>
	</div>
</template>

<script>
import store from "store";
import { mapGetters } from "vuex";
export default {
  name: "layout",
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error("密码不能小于3位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: '',
        password: "",
        vcode: ""
      },
      code: 0,
      checked:false,
      loginshow: false,
      loginRules: {
        username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [{ required: true, trigger: "blur", validator: validatePass }]
        //   vcode: [
        //       { required: true, message: '请输入验证码', trigger: 'blur'}
        //   ]
      },
      userName: "",
      loading: false,
      validUrl:
        this.$store.getters.objApi.OAUTH_API +
        "/login/vcode?date=" +
        encodeURI(new Date()),
      formdata: {
        clientId: "iportal_client",
        state: "",
        redirectUri: this.$store.getters.objApi.LOCAL_URL
      }
    };
  },
  computed: {
    getUserIcons() {
      return this.$store.state.commonData.loginshow;
    },
    login:{
        get: function () {
          return window.localStorage.getItem("access_token")&&this.$store.state.user.userInfo ? true : false;
        },
        set: function (newValue) {
        }
    }
  },
  watch: {
    getUserIcons(val) {
      this.loginshow = this.$store.state.commonData.loginshow;
    },
    login(val) {
      this.login = val;
    }
  },
  created() {
    if (
      window.localStorage.getItem("access_token") &&
      this.$store.state.user.userInfo
    ) {
      this.userName = this.$store.state.user.userInfo.name;
    } else {


      this.login = false;
    }

  },
  methods: {
    handleClose() {
      this.loginshow = false;
      this.$store.state.commonData.loginshow = false;
      (this.loginForm = {
        username: "",
        password: "",
        vcode: ""
      }),
        (this.loading = false);
    },
    toLogin() {
      this.loginshow = true;
      if(window.localStorage.getItem('password')!==''){
          this.checked=true;
          this.loginForm.username=window.localStorage.getItem('password');
      }else{
        this.loginForm.username="";
      }
    },
    goSystem() {
      this.$router.push({ path: "/" });
    },

    handleLogin() {
      const login = () => {
        this.loading = true;
        const vm = this;
        this.$store
          .dispatch("LoginByUserName", this.loginForm)
          .then(data => {
            console.log(data);
            this.loading = false;
            this.formdata.state = data;
            this.$refs.myForm.action =
              this.$store.getters.objApi.OAUTH_API + "/auth/implicit/token";
            this.$nextTick(function() {
              vm.$refs.myForm.submit();
            });
            if(this.checked){
              window.localStorage.setItem('password',vm.loginForm.username);
            }else{
              window.localStorage.setItem('password','');
            }
          })
          .catch(err => {
            this.$message.error(err.error);
            if (err.failLoginCount) {
              this.code = err.failLoginCount;
            }
            this.changeImg();
            this.loading = false;
            this.loginForm.password='';
            this.loginForm.vcode="";
          });
      };
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          if (this.code >= 1) {
            if (this.loginForm.vcode) {
              login();
            } else {
              this.$message.error("请输入验证码");
              this.changeImg();
              this.loading = false;
            }
          } else {
            login();
          }
        } else {
          this.changeImg();
          return false;
        }
      });
    },
    changeImg() {
      this.validUrl =
        this.$store.getters.objApi.OAUTH_API +
        "/login/vcode?date=" +
        encodeURI(new Date());
    },
    logout() {
      this.$confirm("你确定要退出到登录页吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          this.$router.push({ path: "/srcIndex" });
        });
      });
    }
  },
  mounted() {

  }
};
</script>
<style  rel="stylesheet/less" lang="less" scoped>
@hoverColor: rgb(77, 179, 255);
.title {
  background: #eee;
  color: #666;
  font-size: 12px;
  > div {
    width: 1024px;
    margin: 0 auto;
    padding: 4px 0px 6px;
    span {
      font-size: 12px;
      vertical-align: middle;
      margin: 0;
    }
    img {
      display: inline-block;
      height: 16px;
      vertical-align: middle;
    }
  }
}
.user-center {
  background: #abcd03;
  padding:8px 16px;
  color:#fff;
  // padding-left: 20px;
  // margin-left: 8px;
  // background: url(~assets/img/icon-user-center.png) center left no-repeat;
  // &:hover {
  //   color: @hoverColor;
  // }
}
.user-kf {
  padding-left: 20px;
  margin-left: 8px;
  background: url(~assets/img/icon-kf.png) center left no-repeat;
  &:hover {
    color: @hoverColor;
  }
}
.user-change {
  padding-left: 20px;
  margin-left: 8px;
  color: #ff6709;
  background: url(~assets/img/icon-change.png) center left no-repeat;
  &:hover {
    color: @hoverColor;
  }
}
.user-out {
  padding-left: 20px;
  margin-left: 8px;
  background: url(~assets/img/user-out.png) center left no-repeat;
  &:hover {
    color: @hoverColor;
  }
}
.login-container {
  position: relative;
  width: 100%;
  height: 100%;
  .login-header {
    width: 100%;
    background-color: rgb(0, 160, 234);
    img {
      max-width: 100%;
      margin: 0 auto;
      display: block;
      max-height: 220px;
    }
  }
  .login-content {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    overflow: hidden;
  }
  .ad-content {
    margin: 80px 10px 20px;
    padding: 0 36px;
    text-align: center;
    p {
      margin: 0;
    }
    .ad-title {
      font-size: 200%;
      margin: 0;
      font-weight: 900;
      margin-bottom: 10px;
    }
    .ad-desc {
      font-size: 110%;
      color: #333;
      margin-bottom: 20px;
    }
    img {
      width: 100%;
      max-width: 100%;
    }
  }
  .login-form {
    margin: 40px 30px 20px;
    background-color: #f6fbfe;
    border: 1px solid #b6b6b6;
    padding: 30px 35px 100px;
    .title {
      font-size: 22px;
      font-weight: 600;
      margin: 20px auto 20px auto;
      text-align: center;
    }

    .valid-img {
      line-height: 1;
      img {
        cursor: pointer;
        width: 100%;
      }
    }
    .el-button--success {
      background-color: #abcd03;
      border-color: #abcd03;
      padding: 16px 19px;
    }
  }
  .login-footer {
    box-shadow: 0 -1px 36px #ddd;
    padding: 40px 10px 30px;
    position: relative;
    z-index: 9;
    p {
      margin: 0;
      text-align: center;
      color: #333;
      line-height: 24px;
    }
    .footer-p1 {
      font-size: 14px;
    }
    .footer-p2 {
      font-size: 12px;
      span {
        &:before {
          content: "";
          display: inline-block;
          width: 28px;
          height: 15px;
          vertical-align: middle;
        }
      }
    }
  }
}
#srclogin{
   .el-dialog--tiny {
    .el-form {
        padding: 0 24px 24px;
        .el-input {
            background: #fff;
            height: 36px;
        .el-input__inner {
            height: 36px;
        }
        }
        input:-webkit-autofill{
            background: #fff;
        }
        .el-button {
        height: 40px;
        color: #fff;
        font-size:18px;
        font-weight: bold;
        }
        h3 {
        font-size: 20px;
        margin:0 0 16px 0;
        }
    }
    }
}

</style>
