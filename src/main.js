import "babel-polyfill";
import Vue from "vue";
import Vuex from "vuex";
import App from "./App";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import axios from "axios";
import "normalize.css/normalize.css"; // A modern alternative to CSS resets
import "element-ui/lib/theme-chalk/index.css";
import "@/styles/index.scss"; // global css
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "styles/index.scss";
import "styles/common.less";
import "styles/map.less";
import * as filters from "./filters";
import Multiselect from "vue-multiselect";
import Sticky from "components/Sticky";
import "vue-multiselect/dist/vue-multiselect.min.css";
import vueSticky from "./directive/sticky";
import errLog from "store/errLog";
import VueVideoPlayer from "vue-video-player";
import Promise from "es6-promise";
Vue.component("multiselect", Multiselect);
Vue.component("Sticky", Sticky);
Vue.use(ElementUI);
Vue.use(Vuex);
// Vue.use(vueWaves);
Vue.use(vueSticky);
// VueVideoPlayer.config({
//   youtube: true, // default false
//   switcher: false, // default true
//   hls: false // default true
// });
Vue.use(VueVideoPlayer);
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false
//解析url中的token及其它值
function getLoginParams(str){
  str=str.substr(1);
  str=str.split("&");
  var a=[];
  for(var i=0;i<str.length;i++){
      var t=str[i].split('=');
      a[t[0]]=t[1];
  }
  var s={};
  s.access_token=a["access_token"];
  s.token_type=a["token_type"];
  s.state=a["state"];
  s.expires_in=a["expires_in"];
  return s;
}
// function getHashString(urlPath, name) {
//   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
//   var r = urlPath.substr(1).match(reg);
//   if (r != null) return unescape(r[2]);
//   return null;
// }

//获取token
function getToken(data) {
  const accessToken = data.IPORTAL_API.substr(data.IPORTAL_API.indexOf("://") + 3) + '/';
  const isSameArea = data.IPORTAL_API.substr(0, data.IPORTAL_API.indexOf("/", 9)) === data.LOCAL_URL.substr(0, data.IPORTAL_API.indexOf("/", 9));
  return new Promise((resolve, reject) => {
    if (isSameArea) {
      if (localStorage[accessToken]) {
        const tokenString = localStorage[accessToken];
        const tokenObj = JSON.parse(tokenString);
        resolve(tokenObj);
      } else {
        resolve();
      }
    } else {
      var iportal = new CrossStorageClient(data.IPORTAL_API + "/token.html");
      iportal.onConnect().then(function() {
        return iportal.get(accessToken);
      }).then(function(token_list) {
        const tokenObj = JSON.parse(token_list);
        resolve(tokenObj);
      });
    }
  });
}

//获取配置文件
let configJson = new Promise((resolve, reject) => {
  if(process.env.NODE_ENV === 'development'){
    axios.get("config.json").then((result)=>{
      resolve(result);
    }).catch((error) => {
      reject(error)
    });
  }else if(process.env.NODE_ENV === 'production'){
    axios.get("/config.json").then((result)=>{
      result.data.BASE_API = result.data.etms_url;
      result.data.LOCAL_URL = result.data.etms_fe_url;
      result.data.BASE_API_ROOT = result.data.iportal_url.slice(0,result.data.iportal_url.length-1);
      result.data.IPORTAL_API = result.data.iportal_fe_url;
      result.data.OAUTH_API = result.data.iportal_oauth_url.slice(0,result.data.iportal_oauth_url.length-1);
      result.data.state= result.data.etms_permission;
      if(!result.data.VERSION){
        result.data.VERSION = "版本:v9.7.2";
      }
      // if(!result.data.BIGDATA){//你这段永远都是true的返回值
      //   result.data.BIGDATA = true;
      // }
      resolve(result);
    }).catch((error) => {
      reject(error);
    });
  }
});

// register global progress.
const whiteList = ['/login','/srcIndex','/error500']; // 不重定向白名单


