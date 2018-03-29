import { fetch } from 'utils/fetch';

// 获取实验安排列表   
export function getArrangeList(data) {
  return fetch({
    url: '/api/bookings',
    method: 'get',
    params: data
  });
}
// 获取实验安排详情   
export function getArrangeDetail(data) {
  return fetch({
    url: "/api/bookings/manager-arangeinfo",
    method: 'get',
    params:data
  });
}
// 获取可以使用教室
export function getUseArea(data) {
  return fetch({
    url: '/api/bookings/isuse',
    method: 'get',
    params: data
  });
}

// 添加实验安排
export function addArrange(data) {
  return fetch({
    url: '/api/bookings/manager-arangereg',
    method: 'post',
    data: data
  });
}

// 获取实验记录列表
export function getRecordList(data) {
  return fetch({
    url: '/api/class-infos/grade',
    method: 'get',
    params: data
  });
}

// 获取老师
export function getunitStaff() {
  return fetch({
    url: '/api/staffs/class-teacher',
    method: 'get'
  });
}
