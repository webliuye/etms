import { fetch } from 'utils/fetch';

// 获取实验计划列表   
export function getPlanList(data) {
  return fetch({
    url: '/api/plans',
    method: 'get',
    params: data
  });
}
export function publishPlan(data) {
  return fetch({
    url: '/api/plans',
    method: 'PATCH',
    params: data
  });
}
// 删除实验计划
export function deletePlan(data) {
  return fetch({
    url: '/api/plans/del',
    method: 'DELETE',
    params:data
  });
}
// 添加实验计划
export function addPlan(data) {
  return fetch({
    url: '/api/plans',
    method: 'post',
    data: data
  });
}
// 修改实验计划
export function updatePlan(data) {
  return fetch({
    url: '/api/plans/' + data.id,
    method: 'PATCH',
    data: data
  });
}
// 获取实验计划信息   
export function getPlanInfo(id) {
  return fetch({
    url: '/api/plans/' + id,
    method: 'get'
  });
}
// 获取实验计划详情列表   
export function getPlanDetails(id, data) {
  return fetch({
    url: '/api/plans/' + id + '/details',
    method: 'get',
    params: data
  });
}
// 添加实验计划详情  
export function addPlanDetails(id, data) {
  return fetch({
    url: '/api/plan-details/' + id + '/details',
    method: 'post',
    data: data
  });
}
// 删除实验计划详情内容
export function deletePlanDetails(id) {
  return fetch({
    url: '/api/plan-details/'+id,
    method: 'DELETE'
  });
}
// 批量添加实验计划详情列表
export function batchAddPlan(id,data) {
  return fetch({
    url: '/api/plan-details/' + id + '/batch-add',
    method: 'post',
    data: data
  });
}
// 批量修改实验计划详情列表
export function batchUpdatePlan(data) {
  return fetch({
    url: '/api/plan-details/batch-update',
    method: 'post',
    data: data
  });
}
// 获取实验计划详情预览
export function getPlanPreview(id) {
  return fetch({
    url: '/api/plan-details/' + id,
    method: 'get'
  });
}
// 修改实验计划详情内容
export function updatePlanDetails(data) {
  return fetch({
    url: '/api/plan-details/' + data.id,
    method: 'PATCH',
    data: data
  });
}

// 查询主题下面的标准目录

export function getPlanDetailsMore(data) {
  return fetch({
    url: '/api/catalogues/compatible',
    method: 'get',
    params: data
  });
}

// 查询授课老师实验计划（根据计划ID分页）
export function getMyPlanDetails(data) {
  return fetch({
    url: '/api/plans/teacher-plandetail',
    method: 'get',
    params: data
  });
}


// 批量删除计划明细 
export function deletePlanDetailsMore(data) {
  return fetch({
    url: '/api/plan-details/batch-delete',
    method: 'post',
    data: data
  });
}


// 强制删除实验计划
export function deletePlanSure(data) {
  return fetch({
    url: '/api/plans/del/sure',
    method: 'DELETE',
    params:data
  });
}
