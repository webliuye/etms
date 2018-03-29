<template>
    <el-menu class="navbar" mode="horizontal">
        <Hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></Hamburger>
        <div class="nav-title">
            <p>{{titleInfo}}</p>
            <div class="fr title-right">
              <span v-if="noticeNumber>0" class="notice-info">{{noticeNumber}}</span>
              <a class="user-notice" @click="goNotice" v-if='powerNotice'>通知公告</a>
              <a class="user-center" @click="goIportal">用户中心</a>
              <a class="user-change" @click="changeSystem">切换系统</a>
              <a class="user-kf" @click="callCustom">在线客服</a>
<!--               <a class="user-help" @click="help">帮助</a> -->
              <a class="user-out" @click="logout">退出</a>
            </div>
            <div class="fr title-center">
              {{userInfo.orgName}}
            </div>
        </div>
        <!-- <ErrLog v-if="log.length>0" class="errLog-container" :logsList="log"></ErrLog> -->
    </el-menu>
</template>

<script>
    import { mapGetters } from 'vuex'
    import Levelbar from './Levelbar';
    import Hamburger from 'components/Hamburger';
    import ErrLog from 'components/ErrLog';
    import errLogStore from 'store/errLog';
    import { getNotice } from 'api/index';
    import { getTitle } from 'api/common';
    export default {
      components: {
        Levelbar,
        Hamburger,
        ErrLog
      },
      data() {
        return {
          log: errLogStore.state.errLog,
          userInfo:this.$store.state.user.userInfo,
          titleInfo:this.$store.getters.objApi.INDEX_TITLE,
          iportalUrl:this.$store.getters.objApi.IPORTAL_API + '/homepage.html#!/personage?uri=' + this.$store.getters.objApi.LOCAL_URL,
          helpUrl: this.$store.getters.objApi.LOCAL_URL + '/helper',
          noticeNumber:0
        }
      },
      computed: {
        ...mapGetters([
          'sidebar',
          'powerNotice'
        ])
      },
      created(){
        if(document.body.clientWidth < 1240){
            this.$store.dispatch('toggleSideBar');
        }
        getTitle().then(res => {
          if(res){
            this.titleInfo = res;
          }
        });
        getNotice().then(res => {
          this.noticeNumber = res;
        });
      },
      methods: {
        toggleSideBar() {
            this.$store.dispatch('toggleSideBar');
        },
        goIportal() {
          //window.open(this.iportalUrl);
          window.location.href = this.iportalUrl;
        },
        changeSystem() {
          window.location.href = this.$store.getters.objApi.iportal_fe_url+"index.html#!/myHome";
        },
        help() {
          window.open(this.helpUrl);
        },
        goNotice() {
          this.$router.push({name:'Notice'});
        },
        callCustom() {
            var userdata = [{
              "key" : "type",
              "value" : this.userInfo.roleNames,
              "label" : "用户类型"
            }, {
              "key" : "unitname",
              "value" : this.userInfo.orgName,
              "label" : "单位名称"
            }];
            var args = {
              uid : this.userInfo.id,
              name : this.userInfo.orgName,
              email : this.userInfo.email,
              mobile : this.userInfo.mobile,
              groupid : '93586',
              data : JSON.stringify(userdata)
            };
            ysf.config(args);
            ysf.product({
              show : 0, // 1为打开， 其他参数为隐藏（包括非零元素）
              title : '实验教学9.0',
              desc : '来自实验教学9.0',
              note : '实验教学9.0'
            });
            ysf.open();
        },
        logout() {
          this.$confirm('你确定要退出到登录页吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$store.dispatch('LogOut').then(() => {
            });
          });
        }
      }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    $hoverColor: rgb(77, 179, 255);
    .navbar {
        height: 50px;
        line-height: 50px;
        border-radius: 0px !important;
        .nav-title {
            margin-left: 20px;
            p {
              font-size: 20px;
              color: rgb(132, 146, 166);
              text-align: left;
              float:left;
              margin:0;
            }
            .title-right {
              position:relative;
              margin-right:20px;
              font-size:12px;
              color: #96a3b5;
              .notice-info {
                display:block;
                height:14px;
                position:absolute;
                border-radius:2px;
                width:20px;
                left:30px;
                top:10px;
                color:#fff;
                line-height:14px;
                background-color:#ff4949;
                text-align:center;
                font-size:12px;
              }
              .user-center {
                padding-left:20px;
                margin-left:8px;
                background: url(../../assets/img/icon-user-center.png) center left no-repeat;
                &:hover {
                  color:$hoverColor;
                }
              }
              .user-notice {
                padding-left:20px;
                margin-left:8px;
                background: url(../../assets/img/notice-bg.png) center left no-repeat;
                &:hover {
                  color:$hoverColor;
                }
              }
              .user-kf {
                padding-left:20px;
                margin-left:8px;
                background: url(../../assets/img/icon-kf.png) center left no-repeat;
                &:hover {
                  color:$hoverColor;
                }
              }
              .user-change {
                padding-left:20px;
                margin-left:8px;
                color:#ff6709;
                background: url(../../assets/img/icon-change.png) center left no-repeat;
                &:hover {
                  color:$hoverColor;
                }
              }
              .user-help {
                padding-left:20px;
                margin-left:8px;
                background: url(../../assets/img/icon-help.png) center left no-repeat;
                &:hover {
                  color:$hoverColor;
                }
              }
              .user-out {
                padding-left:20px;
                margin-left:8px;
                background: url(../../assets/img/user-out.png) center left no-repeat;
                &:hover {
                  color:$hoverColor;
                }
              }
            }
            .title-center {
              height: 40px;
              line-height: 40px;
              margin-top:5px;
              padding-right:8px;
              border-right:1px solid #c3cfdd;
              font-size:12px;
              color: #96a3b5;
            }
        }
        .hamburger-container {
            line-height: 58px;
            height: 50px;
            float: left;
            padding: 0 10px;
        }
        .errLog-container {
            display: inline-block;
            position: absolute;
            right: 150px;
        }
        .avatar-container {
            height: 50px;
            display: inline-block;
            position: absolute;
            right: 35px;
            top: 0px;
            .avatar-wrapper {
                cursor: pointer;
                margin-top: 8px;
                position: relative;
                .user-avatar {
                    width: 25px;
                    height: 25px;
                }
                .el-icon-caret-bottom {
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
</style>



