import { getMenuInfo } from 'api/menuAPI';
import Cookies from 'js-cookie';

const menu = {
  state: {
    menuInfo: null,
    menuData:null
  },

  mutations: {
    SET_MENU: (state, menu) => {
      state.menuInfo = menu;
    },
    SET_MENUDATA: (state, menu) => {
      state.menuData = menu;
    }
  },

  actions: {
    // 
    GetMenu({ commit, state}, token) {
      return state.menuInfo !== null ?
      Promise.resolve(state.menuInfo) :
      new Promise((resolve, reject) => {
        getMenuInfo(token).then(response => {
          const data = response;
          var menuArray = [],
          menu = response,
          len=menu.length,
          i;
          for(i=0;i<len;i++){
            if(menu[i].href){
              menuArray.push(menu[i].href);
            }else if(menu[i].children){
              var j,jMenu = menu[i].children,jLen = jMenu.length;
              for(j=0;j<jLen;j++){
                if(jMenu[j].href){
                  menuArray.push(jMenu[j].href);
                }
              }
            }
          }
          menuArray.push('error');
          menuArray.push('historySave');
          commit('SET_MENUDATA', menuArray);
          commit('SET_MENU', data);
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    }
  }
};

export default menu;