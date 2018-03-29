import { fetch } from 'utils/fetch';

// 获取实验计划列表
export function getPlansMe(data) {
  return fetch({
    url: '/api/plans/me',
    method: 'get',
    params: data
  });
}
// 获取实验日志班级表头   
export function getLogHeader(data) {
  return fetch({
    url: '/api/logs/header/me',
    method: 'get',
    params: data
  });
}
// 获取实验日志列表   
export function getLogList(data) {
  return fetch({
    url: '/api/logs/body/me',
    method: 'get',
    params: data
  });
}

// 获取实验日志详情
export function getLogDetail(id) {
  return fetch({
    url: '/api/logs/' + id,
    method: 'get'
  });
}

//获取装备目录
export function getEquipmentList(id) {
  return fetch({
    url: '/api/catalogueItems/' + id,
    method: 'get'
  });
}
// 获取授课老师
export function getStaffsMe(id) {
  return fetch({
    url: '/api/staffs/selectme',
    method: 'get'
  });
}
export function getLogPlanDetails(id) {
  return fetch({
    url: '/api/plan-details/' + id + '/details',
    method: 'get'
  });
}

// 添加实验日志
export function addLog(data) {
  return fetch({
    url: '/api/logs',
    method: 'post',
    data: data
  });
}
// 修改实验日志
export function updateLog(data) {
  return fetch({
    url: '/api/logs/' + data.id,
    method: 'PATCH',
    data: data
  });
}
// 删除实验日志
export function deleteLog(data1,data2) {
  return fetch({
    url: '/api/logs/'+data1,
    method: 'DELETE',
    params:data2
  });
}

// 删除单个实验日志
export function deleteOneLog(data) {
  return fetch({
    url: '/api/courses/del-staff',
    method: 'DELETE',
    params:data
  });
}


