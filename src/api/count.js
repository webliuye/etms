import { fetch } from 'utils/fetch';

// 获取功能室统计数据
export function getFuncCount(data) {
  return fetch({
    url: '/api/multiroomRecord/report/school',
    method: 'get',
    params: data
  });
}

// 获取管理端功能室统计数据
export function getRoomCount(data) {
	return fetch({
		url: '/api/multiroomreport',
		method: 'get',
		params: data
	});
}

export function getGuideYears(n){
	return fetch({
		url: '/api/plans/years',
		method: 'get',
    params: {n: n}
	})
}

export function getInfo() {
	return fetch({
		url: '/api/security/children-orgs',
		method: 'get'
	});
}

export function getStaffCount(data) {
	return fetch({
		url: '/api/experiment/open-staff',
		method: 'get',
		params:data
	});
}
export function getGradeCount(data) {
	return fetch({
		url: '/api/experiment/open-grade',
		method: 'get',
		params:data
	});
}

export function getRank(data) {
	return fetch({
		url: '/api/report/open-rank-detail',
		method: 'get',
		params: data
	});
}

export function getRankDetail(data) {
	return fetch({
		url: '/api/report/open-detail',
		method: 'get',
		params: data
	});
}

export function getCondit(data) {
	return fetch({
		url: '/api/experiment/open-school',
		method: 'get',
		params: data
	});
}
//获取
export function getDetailCondit(data) {
	return fetch({
		url: '/api/report/open-countyschooldetail',
		method: 'get',
		params: data
	});
}
//区县级实验开出情况统计
export function getSchoolCondit(data) {
	return fetch({
		url: 'api/report/open-countyschool',
		method: 'get',
		params: data
	});
}

export function getOpenRecord(data) {
	return fetch({
		url: '/api/report/open-schooldetail',
		method: 'get',
		params: data
	});
}
//导出
export function getDownload(data) {
	return fetch({
		url: '/api/report/open-schoolExcel',
		method: 'get',
		params: data
	});
}

//学校开出统计
export function getSchoolOpen(data) {
	return fetch({
		url: '/api/report/school-open-rank-detail',
		method: 'get',
		params: data
	});
}

//下载
export function getDownload2(data) {
	return fetch({
		url: '/api/proxy/download',
		method: 'get',
		params: data
	});
}

//实验记录
export function getRecord(data) {
	return fetch({
		url: '/api/courses',
		method: 'get',
		params: data
	});
}

// 获取首页个人信息
export function getMineData() {
  return fetch({
    url: '/api/staffs/terchersummary',
    method: 'get'
  });
}

// 获取管理员信息
export function getManageData() {
  return fetch({
    url: '/api/staffs/adminsummary',
    method: 'get'
  });
}

// 学校端开出统计
export function getSchoolOpenData(data) {
  return fetch({
    url: '/api/report/school-log-report',
    method: 'get',
    params:data
  });
}


// 管理端开出统计
export function getRankData(data) {
  return fetch({
    url: '/api/report/log-report',
    method: 'get',
    params:data
  });
}

// 父节点信息
export function getParentInfo() {
  return fetch({
    url: '/api/security/parent-orgs',
    method: 'get'
  });
}


// 按学校统计开出率/分学段
export function getSchoolOpenCount(data) {
  return fetch({
    url: '/api/experiment/county-school-section-report',
    method: 'get',
    params:data
  });
}

// 按学校统计开出率/分学段
export function getSchoolDetailOpenCount(data) {
  return fetch({
    url: '/api/experiment/county-school-grade-report',
    method: 'get',
    params:data
  });
}

// 按学校统计开出率/分学段
export function getSubjectOpenCount(data) {
  return fetch({
    url: '/api/experiment/county-subject-report',
    method: 'get',
    params:data
  });
}


// 按实验目录统计开出率
export function getGuideOpenCount(data) {
  return fetch({
    url: '/api/experiment/county-catalogue-report',
    method: 'get',
    params:data
  });
}

// 按学段统计开出率
export function getGradeOpenCount(data) {
  return fetch({
    url: '/api/experiment/county-section-report',
    method: 'get',
    params:data
  });
}
// 按学段统计开出率
export function getClassOpenCount(data) {
  return fetch({
    url: '/api/experiment/school-class-subject',
    method: 'get',
    params:data
  });
}


// 首页开出率统计
export function openCountAll(data) {
  return fetch({
    url: '/api/experiment/report',
    method: 'get',
    params:data
  });
}

// 首页开出率统计
export function getOpenCountTop10() {
  return fetch({
    url: '/api/experiment/top10',
    method: 'get'
  });
}

// 开出率统计表格
export function getOpenCountAllTable(data) {
  return fetch({
    url: '/api/experiment/rank',
    method: 'get',
    params:data
  });
}


// 历史数据封存
export function saveHistoryData() {
  return fetch({
    url: '/api/history/transfer',
    method: 'post'
  });
}


// 删除毕业班级
export function deleteLastClass() {
  return fetch({
    url: '/api/history/graduation',
    method: 'post'
  });
}


// 目录二级页面
export function getGuideTwoClass(data) {
  return fetch({
    url: '/api/experiment/catalogue-school-report',
    method: 'get',
    params: data
  });
}

// 目录三级页面
export function getGuideThreeClass(data) {
  return fetch({
    url: '/api/experiment/catalogue-class-report',
    method: 'get',
    params: data
  });
}

// 学校统计三级页面
export function getSchoolThreeClass(data) {
  return fetch({
    url: '/api/experiment/county-school-class',
    method: 'get',
    params: data
  });
}

export function getSchoolThreeData(data) {
  return fetch({
    url: '/api/experiment/county-school-grade-subject-report',
    method: 'get',
    params: data
  });
}

export function getCountByYearsData(data) {
  return fetch({
    url: '/api/experiment/school-subject-grade-year',
    method: 'get',
    params: data
  });
}