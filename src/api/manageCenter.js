import { fetch } from 'utils/fetch';

// 获取教室列表 
export function getClassRoomList(data) {
    return fetch({
        url: '/api/classrooms',
        method: 'get',
        params: data
    });
}

// 删除教室 
export function deleteClassRoom(id) {
    return fetch({
        url: '/api/classrooms/' + id,
        method: 'DELETE'
    });
}

// 修改教室 
export function reviseRoom(data) {
    return fetch({
        url: "/api/classrooms/" + data.id,
        method: 'patch',
        data: data
    });
}

// 新增教室 
export function addRoom(data) {
    return fetch({
        url: "/api/classrooms",
        method: 'post',
        data: data
    });
}

// 获取教师信息列表
export function getTeacher(data) {
    return fetch({
        url: '/api/staffs/staffs',
        method: 'get',
        params: data
    });
}


// 获取班级信息列表
export function getClass(data) {
    return fetch({
        url: '/api/class-infos/grade',
        method: 'get',
        params: data
    });
}

// 删除班级
export function deleteClass(row) {
    return fetch({
        url: "/api/class-infos/" + row.classId,
        method: 'DELETE'
    });
}

// 强制删除班级
export function deleteClassTrue(row) {
    return fetch({
        url: "/api/class-infos/del/" + row.classId,
        method: 'DELETE'
    });
}

// 修改班级信息
export function reviseClass(data) {
    return fetch({
        url: '/api/class-infos/' + data.classId,
        method: 'patch',
        data: data
    });
}

// 新增单个班级信息
export function addClass(data) {
    return fetch({
        url: '/api/class-infos/classinfo',
        method: 'post',
        data: data
    });
}

// 批量新增班级信息
export function addMoreClass(data) {
    return fetch({
        url: '/api/class-infos/batch-add',
        method: 'post',
        data: { 'data': data }
    });
}

// 批量新增班级信息
export function addManyClass(data) {
    return fetch({
        url: '/api/class-infos/batch-add',
        method: 'post',
        data: data
    });
}
// 获取个人信息
export function getInfo(data) {
    return fetch({
        url: '/api/staffs/staffinfo',
        method: 'get',
        params:data
    });
}

// 获取所带班级
export function getMineClass(data) {
    return fetch({
        url: '/api/class-infos/grades',
        method: 'get',
        params: data
    });
}

// 修改个人信息班级信息
export function reviseMineInfo(data,id) {
    return fetch({
        url: '/api/staffs',
        method: 'patch',
        data: data,
        params:{staffId:id}
    });
}

// 获取所带科目
export function getStaffSubject(data) {
    return fetch({
        url: '/api/staffs/mgt/me',
        method: 'get',
        params:data
    });
}

// 修改所带科目
export function reviseStaffSubject(data,id) {
    return fetch({
        url: '/api/staffs/mgt/me',
        method: 'post',
        data: { ids: data},
        params: {staffId:id }
    });
}


//新增用户
export function addNewUser(data) {
 return fetch({
  url: '/api/staffs/newStaff',
    method: 'post',
    data:data
 });
}


//根据年级查询教室所带班级
export function getGradeClass(data) {
 return fetch({
  url: '/api/staffs/class-staff-table',
    method: 'get',
    params: {gradeId: data}
 });
}


//设置所带班级
export function setStaffClass(data) {
 return fetch({
  url: '/api/staffs/class-staff-related',
    method: 'post',
    params: data
 });
}

//获取所有老师
export function getAllTeacher(data) {
  return fetch({
    url: '/api/staffs/teachers ',
    method: 'get'
 });
}
