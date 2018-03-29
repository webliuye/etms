import { loginByUserName, loginByToken, logout, getInfo } from 'api/login';
import Cookies from 'js-cookie';
import { sha256 } from 'js-sha256';
import store from '../../store';
import router from 'router';

const user = {
  state: {
    token: null,
    userInfo: null,
    objApi:null
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo;

    },
    LOGOUT_USER: state => {
      state.user = '';
    }
  },

  actions: {
    // 邮箱登录
    LoginByUserName({ commit }, userInfo) {
      const username = userInfo.username.trim();
      const password1 = sha256(userInfo.password.trim());
      return new Promise((resolve, reject) => {
        loginByUserName(username, password1, userInfo.vcode).then(response => {
          const data = response.state;
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    },

    SetInfo({ commit ,state}, tokenInfo) {
         return new Promise((resolve, reject) => {
          // Cookies.set('X-Lianyi-Token', tokenInfo.token);
          window.localStorage.access_token = tokenInfo.token;
          window.localStorage.token_type = tokenInfo.token_type;
          commit('SET_TOKEN', tokenInfo.token);
          resolve();
      });
    },

     // 获取用户信息
    GetInfo({ commit, state }) {
      return state.userInfo != null ?
      Promise.resolve(state.userInfo) :
      new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response;
          commit('SET_USER_INFO', data);
          resolve(response);

        }).catch(error => {
          reject(error);
        });
      });
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          // commit('SET_TOKEN', '');
          // Cookies.remove('X-Lianyi-Token');

          //var ObjAPI = JSON.parse(localStorage.getItem('ObjAPI'));
          var iportal = new CrossStorageClient(store.getters.objApi.IPORTAL_API + "/token.html");
          iportal.onConnect().then(function() {
            return iportal.clear();
          }).then(function () {
            sessionStorage.clear();
            resolve();
          });
          window.localStorage.removeItem("access_token");
          window.localStorage.removeItem("token_type");
          window.localStorage.removeItem("iportalUser");
          window.sessionStorage.removeItem("iportalUser");
          window.localStorage.removeItem(window.location.host+"/iportal/");
          if(window.localStorage.getItem('expires_in')){
              window.localStorage.removeItem("expires_in");
              window.location.href=store.getters.objApi.IPORTAL_API + "/login.html";
          }else{
            window.location.href=store.getters.objApi.LOCAL_URL;
          }
          window.localStorage.removeItem("ObjAPI");
          store.state.user.token='';
        }).catch(error => {
          reject(error);
        });
      });
    },

    ClearToken({ commit, state }) {
      return new Promise((resolve, reject) => {
          // commit('SET_TOKEN', '');
          // Cookies.remove('X-Lianyi-Token');
          window.localStorage.removeItem("access_token");
          window.localStorage.removeItem("token_type");
          resolve();
      });
    }
  }
};

export default user;
