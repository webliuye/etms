import { fetch } from 'utils/fetch';

// 查询我的计划(包括 学校管理员、实验管理员、授课老师)  
export function getIndexPlan(data) {
  return fetch({
    url: '/api/plans/my-plan',
    method: 'get',
    params: data
  });
}
// 查询我的待安排(实验管理员)
export function getTesterPlan() {
  return fetch({
    url: '/api/bookings/manager-aranges',
    method: 'get'
  
  });
}


//实验预约信息列表(授课老师) 
export function getBookingList(data) {
  return fetch({
    url: '/api/bookings/teacher-bookings',
    method: 'get',
    params:data
  });
}

//查询预约信息（根据计划ID）
export function getBookingInfo(id) {
  return fetch({
    url: '/api/bookings/teacher-bookinginfo',
    method: 'get',
    params:{planDetailId:id}
  });
}

//查询我的安排信息列表(授课老师) 
export function getArrangeList(data) {
  return fetch({
    url: '/api/bookings/teacher-aranges',
    method: 'get',
    params:data
  });
}

//删除预约,包括（预约未成功、预约未处理）(授课老师) 
export function deleteBook(id) {
  return fetch({
    url: '/api/bookings/teacher/' + id,
    method: 'DELETE'
  });
}

//根据课程ID查询实验登记数据
export function getLogInfo(id) {
  return fetch({
    url: '/api/bookings/teacher-courseinfo',
    method: 'get',
    params:{courseId:id}
  });
}

//根据课程ID查询实验登记数据
export function addLogInfo(data) {
  return fetch({
    url: '/api/bookings/teacher-logreg',
    method: 'post',
    data:data
  });
}


//实验登记列表数据
export function getLogInfoList(data) {
  return fetch({
    url: '/api/bookings/teacher-logs',
    method: 'get',
    params:data
  });
}


//实验登记修改数据
export function reviseLogInfo(data) {
  return fetch({
    url: '/api/bookings/teacher-logmodify',
    method: 'post',
    data:data
  });
}


//实验登记修改获取数据
export function reviseGetLogInfo(id) {
  return fetch({
    url: '/api/bookings/teacher-courseloginfo',
    method: 'get',
    params:{courseId:id}
  });
}

//实验登记修改获取数据
export function reviseBookingInfo(data) {
  return fetch({
    url: '/api/bookings/teacher-bookingmodify',
    method: 'patch',
    data:data
  });
}

//获取当前学年计划
export function getPlan() {
  return fetch({
    url: '/api/plans/teacher-plan',
    method: 'get'
  });
}

//查询教师首页计划、预约、安排、登记（统计数据）
export function getPlanCount(id) {
  return fetch({
    url: '/api/schoolhome/select-teacherreport',
    method: 'get',
    params:{planId:id}
  });
}

//查询教师首页计划、预约、安排、登记（统计数据）
export function getOtherPlanCount(data) {
  return fetch({
    url: '/api/schoolhome/select-teacherreport',
    method: 'get',
    params:data
  });
}

//首页 - 实验计划开出完成度
export function getPlanOpenCount() {
  return fetch({
    url: 'api/plan/report',
    method: 'get'
  });
}

//首页 - 实验计划班级开出完成度
export function getClassOpenCount(data) {
  return fetch({
    url: '/api/plan/reportClass',
    method: 'get',
    params:data
  });
}

//首页 获取当前学校 开学日期的接口
export function getOpenDate() {
  return fetch({
    url: '/api/schoolOpendate/school-selectopendate',
    method: 'get'
  });
}

//首页 获取当前学校 开学日期的接口
export function setOpenDate(data) {
  return fetch({
    url:'/api/schoolOpendate/school-setopendate',
    method: 'post',
    data:data
  });
}


//获取省市县实验开出率
export function getMangeOpenDate(data) {
  return fetch({
    url: '/api/experiment-report/report-total-rate',
    method: 'get',
    params:data
  });
}


//获取省市县实验科目开出率
export function getSubjectOpenDate(data) {
  return fetch({
    url: '/api/experiment/report-subject-rate',
    method: 'get',
    params:data
  });
}

//获取省市县实验开出率排行
export function getAllOpenDate(data) {
  return fetch({
    url: '/api/experiment-report/report-rate-rank',
    method: 'get',
    params:data
  });
}

//获取学校实验开出率
export function getSchoolOpenDate(data) {
  return fetch({
    url: '/api/experiment/school-report-rate',
    method: 'get',
    params:data
  });
}


//功能室统计报表
export function getAllRoomCount(data) {
  return fetch({
    url: '/api/multiroomreport/all',
    method: 'get',
    params:data
  });
}

//功能室统计报表详细
export function getRoomCountDetail(data) {
  return fetch({
    url: '/api/multiroomreport/detail',
    method: 'get',
    params:data
  });
}


//行管获取日志详情
export function getManageLogDetail(id) {
  return fetch({
    url: '/api/bookings/manager-courseinfo',
    method: 'get',
    params:{courseId:id}
  });
}


//功能室使用统计学校端表格
export function getFuncRommTable(data) {
  return fetch({
    url: '/api/multiroomRecord/report/school/table',
    method: 'get',
    params:data
  });
}

//获取当前用户未阅读的公告信息
export function getNotice() {
  return fetch({
    url: '/api/staffNotice',
    method: 'get'
  });
}

//权限管理
export function getSecurityBtn() {
  return fetch({
    url: '/api/security/buttons',
    method: 'get'
  });
}


//查询当前用户所带科目的所有老师
export function getOwnStaffs() {
  return fetch({
    url: '/api/staffs/project-staffs',
    method: 'get'
  });
}

//查询某老师在当前用户（学校管理员、超级实验管理员）所带科目的计划
export function getOwnStaffsSubject(data) {
  return fetch({
    url: '/api/plans/teacher-subject-plan',
    method: 'get',
    params:data
  });
}


//导出实验记录
export function downloadLogs(data) {
  return fetch({
    url: '/api/courses/export',
    method: 'post',
    params:data
  });
}

//导出实验记录进度
export function downloadProgress(token) {
  return fetch({
    url: '/api/courses/export/' + token + '/progress',
    method: 'get'
  });
}

//导出实验记录压缩包
export function downloadZip(token) {
  return fetch({
    url: '/api/courses/export/' + token + '/zip',
    method: 'get'
  });
}


//单个导出实验记录压缩包
export function downloadSelectZip(token) {
  return fetch({
    url: '/api/courses/export/' + token,
    method: 'get'
  });
}



//设置经纬度
export function setLngLat(data) {
  return fetch({
    url: '/api/org/location/add',
    method: 'get',
    params: data
  });
}

//获取经纬度
export function getLngLat(data) {
  return fetch({
    url: '/api/org/location/find-all',
    method: 'get',
    params: data
  });
}