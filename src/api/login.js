import {_fetch, fetch, fetch2 } from 'utils/fetch';
import qs from 'qs';

export function loginByUserName(username, password, vcode) {
  const data = {
    username,
    password,
    vcode
  };
  return _fetch({
    url: '/login',
    method: 'post',
    params: data
  });
}

export function loginByToken(clientId, state, redirectUri) {
  const data = {
    clientId,
    state,
    redirectUri
  };
  return _fetch({
    url: '/auth/implicit/token',
    method: 'post',
    params: data
  });
}

export function logout() {
  return fetch2({
    url: '/manage/pub/loginout',
    method: 'post'
  });
}


export function getInfo() {
  return fetch({
    url: '/api/security/user-info',
    method: 'get'
  });
}
export function setInfostate() {
  return fetch({
    url: '/api/schoolhome/select-setstate',
    method: 'get'
  });
}
