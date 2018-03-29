import { fetch } from 'utils/fetch';

// 获取公告列表   
export function getNoticeList(data) {
  return fetch({
    url: '/api/notices',
    method: 'get',
    params: data
  });
}
// 获取公告列表   
export function getNoticeDetail(id) {
  return fetch({
    url: '/api/notices/'+id,
    method: 'get'
  });
}


// 删除公告
export function deleteNotice(id) {
  return fetch({
    url: '/api/notices/'+id,
    method: 'DELETE'
  });
}
// 添加公告
export function addNotice(data) {
  return fetch({
    url: '/api/notices',
    method: 'post',
    data: data
  });
}
export function staffNoticeChange(id) {
  return fetch({
    url: '/api/staffNotice/'+id,
    method: 'post'

  });
}