import { fetch } from 'utils/fetch';

//获取品目信息
export function getEquipItem(data) {
  return fetch({
    url: '/api/equipmentItems',
    method: 'get',
    params:data
  });
}

//获取学校端仪器统计信息
export function getEquipCount(data) {
  return fetch({
    url: '/api/equipmentreport/schoolreport',
    method: 'get',
    params:data
  });
}

//是否启用装备系统
export function getEquipSys() {
  return fetch({
    url: '/api/dicts/getems',
    method: 'get'
  });
}

//获取管理端仪器统计信息
export function getGuideEquipCount(data) {
  return fetch({
    url: '/api/equipmentreport/management-report',
    method: 'get',
    params:data
  });
}