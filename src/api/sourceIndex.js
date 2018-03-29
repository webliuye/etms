import {fetch, fetch1 } from 'utils/fetch';

// 获取树结构
export function getoneThemeTree(data) {
  return fetch1({
    url: '/pub/cros/catalogue/home/one-theme',
    method: 'get',
    params:data
  });
}

// 获取2级目录树结构
export function gettwoThemeTree(data) {
  return fetch1({
    url: '/pub/cros/catalogue/home/two-theme',
    method: 'get',
    params:data
  });
}

// 获取1级主题树结构
export function getoneSectionTree(data) {
  return fetch1({
    url: '/pub/cros/catalogue/home/section',
    method: 'get',
    params:data
  });
}

// 获取2级主题树结构
export function gettwoSectionTree(data) {
  return fetch1({
    url: '/pub/cros/catalogue/home/subsection',
    method: 'get',
    params:data
  });
}

// 获取实验列表树结构
export function getListTree(data) {
  return fetch1({
    url: '/pub/cros/catalogue/home/test-table',
    method: 'get',
    params:data
  });
}
// 获取资源查看列表
export function getListData(data) {
  return fetch1({
    url: '/pub/cros/resources/home/list',
    method: 'get',
    params:data
  });
}
//获取总资源大小
export function getSourceAllSize(data) {
  return fetch1({
    url: '/pub/cros/resources/home/size',
    method: 'get',
    params:data
  });
}
// 资源类别数量统计
export function getSourceCount() {
  return fetch1({
    url: '/pub/cros/resources/home/resource-count',
    method: 'get'
  });
}

// 获取资源预览详情
export function getSourcePreviewDetail(resourceId) {
  return fetch({
    url: '/pub/cros/resources/home/'+resourceId+'/preview',
    method: 'get'
  });
}
// 根据ID查询主题以及各级标准
export function getThemeGuide(data) {
  return fetch1({
    url: '/api/catalogues/select-theme-guide',
    method: 'get',
    params:data
  });
}
// 根据ID查询主题以及各级标准
export function getRankData(data) {
  return fetch1({
    url: '/pub/cros/experiment-report/rank',
    method: 'get',
    params:data
  });
}
// 获取实验目录表
export function getTestData() {
  return fetch1({
    url: '/pub/cros/experiment-report/find-guides',
    method: 'get'
  });
}
// 获取实验开出记录
export function getTestopenData(data) {
  return fetch1({
    url: '/pub/cros/experiment-report/open-schooldetail',
    method: 'get',
    params: data
  });
}
// 实验开出预警
export function testWarnData(data) {
  return fetch1({
    url: '/pub/cros/experiment-report/open-countyschool',
    method: 'get',
    params: data
  });
}
// 获取顶级节点
export function getuserUnit() {
  return fetch1({
    url: '/pub/cros/catalogue/unit-info',
    method: 'get'
  });
}

// 获取单位目录树
export function getTreeData(data) {
  return fetch1({
    url: '/pub/cros/experiment-report/manager-orgtree',
    method: 'get',
    params: data
  });
}
// 获取实验开出情况（全部)
export function getOpenCountAllTable(data) {
  return fetch1({
    url: '/pub/cros/experiment-report/rank',
    method: 'get',
    params: data
  });
}

export function openCountAll(data) {
  return fetch1({
    url: '/pub/cros/experiment-report/report',
    method: 'get',
    params:data
  });
}

//获取省市县实验科目开出率
export function getSubjectOpenDate(data) {
  return fetch1({
    url: '/pub/cros/experiment-report/report-subject-rate',
    method: 'get',
    params:data
  });
}
//获取省市县实验科目开出率
export function getGuidesNode() {
  return fetch1({
    url: '/pub/cros/experiment-report/find-guides',
    method: 'get'
  });
}
//获取实验类型
export function getTestType() {
  return fetch1({
    url: '/pub/cros/dicts/ettype',
    method: 'get'
  });
}
//获取年级信息
export function getGrade(data) {
  return fetch1({
    url: '/pub/cros/dicts/gradesJudge',
    method: 'get',
    params:data
  });
}
//获取科目
export function getSubjects() {
  return fetch1({
    url: '/pub/cros/dicts/subjects',
    method: 'get'
  });
}
//获取学期
export function getTerm() {
  return fetch1({
    url: '/pub/cros/dicts/term',
    method: 'get'
  });
}
//获取学年信息
export function getYears() {
  return fetch1({
    url: '/pub/cros/dicts/years',
    method: 'get'
  });
}
// 获取资源类型
export function getSourceType() {
  return fetch1({
    url: '/pub/cros/dicts/src-type',
    method: 'get'
  });
}
//实验开出预警接口
export function getDetailCondit(data) {
	return fetch1({
		url: '/pub/cros/experiment-report/open-countyschooldetail',
		method: 'get',
		params: data
	});
}
//行管获取日志详情
export function getManageLogDetail(id) {
  return fetch1({
    url: '/pub/cros/experiment-report/manager-course-info',
    method: 'get',
    params:{courseId:id}
  });
}

// 获取首页版本树数据
export function getVersionDataTree(data) {
  return fetch1({
    url: '/pub/cros/catalogue/group',
    method: 'get',
    params: data
  });
}