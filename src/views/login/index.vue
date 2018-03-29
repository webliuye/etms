<template>
  <div class="login-container">
    <div class="login-header"><img src="../../assets/login-icon/login-header.jpg"></div>
    <div class="login-content">
        <el-row :gutter="60">
            <el-col :xs="24" :sm="13" :md="15">                
                <div class="ad-content">
                    <h3 class="ad-title">实验教学</h3>
                    <p class="ad-desc">实验教学管理 实验教学资源 实验教学考核</p>
                    <p><img src="../../assets/login-icon/login-ps.jpg"></p>
                </div>                
            </el-col>
            <el-col :xs="24" :sm="11" :md="9">
                <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left"
                 label-width="0px"
                 class="login-form">
                    <h3 class="title">登录</h3>
                    <el-form-item prop="username">
                        <el-input name="username" type="text" ref="username" v-model="loginForm.username" autoComplete="on"
                                placeholder="用户名"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input name="password" type="password" v-model="loginForm.password"
                                autoComplete="on" placeholder="密码"></el-input>
                    </el-form-item>
                    <el-form-item prop="vcode">
                        <el-row>
                            <el-col :span="16">
                                <el-input name="vcode" type="text" @keyup.enter.native="handleLogin" v-model="loginForm.vcode"
                                    autoComplete="on" placeholder="验证码"></el-input>
                            </el-col>
                            <el-col :span="1">
                                &nbsp;
                            </el-col>
                            <el-col :span="7" class="valid-img"><img :src="validUrl"  @click="changeImg" /></el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item>
                    <el-button type="success" size="large" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
                        登录
                    </el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
    <div class="login-footer">
        <p class="footer-p1">主管部门：广西省教育厅&nbsp;&nbsp;&nbsp;&nbsp;主办单位：广西省教育技术装备管理中心</p> 
        <p class="footer-p2"><span class="footer-icon-1">技术支持:湖南联羿科技有限公司&nbsp;&nbsp;</span><span class="footer-icon-2">客服电话: 400-690-1580</span></p>   
    </div>
    <form id="myForm" v-show="false" ref="myForm"  method="post">
        <input type="text" name="state" v-model="formdata.state">
        <input type="text" name="clientId" v-model="formdata.clientId">
        <input type="text" name="redirectUri" v-model="formdata.redirectUri">
        <input type="submit" id="submitBtn">
    </form>
  </div>
</template>
<script>
    import { mapGetters } from 'vuex';
    export default {
      name: 'login',
      data() {
        const validatePass = (rule, value, callback) => {
          if (value.length < 3) {
            callback(new Error('密码不能小于3位'));
          } else {
            callback();
          }
        };
        return {
          loginForm: {
            username: '',
            password: '',
            vcode: ''
          },
          loginRules: {
            username: [
                { required: true, message: '请输入用户名', trigger: 'blur'}
            ],
            password: [
                { required: true, trigger: 'blur', validator: validatePass }
            ],
            vcode: [
                { required: true, message: '请输入验证码', trigger: 'blur'}
            ]
          },
          loading: false,
          validUrl: this.$store.getters.objApi.OAUTH_API + '/login/vcode?date=' + encodeURI(new Date()),
          formdata: {
              clientId : 'iportal_client',
              state: '',
              redirectUri: this.$store.getters.objApi.LOCAL_URL+'/#/index'
          }
        }
      },
      methods: {
            handleLogin() {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.loading = true;
                        const vm = this;
                        this.$store.dispatch('LoginByUserName', this.loginForm).then((data) => {
                            this.loading = false;
                            this.formdata.state = data;
                            this.$refs.myForm.action = this.$store.getters.objApi.OAUTH_API + "/auth/implicit/token";
                            this.$nextTick(function () {
                                vm.$refs.myForm.submit();
                            })
                        }).catch(err => {
                            this.$message.error(err);
                            this.changeImg();
                            this.loading = false;
                        });
                    } else {
                        this.changeImg();
                        return false;
                    }
                });
            },
            changeImg() {
                this.validUrl = this.$store.getters.objApi.OAUTH_API +'/login/vcode?date=' + encodeURI(new Date());
            }
      }
    }
</script>
<style rel="stylesheet/less" lang="less">
    .login-container {
        position: relative;
        width: 100%;
        height: 100%;
        .login-header {
            width: 100%;
            background-color: rgb(0,160,234);
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
            margin: 80px 10px 20px ;
            padding:0 36px;
            text-align: center;  
            p{
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
            border: 1px solid #B6B6B6;
            padding: 30px 35px 100px;
            .title {
                font-size: 22px;
                font-weight: 600;
                margin: 20px auto 20px auto;
                text-align: center;
            }

            .valid-img {
                line-height: 1;
                img{
                    cursor: pointer;
                    width: 100%;
                }
                
            }
            .el-button--success{
                background-color: #abcd03;
                border-color: #abcd03;
                padding: 16px 19px
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
                span{
                    &:before {
                        content: "";
                        display: inline-block;
                        width: 28px;
                        height: 15px;
                        vertical-align: middle;
                    }
                    &:first-child:before {
                        background: url("../../assets/login-icon/footer-log.png") no-repeat center;
                    }
                    &:last-child:before{
                        width: 15px;
                        padding-left: 20px;
                        vertical-align: text-top;
                        background: url("../../assets/login-icon/phone.png") no-repeat center;
                    }
                }
            }

        }
    }
    
</style>
