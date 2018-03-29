<template>
  <el-breadcrumb class="app-levelbar" separator="/">
    <el-breadcrumb-item v-for="(item,index)  in levelList" :key='index'>
      <router-link v-if='item.redirect==="noredirect"||index==levelList.length-1' to="" class="no-redirect">{{item.meta.nav}}</router-link>
      <router-link v-else-if='item.meta.paramKey'  :to='{ name: item.meta.paramName, params: item.meta.paramValue }'>{{item.meta.nav}}</router-link>
      <router-link v-else :to="item.path">{{item.meta.nav}}</router-link>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
    export default {
      created() {
        this.getBreadcrumb()
      },
      data() {
        return {
          levelList: null
        }
      },
      methods: {
        getBreadcrumb() {
          let matched = this.$route.matched.filter(item => item.meta.nav);
          const first = matched[0];
          if (first && (first.meta.nav !== '首页' || first.path !== '')) {
            matched = [{ name: 'home', path: '/srcIndex', meta: { nav: '首页' }}].concat(matched)
          }
          this.levelList = matched;
          const vm = this;
          this.levelList.map(function(levelItem) {
            if (!!levelItem.meta.paramKey) {
              vm.$set(levelItem.meta, 'paramValue', {});
              levelItem.meta.paramKey.forEach(function(paramItem) {
                vm.$set(levelItem.meta.paramValue, paramItem, vm.$route.params[paramItem]);
              })
              return levelItem;
            }
          });
        }
      },
      watch: {
        $route() {
          this.getBreadcrumb();
        }
      }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .app-levelbar.el-breadcrumb {
        float: left;
        font-size: 12px;
        line-height: 36px;
        .no-redirect{
          color: #97a8be;
          cursor:text;
        }
    }
</style>
