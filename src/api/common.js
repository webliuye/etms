import { fetch } from 'utils/fetch';
import { fetch1 } from 'utils/fetch';

//获取当年学年信息
export function getYear() {
  return fetch({
    url: '/api/plans/year',
    method: 'get'
  });
}

//获取学年信息
export function getMineYear() {
  return fetch({
    url: '/api/plans/years/me',
    method: 'get'
  });
}

//获取所带班级
export function getMineClass() {
	return fetch({
		url: '/api/class-infos/user_id/me',
		method: 'get'
	});
}

//获取管理端学年信息
export function getGuideYears(){
	return fetch({
		url: '/api/plans/years',
		method: 'get'
	});
}
//获取科目
export function getSubject(data) {
	return fetch({
		url: '/api/dicts/subjects',
		method: 'get',
    params: {gradeId: data}
	});
}
//获取年级信息
export function getGrade(data) {
	return fetch({
		url: '/api/dicts/grades',
		method: 'get',
		params: { "subject": data }
	});
}
//实验计划获取年级信息
export function getplanGrade(data) {
	return fetch({
		url: '/api/dicts/gradesJudge',
		method: 'get',
		params:data
	});
}

//获取学期
export function getTerm(){
	return fetch({
		url: '/api/dicts/4',
		method: 'get'
	});
}


//获取实验类型
export function getType() {
	return fetch({
		url: '/api/dicts/ettype',
		method: 'get'
	});
}

//获取开课方式
export function getCourse() {
	return fetch({
		url: '/api/dicts/6',
		method: 'get'
	});
}

// 获取学段信息
export function getStage() {
  return fetch({
    url: '/api/dicts/1',
    method: 'get'
  });
}

// 获取教程版本列表
export function getTeach() {
  return fetch({
    url: '/api/dicts/7',
    method: 'get'
  });
}
//获取所有教室种类
export function getClassRooms() {
	return fetch({
		url: '/api/dicts/8',
		method: 'get'
	});
}
// 获取上课节次列表
export function getClassTime() {
  return fetch({
    url: '/api/dicts/9',
    method: 'get'
  });
}
// 获取资源类型
export function getAllSourceType() {
  return fetch({
    url: '/api/dicts/22',
    method: 'get'
  });
}
// 获取实验员
export function getStaffg(data) {
  return fetch({
    url: '/api/staffs/etstaff',
    method: 'get',
    params:data
  });
}

// 获取所有实验员
export function getAllStaffg() {
  return fetch({
    url: '/api/staffs/getet',
    method: 'get'
  });
}

// 父节点信息
export function getParentInfo() {
  return fetch({
    url: '/api/security/parent-orgs',
    method: 'get'
  });
}


// 获取资产属性
export function gettypeValue() {
  return fetch({
    url: '/api/dicts/10',
    method: 'get'
  });
}

// 是否与装备打通
export function getEquipSys() {
  return fetch({
    url: '/api/dicts/getems',
    method: 'get'
  });
}

//获取学段
export function getSections() {
  return fetch({
    url: '/api/dicts/sections',
    method: 'get'
  });
}

//获取省市县树
export function getTreeData(data) {
 return fetch({
  url: '/api/dicts/manager-orgtree',
    method: 'get',
    params:data
 });
}

// 获取资源类型
export function getSourceType() {
  return fetch({
    url: '/api/dicts/22',
    method: 'get'
  });
}


// 获取上传文件类型
export function getUploadType() {
  return fetch({
    url: '/api/dicts/23',
    method: 'get'
  });
}

// 获取题型类别
export function getProblemType() {
  return fetch({
    url: '/api/dicts/24',
    method: 'get'
  });
}


// 获取版本树数据
export function getVersionDataTree(data) {
  return fetch({
    url: '/api/catalogues/group',
    method: 'get',
    params: data
  });
}


// 获取标题
export function getTitle() {
  return fetch({
    url: '/api/sys/sys-title',
    method: 'get'
  });
}


// 未登录获取标题
export function getNojoinTitle() {
  return fetch1({
    url: '/pub/cros/notices/sys-title',
    method: 'get'
  });
}
