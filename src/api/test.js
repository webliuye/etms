import { fetch } from 'utils/fetch';
import { fetch4 } from 'utils/fetch';

// 生成试卷  
export function produceTest(api) {
  return fetch({
    url: api,
    method: 'get'
  });
}

// 参加自测  
export function getTest(data) {
  return fetch4({
    url: '/api/test/self/v1',
    method: 'post',
    params: data
  });
}

// 获取自测记录 
export function getTestRecord(data) {
  return fetch({
    url: '/api/test/self/',
    method: 'get',
    params: data
  });
}
// 获取自测统计报表
export function getTestCount(data) {
  return fetch({
    url: '/api/test/self-report/testSelfReport',
    method: 'get',
    params: data
  });
}
// 获取统计图数据
export function getTestMap(data) {
  return fetch({
    url: '/api/test/self-report/testSelfReportNumByMonth',
    method: 'get',
    params: data
  });
}


// 增加试题 
export function addTestProblem(data) {
  return fetch({
    url: '/api/test/question/add',
    method: 'post',
    data:data
  });
}



// 查找试题列表
export function getTestProblemList(data) {
  return fetch({
    url: '/api/test/question/all',
    method: 'get',
    params:data
  });
}


// 删除单个试题
export function deleteTest(id) {
  return fetch({
    url: '/api/test/question/remove/' + id,
    method: 'delete'
  });
}


// 上下架
export function changeTestStatus(data) {
  return fetch({
    url: '/api/test/question/update/' + data.id,
    method: 'patch',
    params:data
  });
}

// 批量上下架
export function changeManyStatus(data) {
  return fetch({
    url: '/api/test/question/updateBatch/' + data.status,
    method: 'patch',
    data:data
  });
}

// 查找试题信息
export function getTestInfo(id) {
  return fetch({
    url: '/api/test/question/find/' + id,
    method: 'get'
  });
}

// 修改试题
export function reviseTestInfo(data) {
  return fetch({
    url: '/api/test/question/update/' + data.id,
    method: 'post',
    data:data
  });
}


// 获取试卷
export function getTestPaper(api) {
  return fetch({
    url: api,
    method: 'get'
  });
}

// 获取继续试卷
export function getTestContinuePaper(id) {
  return fetch({
    url: '/api/test/self/' + id,
    method: 'get'
  });
}

// 交卷
export function handTest(data) {
  return fetch({
    url: '/api/test/self/' + data.testSelfId + '/' + data.status,
    method: 'put',
    data:data.data
  });
}

// 交卷结果
export function handTestResult(id) {
  return fetch({
    url: '/api/test/self/' + id + '/result',
    method: 'get'
  });
}

// 获取试题数量
export function getTestNumberCount(data) {
  return fetch({
    url: '/api/test/question/count',
    method: 'get',
    params: data
  });
}