router.beforeEach((to, from, next) => {
  NProgress.start();
  $ (window).unbind ('scroll');   //解除滚动事件
  //储存有token情况
  if (store.getters.token) {
    //权限控制
    // if(!store.getters.menuArray){
    //   next();
    // }else{
    //   var menuArray = store.getters.menuArray;
    //   var hash,value;
    //   hash = to.path.slice(1);
    //   if(hash.indexOf('/') != -1){
    //     value = hash.slice(0,hash.indexOf('/'));
    //   }else{
    //     value = hash;
    //   }
    //   if(menuArray && menuArray.indexOf(value) < 0){
    //     // next('/error');
    //   }else{
    //     next();
    //   }
    // }
    next();
  } else {
  //没有token的情况下
    configJson.then((result)=>{
      localStorage.setItem('ObjAPI',JSON.stringify(result.data));
      store.commit('SET_OBJAPI',result.data);
      var t = result.data.IPORTAL_API;
      result.data.IPORTAL_API_1 = t;
      if(t.charAt(t.length - 1) === '/'){
        result.data.IPORTAL_API = t.slice(0,t.length - 1);
      }
      //先判断刷新的情况,直接从localstorage获取token
      const as_token=window.localStorage.getItem('access_token');
      if(as_token){
        store.dispatch('SetInfo', { 'token': as_token ,"token_type":"bearer"}).then((data) => {
          store.dispatch('GetInfo').then(res=>{
            //这一步是匹配iportal的数据存储，进入系统互转
            window.sessionStorage.setItem('iportalUser',JSON.stringify(res));
            window.localStorage.setItem('iportalUser',JSON.stringify(res));
            next();
          }).catch(err=>{
            next();
          });
        });
      }else{//如果localstorage都没有token
        if(whiteList.indexOf(to.path) !== -1 || to.path.slice(0,4)=='/src'){//判定白名单 和 判定是不是外部的资源首页，不需要token的部分。
          next();
        }else{//不在白名单也没有token；
          if(result.data.state){//如果state存在说明需要在资源首页进行登录，通过截取网址的token获取token。
            //登录地址获取token
            const s = getLoginParams(to.path);
            //const access_token = getHashString(to.path, "access_token");
            const access_token = s.access_token;
            if (access_token) {//如果能获取到token，说明这是在链接上截取的token成功。
              // var s=getLoginParams(to.path);
              localStorage.setItem( result.data.IPORTAL_API.split('://')[1]+'/',JSON.stringify(s));
              store.dispatch('SetInfo', { 'token': access_token,'token_type':s.token_type }).then((data) => {
                store.dispatch('GetInfo').then(res=>{
                  window.sessionStorage.setItem('iportalUser',JSON.stringify(res));
                  window.localStorage.setItem('iportalUser',JSON.stringify(res));
                  next('/srcIndex');
                }).catch(err=>{
                  next('/srcIndex');
                })
              });
            } else {//如果获取失败则返回到资源首页
               next('/srcIndex');
            }
          }else{
            //没有state值，说明是在iportal端的统一登录页登录的。
            //获取token
            getToken(result.data).then(tokenObj => {
              if (tokenObj) {
                const access_token = tokenObj.access_token;
                const token_type = tokenObj.token_type;
                if (access_token) {
                  store.dispatch('SetInfo', { 'token': access_token, 'token_type': token_type }).then((data) => {
                    next();
                  });
                } else {
                  window.location.href = result.data.IPORTAL_API_1;
                }
              } else {
                window.location.href = result.data.IPORTAL_API_1;
              }
            });
          }
        }
      }
    }).catch((error)=>{
      console.log(error)
    });
  }
});

router.afterEach(() => {
    NProgress.done();
});


// 生产环境错误日志
if (process.env === 'production') {
  Vue.config.errorHandler = function(err, vm) {
    console.log(err, window.location.href);
    errLog.pushLog({
      err,
      url: window.location.href,
      vm
    })
  };
}



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
