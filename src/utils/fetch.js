import axios from 'axios';
import { Message } from 'element-ui';
import store from '../store';
import router from '../router';


export function _fetch(options) {
  return new Promise((resolve, reject) => {
    var ObjAPI = store.getters.objApi;
    const instance = axios.create({
      withCredentials: true,
      headers: { 'Authorization': 'bearer ' + store.getters.token },
      baseURL: ObjAPI.OAUTH_API, // api的base_url
      timeout: 5000                  // 请求超时时间
    });
    instance(options)
    .then(response => {
      const res = response.data;
      resolve(res);
    })
    .catch(error => {
      reject(error.response.data);
    });
  });
}
export function fetch(options) { 
  return new Promise((resolve, reject) => {
    var ObjAPI = store.getters.objApi?store.getters.objApi:JSON.parse(localStorage.getItem('ObjAPI'));
    const instance = axios.create({
      withCredentials: true,
      headers: { 'Authorization': 'bearer ' + store.getters.token },
      baseURL: ObjAPI.BASE_API, // api的base_url
      timeout: 2500000                  // 请求超时时间
    });
    // instance.interceptors.response.use(function(response){
    //   console.log(response.data.code);
    // } 
    // );
    instance(options)
    .then(response => {
      const res = response.data;
      resolve(res);
    })
    .catch(error => {
      reject(error.response?error.response.data:error.response);
      if(error.response.data.error == 'invalid_token'){
        window.localStorage.removeItem("access_token");
        window.localStorage.removeItem("token_type");
        store.state.user.userInfo={};
        store.state.user.token='';
        if(JSON.parse(localStorage.getItem('ObjAPI')).state){
          router.push({ path: '/srcIndex' })
        }else{
            Message({message:'请重新登录',type:'error'});
            window.location.href=ObjAPI.IPORTAL_API+'/login.html';
        }
        // Message({
        //   showClose: true,
        //   message: "请重新登录！",
        //   type: 'error',
        //   onClose: function(){
        //     store.dispatch('ClearToken').then(() => {
        //       router.push({ path: '/sourceIndex' });
        //       // window.location.href = ObjAPI.IPORTAL_API_1;
        //     });
        //   }
        // });
      } else {
        if (error.response.data.message && error.response.data.level === 'Common') {
          Message({
            message: error.response.data.message,
            type: 'error'
          });
        } else if (error.response.data.message && error.response.data.level === 'System') {
          Message({
            message: '服务器异常,请稍后再试',
            type: 'error'
          });
        } else {
          if (error.response.status >= 500) {
            Message({
              message: '服务器异常,请稍后再试',
              type: 'error'
            });
            console.log(error.response.data.message);
          } else if (400 <= error.response.status < 500) {
            if (error.response.status == '400') {
              Message({
                message: '前后端参数定义不一致,请检查参数',
                type: 'error'
              });
            } else if (error.response.status == '404') {
              Message({
                message: '接口未找到,请检查接口地址',
                type: 'error'
              });
            } else if (error.response.status == '405') {
              Message({
                message: '请求方法错误',
                type: 'error'
              });
            } else {
              console.log(error.response.data.message);
            }
          }
        }
      }  
    });
  });
}
export function fetch4(options) { 
  return new Promise((resolve, reject) => {
    var ObjAPI = store.getters.objApi?store.getters.objApi:JSON.parse(localStorage.getItem('ObjAPI'));
    const instance = axios.create({
      withCredentials: true,
      headers: { 'Authorization': 'bearer ' + store.getters.token },
      baseURL: ObjAPI.BASE_API, // api的base_url
      timeout: 15000                  // 请求超时时间
    });
    // instance.interceptors.response.use(function(response){
    //   console.log(response.data.code);
    // } 
    // );
    instance(options)
    .then(response => {
      const res = response.data;
      resolve(response);
    })
    .catch(error => {
      console.log(error);
      reject(error.response);
      if(error.response.data.error == 'invalid_token'){
        Message({
          message: "请重新登录！",
          type: 'error',
          onClose: function(){
            store.dispatch('ClearToken').then(() => {
              if(JSON.parse(localStorage.getItem('ObjAPI')).state){
                router.push({ path: '/srcIndex' });
              }else{
                  window.location.href=ObjAPI.IPORTAL_API+'/login.html';
              }
            });
          }
        });
      } else if(error.response.status == '500'){
        Message({
          message: '服务器内部错误',
          type: 'error'
        });
      }else if(error.response.status == '404'){
        Message({
          message: '接口未找到',
          type: 'error'
        });
      }else{
        // Message({
        //   message: error.response.data.message,
        //   type: 'error'
        // });
      }
    });
  });
}

export function fetch1(options) { 
  return new Promise((resolve, reject) => {
  
    var ObjAPI = store.getters.objApi;
    const instance = axios.create({
      withCredentials: true,
      headers: {},
      baseURL: ObjAPI.BASE_API, // api的base_url
      timeout: 15000                  // 请求超时时间
    });
    instance(options)
    .then(response => {
      const res = response.data;
      resolve(res);
    })
    .catch(error => {
      console.log(error);
    });
  });
}
export function fetch2(options) {
  return new Promise((resolve, reject) => {
    var ObjAPI = store.getters.objApi;
    const instance = axios.create({
      withCredentials: true,
      headers: { 'Authorization': 'bearer ' + store.getters.token },
      baseURL: ObjAPI.BASE_API_ROOT, // api的base_url
      timeout: 5000                  // 请求超时时间
    });
    instance(options)
    .then(response => {
      const res = response.data;
      resolve(res);
    })
    .catch(error => {
      reject(error.response.data.error);
    });
  });
}


export function getConfigJson(){
    axios.get("serverconfig.json").then((result)=>{
        console.log('read from json');
        console.log(result);
    }).catch((error)=>{console.log(error)});
}

const lyObjAPI = "http://192.168.2.222:8081/lyetms";

export function fetch10(options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      withCredentials: true,
      baseURL: lyObjAPI, // api的base_url
      timeout: 15000                  // 请求超时时间
    });
    instance(options)
    .then(response => {
      const res = response.data;
      resolve(res);
    })
    .catch(error => {
      reject(error.response.data.error);
    });
  });
}