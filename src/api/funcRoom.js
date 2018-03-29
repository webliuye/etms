import { fetch } from 'utils/fetch';

// 获取功能室列表   
export function getFuncRoomList(data) {
  return fetch({
    url: '/api/multiroomRecord',
    method: 'get',
    params: data
  });
}
// 获取教室 
export function getMultiRoom(data) {
  return fetch({
    url: '/api/multiroomRecord/roomstate',
    method: 'get',
    params: data
  });
}
// 删除功能室
export function deleteFuncRoom(id) {
  return fetch({
    url: '/api/multiroomRecord/'+id,
    method: 'DELETE'
  });
}
// 添加功能室
export function addFuncRoom(data) {
  return fetch({
    url: '/api/multiroomRecord',
    method: 'post',
    data: data
  });
}
// 修改功能室
export function updateFuncRoom(data) {
  return fetch({
    url: '/api/multiroomRecord/' + data.id,
    method: 'PATCH',
    data: data
  });
}
//获取当前天的信息
export function getDayFunclist(data) {
  return fetch({
    url: '/api/multiroomRecord/findOneDay' ,
    method: 'get',
    params: data
  });
}
 

