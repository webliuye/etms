<template>
<scroll-bar>
  <div :class="{'left-bar':sidebar.opened,'leftBar':!sidebar.opened}">
    <div class="left-top-bar" style="min-height:148px;"  >
      <div v-show="sidebar.opened">
         <div v-bind:class="classObject"></div>
        <div class="user-type-name">
          <div class="div-name" :title="name">{{name}}</div>
          <div class="user-rolename">{{roleNames}}</div>
        </div>
      </div>

    </div>

    <el-menu  :default-active="onRoutes" unique-opened router :collapse="isCollapse"  background-color="#1D8CE0" text-color="#fff" active-text-color="#fad67f">
       <div class="menu-wrapper">
        <template v-for="item in menuItems" >
          <router-link v-if="!item.children" :to="'/' + item.href" :key="item.id">
            <el-menu-item :index="'/' + item.href" class="submenu-title-noDropdown">
                <span slot="title"> {{ item.name }}</span>
                <i class="custom-icon" :class="item.icon"></i>
            </el-menu-item>
          </router-link>

            <el-submenu v-else :key="item.id" :index="item.id">
                    <template slot="title"><i class="custom-icon" :class="item.icon"></i><span>{{ item.name }}</span></template>
                    <el-menu-item v-for="(subItem,i) in item.children" :key="i" :index="'/' + subItem.href">{{ subItem.name }}
                    </el-menu-item>
            </el-submenu>

        </template>
      </div>
        <!-- <el-submenu index="1" >
            <template  slot="title"> <i class="systemset-icon custom-icon"></i> <span>系统设置</span> </template>
            <el-menu-item index="/historySave">历史存档</el-menu-item>
            <el-menu-item index="/schoolClassManage">班级设置</el-menu-item>
            <el-menu-item index="/longLat">经纬度设置</el-menu-item>
        </el-submenu> -->
    </el-menu>


  </div>
  </scroll-bar>
</template>

<script>
  import { mapGetters } from 'vuex'
  import ScrollBar from '@/components/ScrollBar'
  export default {
    name: 'Sidebar',
    components: { ScrollBar },
    data() {
      return {

      }
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'menuItems',
        'userInfo'
      ])
      ,
      isCollapse() {
        return !this.sidebar.opened
      },
      classObject: function() {
        return {
          'common-icon': true,
          'user-icon': this.userInfo.orgType == '225',
          'manage-icon': this.userInfo.orgType < '224'
        }
      },
      roleNames() {
        return this.userInfo.roleNames.split(",")[0];
      },
      name(){
        return this.userInfo.name;
      },
      onRoutes() {
          return "/" + this.$route.path.split("/")[1];
      }
    },
    created() {
    }
  }
</script>

<style rel="stylesheet/scss" lang="less" scoped>
  @base-bg: #00A0E9;
  @submenu-bg: #1D8CE0;

  .leftBar{
    background: @submenu-bg;
  }
  .left-bar {
    min-height: 100%;
    color: #fff;
    .left-top-bar {
      padding: 16px 0 8px 0;
      text-align: center;
      .common-icon {
        width:70px;
        height: 70px;
        margin: 0 auto;
        border:2px solid #fff;
        border-radius: 35px;
      }
      .user-icon {
        background: url('../../assets/img/icon-user-group.png') -70px -70px no-repeat;
      }
      .manage-icon {
        background: url('../../assets/img/icon-user-group.png') -70px 0 no-repeat;
      }
      .sy-icon {
        background: url('../../assets/img/icon-user-group.png') 0 0 no-repeat;
      }
      .xz-icon {
        background: url('../../assets/img/icon-user-group.png') 0 -70px no-repeat;
      }

      .user-type-name {
        margin-top: 10px;
        .user-rolename {
          font-size: 12px;
          color: #b3e3f8;
          line-height: 28px;
        }
      }
    }
 }
    .el-menu > li, .el-menu > a > li {
      border-bottom: 1px solid @base-bg;
    }
    .el-menu-item.is-active {
        color: #fad67f;
    }

    .custom-icon {
      vertical-align: baseline;
      margin-right: 12px;
      display: inline-block;
      width: 20px;
      height: 20px;
      position: relative;
      top: 3px;
    }

    .icon-menu-index {
      background: url('../../assets/img/icon-menu-home.png') no-repeat;
    }

    .icon-menu-exm {
      background: url('../../assets/img/icon-menu-exm.png') no-repeat;
    }

    .icon-menu-manage {
      background: url('../../assets/img/icon-menu-manage.png') no-repeat;
    }

    .icon-menu-open {
      background: url('../../assets/img/icon-menu-open.png') no-repeat;
    }

    .icon-menu-standard {
      background: url('../../assets/img/icon-menu-exm.png') no-repeat;
    }
    .icon-menu-message {
      background: url('../../assets/img/message.png') no-repeat;
    }

    .icon-menu-count {
      background: url('../../assets/img/icon-menu-open.png') no-repeat;
    }
    .icon-user-center {
      background: url('../../assets/img/icon-user-center1.png') no-repeat;
    }
    .test-icon{
         background: url('../../assets/img/test.png') no-repeat;
    }
    .systemset-icon{
         background: url('../../assets/img/systemset.png') no-repeat;
    }


  .div-name {
    font-size: 14px;
    padding: 0 40px;
    height: 16px;
    line-height: 16px;
    overflow: hidden;
  }
</style>
