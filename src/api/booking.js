import { fetch } from 'utils/fetch';


// 获取实验预约列表 
export function getBookingList(data) {
  return fetch({
    url: '/api/bookings/me',
    method: 'get',
    params: data
  });
}


// 获取老师计划
export function getPlansme(data) {
  return fetch({
    url: '/api/plans/me',
    method: 'get',
    params: {year:data}
  });
}


// 新增预约获取计划详情
export function getPlanDetail(data) {	
  return fetch({
    url: "/api/plan-details/plans/"+data.planId+"/details/me",
    method: 'get',
    params: data
  });
}

// 预约获取实验详情
export function getDetails(id) {	
  return fetch({
    url: "/api/plan-details/"+id,
    method: 'get'
  });
}

// 预约获取所带班级
export function getClassInfos(id) {	
  return fetch({
    url: "/api/class-infos/me",
    method: 'get',
    params:id
  });
}

// 预约实验
// export function myBooking(data) {	
//   return fetch({
//     url: "/api/bookings/plan-details",
//     method: 'post',
//     data:data
//   });
// }

// 删除预约实验
export function delBooking(data) {	
  return fetch({
    url: "/api/bookings/"+data,
    method: 'delete'
  });
}

// 修改预约实验
export function reviseBooking(data) {	
  return fetch({
    url: "/api/bookings/",
    method: 'patch',
    data:data
  });
}

// 获取预约次数 信息
export function getAllBooking(data) { 
  return fetch({
    url: "/api/courses/me",
    method: 'get',
    params:{planDetailId:data}
  });
}


// 获取仪器信息
export function getEquipment(data) { 
  return fetch({
    url: "/api/catalogueItems/me",
    method: 'get',
    params:data
  });
}

// 修改仪器信息
export function reviseEquipment(id) { 
  return fetch({
    url: "/api/etEquipment/equipment",
    method: 'get',
    params:id
  });
}


// 查询我的预约信息
export function getMyBookingInfo(id) { 
  return fetch({
    url: "/api/bookings/teacher-bookinginfo",
    method: 'get',
    params:id
  });
}


// 老师预约
export function myBookingInfo(data) { 
  return fetch({
    url: "/api/bookings/teacher-bookingreg",
    method: 'post',
    data:data
  });
}