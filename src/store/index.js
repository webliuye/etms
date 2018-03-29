import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import errorLog from './errLog'
import tagsView from './modules/tagsView'
import user from './modules/user'
import menu from './modules/menu';
import commonData from './modules/commonData';
import guide from './modules/guide';
import plan from './modules/plan';
import api from './modules/api';
import source from './modules/source';
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    errorLog,
    tagsView,
    user,
    menu,
    commonData,
    guide,
    plan,
    api,
    source
  },
  getters
})

export default store
