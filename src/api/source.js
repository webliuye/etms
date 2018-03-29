import { fetch1 } from 'utils/fetch';
import { fetch } from 'utils/fetch';

// 我的收藏
export function getCollectList(data) {
  return fetch({
    url: '/api/ersCollection/all',
    method: 'get',
    params: data
  });
}

// 取消收藏
export function cancelCollect(id) {
  return fetch({
    url: '/api/ersCollection/cancel',
    method: 'get',
    params: {resourceId:id}
  });
}
// 收藏资源
export function sourceCollect(id) {
  return fetch({
    url: '/api/ersCollection/new',
    method: 'get',
    params: {resourceId:id}
  });
}

// 本地上传
export function uploadSource() {
  return fetch({
    url: '/api/resources/upload',
    method: 'post',
    params: {resourceId:id}
  });
}

// 本地下载
export function downloadSource(resourceId) {
  return fetch({
    url: '/api/resources/' + resourceId + '/download',
    method: 'get'
  });
}

// 本地预览
export function previewSource(resourceId) {
  return fetch({
    url: '/api/resources/' + resourceId + '/preview',
    method: 'get'
  });
}

// 修改本地资源状态
export function reviseSource(data) {
  return fetch({
    url: '/api/resources/' + data.resourceId + '/status/' + data.status,
    method: 'put'
  });
}

// 批量修改本地资源状态
export function reviseManySource(data) {
  return fetch({
    url: '/api/resources/status/' + data.status,
    method: 'put',
    params:data
  });
}

// 新增或修改资源
export function addSource(data) {
  return fetch({
    url: '/api/resources/' + data.resourceId,
    method: 'put',
    data:data
  });
}

// 获取资源详情
export function getSourceDetail(resourceId) {
  return fetch({
    url: '/api/resources/' + resourceId,
    method: 'get'
  });
}

// 获取树结构
export function getoneThemeTree(data) {
  return fetch({
    url: '/api/tree-view/one-theme',
    method: 'get',
    params:data
  });
}

// 获取2级目录树结构
export function gettwoThemeTree(data) {
  return fetch({
    url: '/api/tree-view/two-theme',
    method: 'get',
    params:data
  });
}

// 获取1级主题树结构
export function getoneSectionTree(data) {
  return fetch({
    url: '/api/tree-view/section',
    method: 'get',
    params:data
  });
}

// 获取2级主题树结构
export function gettwoSectionTree(data) {
  return fetch({
    url: '/api/tree-view/subsection',
    method: 'get',
    params:data
  });
}

// 获取实验列表树结构
export function getListTree(data) {
  return fetch({
    url: '/api/tree-view/test-table',
    method: 'get',
    params:data
  });
}

// 获取资源查看列表
export function getListData(data) {
  return fetch({
    url: '/api/resources/list',
    method: 'get',
    params:data
  });
}

// 获取本地资源查看列表
export function getLocalListData(data) {
  return fetch({
    url: '/api/resources/list-user',
    method: 'get',
    params:data
  });
}


// 根据ID查询主题以及各级标准
export function getThemeGuide(data) {
  return fetch({
    url: '/api/catalogues/select-theme-guide',
    method: 'get',
    params:data
  });
}

// 获取实验关联资源类型与数量
export function getSourceTypeCount(catalogueId) {
  return fetch({
    url: '/api/resources/'+catalogueId+'/typecount',
    method: 'get'

  });
}
// 获取实验关联资源6个
export function getLinkSource(data) {
  return fetch({
    url: '/api/resources/related',
    method: 'get',
    params:data
  });
}

// 获取本地资源资源地址id
export function getLocalSourceId() {
  return fetch({
    url: '/api/id/',
    method: 'post'
  });
}

// 获取资源预览详情
export function getSourcePreviewDetail(resourceId) {
  return fetch({
    url: '/api/resources/'+resourceId+'/preview',
    method: 'get'
  });
}

// 获取资源统计表的内容
export function getSourceTable(data) {
  return fetch({
    url: '/api/ersResourceReport/report/table',
    method: 'get',
    params:data
  });
}

// 获取资源统计表的内容
export function getSourceCart(data) {
  return fetch({
    url: '/api/ersResourceReport/report/line',
    method: 'get',
    params:data
  });
}


// 推荐资源
export function recommendSource(data) {
  return fetch({
    url: '/api/resources/' + data.resourceId + '/recommend/' + data.recomLevel,
    method: 'put'
  });
}


// 资源科目
export function getSourceSubject() {
  return fetch1({
    url: '/pub/cros/catalogue/group',
    method: 'get',
    params:{groups:'subject'}
  });
}
// 获取登录后的资源科目
export function getInnerSourceSubject(data) {
  return fetch({
    url: '/api/catalogues/group',
    method: 'get',
    params:data
  });
}


// 资源类别数量统计
export function getSourceCount() {
  return fetch({
    url: '/api/resources/resource-count',
    method: 'get'
  });
}
// 资源导航链
export function getNavList(data) {
  return fetch({
    url: '/api/catalogues/guides',
    method: 'get',
    params:data
  });
}
//申请开通资源
export function opensource(data) {
  return fetch({
    url: '/api/resource/ersAccessApply',
    method: 'post',
    params:data
  });
}
//开通记录
export function getSrcRecord(data) {
  return fetch({
    url: '/api/resource/ersAccessApply/record',
    method: 'get',
    params:data
  });
}
//开通记录
export function getSrcRecordDetail(id) {
  return fetch({
    url: '/api/resource/ersAccessApply/record-sub',
    method: 'get',
    params:{packId:id}
  });
}



//获取总资源大小
export function getSourceAllSize(data) {
  return fetch({
    url: '/api/resources/size',
    method: 'get',
    params:data
  });
}
//获取公告列表
export function getNoticeList(data) {
  return fetch1({
    url: '/pub/cros/notices',
    method: 'get',
    params:data
  });
}
//获取公告详情
export function getNoticeDetail(id) {
  return fetch1({
    url: '/pub/cros/notices/'+id,
    method: 'get'
  });
}

//查询实验在当前机构使用教材对应的节编码
export function getCatalogueSection(data) {
  return fetch({
    url: '/api/catalogues/catalogue-section-code',
    method: 'get',
    params: data
  });
}
