import { getStaffg, getAllSourceType, getProblemType, getUploadType,  getYear, getMineYear, 
  getMineClass,getSections, getClassRooms, getGrade, getGuideYears, getTerm, getSubject, getType, 
  getCourse,getTeach, getClassTime,getParentInfo,gettypeValue,getEquipSys,
  getStage} from 'api/common';
import { getoneThemeTree } from 'api/source';
import { getuserUnit, getSourceType, } from 'api/sourceIndex';
import { getPlan, getOwnStaffs } from 'api/index';
import { getunitStaff } from 'api/arrange';
const commonData = {
  state: {
    stageData: [],  //学段信息
    changeBool:{
      isPlan:true,
      isBooking:false,
      isArrange:false,
      isLog:false
    },
    changeBool2:{
      isPlan:true,
      isBooking:false,
      isArrange:false,
      isLog:false
    },
    subjectGrade: {},
    gradeSubject: {},
    staffObj: {},
    handData:null,
    versionTree:null,
    isIndex:false,
    issrcIndex:false,
    userInfo:{},
    token:'',
    editPreviewData:{},
    userUnit:{
      unitId:"",
      unitName:"",
      unitType:""
    },
    years:null,
    loginshow:false,
    nowYear:'',
    mineClass:{},
    classRooms:{},
    guideYears:[],
    gradeAllData: [], //所有年级
    grade:{},
    sectionData:{},
    term:[],
    subject:[],   //科目
    type:[],
    course:[],    
    teach:[],
    classTime:[],
    baseURL:"",
    planSelect:null,
    provinceCode:null,
    guideSelect:null,
    typeValue:null,
    equipSys:null,
    twothemeId:null,
    myPlanSelect:null,
    tabAction:null,
    planId:null,
    powerBooking:false,
    powerArrang:false,
    powerNotice:false,
    powerLog:false,
    powerSource:false,
    sourceLook:false,
    staffData:null,
    ownStaff:null,
    staffName:null,
    versionData:null,     //学段版本科目信息
    sourceType:null,
    allSourceType:null,
    uploadType:[],       //上传类型
    sourceSubjectId:'',
    resourceValue:{
    },
    adminResource:{
      resourceType:'',
      sort:'sourceViewCount'
    },
    adminTestSearch:null,
    problemType:[]
  },
  mutations: {
    SET_GRADEALLDATA: (state, value) => { 
      state.gradeAllData = value;
    },
    SET_STAGEDATA: (state, value) => { 
      state.stageData = value;
    },
    SET_STAFFOBJ: (state, staffObj) => {
      state.staffObj[staffObj.subject] = staffObj.response;
    },
    SET_VERSIONTREE: (state, value) => {
      state.versionTree = value;
    },
    SET_PROBLEMTYPE: (state, value) => {
      state.problemType = value;
    },
    SET_ADMINTESTSEARCH: (state, value) => {
      state.adminTestSearch = value;
    },
    SET_SOURCESUBJECTID: (state, value) => {
      state.sourceSubjectId = value;
    },
    SET_OWNSTAFF: (state, value) => {
      state.ownStaff = value;
    },
    SET_STAFFDATA: (state, value) => {
      state.staffData = value;
    },
    SET_UPLOADTYPE: (state, value) => {
      state.uploadType = value;
    },
    SET_SOURCETYPE: (state, value) => {
      state.sourceType = value;
    },
    SET_ALLSOURCETYPE: (state, value) => {
      state.allSourceType = value;
    },
    SET_VERSIONDATA: (state, value) => {
      state.versionData = value;
    },
    SET_PLANID: (state, value) => {
      state.planId = value;
    },
    SET_TABACTION: (state, value) => {
      state.tabAction = value;
    },
    SET_USERUNIT: (state, value) => {
      state.userUnit = value;
    },
    SET_CHANGEBOOL: (state, value) => {
      state.changeBool = value;
    },
    SET_CHANGEBOOL2: (state, value) => {
      state.changeBool2 = value;
    },
    SET_TWOTHEMEID: (state, twothemeId) => {
      state.twothemeId = twothemeId;
    },
    SET_NOWYEARS: (state, nowYear) => {
      state.nowYear = nowYear;
    },
    SET_YEARS: (state, years) => {
      state.years = years;
    },
    SET_MINECLASS: (state, mineClass) => {
      state.mineClass = mineClass;
    },
    SET_CLASSROOMS: (state,classRooms) => {
      state.classRooms = classRooms;
    },
    SET_SUBJECTGRADE: (state, subjectGrade) => {
      state.subjectGrade[subjectGrade.subject] = subjectGrade.response;
    },
    SET_GRADE: (state, grade) => {
      state.grade = grade;
    },
    SET_GUIDEYEARS: (state, guideYears) => {
      state.guideYears = guideYears;
    },
    SET_TERM: (state, term) => {
      state.term = term;
    },
    SET_GRADESUBJECT: (state, gradeSubject) => {
      state.gradeSubject[gradeSubject.grade] = gradeSubject.response;
    },
    SET_SUBJECT: (state, subject) => {
      state.subject = subject;
    },
    SET_SECTIONS:(state, sectionData) => {
      state.sectionData = sectionData;
    },
    SET_TYPE: (state, type) => {
      state.type = type;
    },
    SET_COURSE: (state, course) => {
      state.course = course;
    },
    SET_TEACH: (state, teach) => {
      state.teach = teach;
    },
    SET_CLASSTIME: (state, classTime) => {
      state.classTime = classTime;
    },
    SET_PLANSELECT: (state, planSelect) => {
      state.planSelect = planSelect;
    },
    SET_MYPLANSELECT: (state, myPlanSelect) => {
      state.myPlanSelect = myPlanSelect;
    },
    SET_GUIDESELECT: (state, guideSelect) => {
      state.guideSelect = guideSelect;
    },
    SET_PROVINCECODE: (state, provinceCode) => {
      state.provinceCode = provinceCode;
    },
    SET_TYPEVALUE: (state, typeValue) => {
      state.typeValue = typeValue;
    },
    SET_EQUIPSYS: (state, equipSys) => {
      state.equipSys = equipSys;
    },
    SET_STAFFNAME: (state, staffName) => {
      state.staffName = staffName;
    }
  },
  actions: { 
    //获取学段信息
    GetStage({ commit, state }) {
      return state.stageData.length > 0 ?
      Promise.resolve(state.stageData) :
      new Promise((resolve, reject) => {
        getStage().then(response => {
          commit('SET_STAGEDATA', response);
          resolve(response);
        });
      });
    },

    //根据科目获取教师
    GetStaffg({ commit, state }, subject) {
      return state.staffObj[subject.subject] && state.staffObj[subject.subject].length > 0 ?
      Promise.resolve(state.staffObj[subject['subject']]) :
      new Promise((resolve, reject) => {
        getStaffg(subject).then(response => {
          let obj = {response: response, subject: subject['subject']};
          commit('SET_STAFFOBJ', obj);
          resolve(response);
        });
      });
    },
    //获取题型类别
    GetProblemType({ commit, state }) {
      return state.problemType.length > 0 ?
      Promise.resolve(state.problemType) :
      new Promise((resolve, reject) => {
        getProblemType().then(response => {
          commit('SET_PROBLEMTYPE', response);
          resolve(response);
        });
      });
    },
    //获取所带科目的授课老师
    GetOwnStaffs({ commit, state }) {
      return state.ownStaff !== null ?
      Promise.resolve(state.ownStaff) :
      new Promise((resolve, reject) => {
        getOwnStaffs().then(response => {
          commit('SET_OWNSTAFF', response);
          resolve(response);
        });
      });
    },
    //获取授课老师
    GetStaff({ commit, state }) {
      return state.staffData !== null ?
      Promise.resolve(state.staffData) :
      new Promise((resolve, reject) => {
        getunitStaff().then(response => {
          commit('SET_STAFFDATA', response);
          resolve(response);
        });
      });
    },
    //获取上传文件类型
    GetUploadType({ commit, state }) {
      return state.uploadType.length > 0 ?
      Promise.resolve(state.uploadType) :
      new Promise((resolve, reject) => {
        getUploadType().then(response => {
          commit('SET_UPLOADTYPE', response);
          resolve(response);
        });
      });
    },
    //获取资源类型
    GetSourceType({ commit, state }) {
      return state.sourceType !== null ?
      Promise.resolve(state.sourceType) :
      new Promise((resolve, reject) => {
        getSourceType().then(response => {
          commit('SET_SOURCETYPE', response);
          resolve(response);
        });
      });
    },
    //获取所有资源类型
    GetAllSourceType({ commit, state }) {
      return state.allSourceType !== null ?
      Promise.resolve(state.allSourceType) :
      new Promise((resolve, reject) => {
        getAllSourceType().then(response => {
          commit('SET_ALLSOURCETYPE', response);
          resolve(response);
        });
      });
    },
    //获取学段版本科目信息
    GetoneThemeTree({ commit, state }) {
      return state.versionData !== null ?
      Promise.resolve(state.versionData) :
      new Promise((resolve, reject) => {
        getoneThemeTree().then(response => {
          commit('SET_VERSIONDATA', response);
          resolve(response);
        });
      });
    },
    //获取自己的实验计划
    GetPlan({ commit, state }) {
      return state.myPlanSelect !== null ?
      Promise.resolve(state.myPlanSelect) :
      new Promise((resolve, reject) => {
        getPlan().then(response => {
          commit('SET_MYPLANSELECT', response);
          resolve(response);
        });
      });
    },
    //是够与装备打通
    GetEquipSys({ commit, state }) {
      return state.equipSys !== null ?
      Promise.resolve(state.equipSys) :
      new Promise((resolve, reject) => {
        getEquipSys().then(response => {
          commit('SET_EQUIPSYS', response);
          resolve(response);
        });
      });
    },

    //资产信息
    GettypeValue({ commit, state }) {
      return state.typeValue != null ?
      Promise.resolve(state.typeValue) :
      new Promise((resolve, reject) => {
        gettypeValue().then(response => {
          commit('SET_TYPEVALUE', response);
          resolve(response);
        });
      });
    },

    //父节点信息
    GetParentInfo({ commit, state }) {
      return state.provinceCode != null ?
      Promise.resolve(state.provinceCode) :
      new Promise((resolve, reject) => {
        getParentInfo().then(response => {
          commit('SET_PROVINCECODE', response);
          resolve(response);
        });
      });
    },

    //获取节次
    GetClassTime({ commit, state }) {
      return state.classTime && state.classTime.length > 0 ?
      Promise.resolve(state.classTime) :
      new Promise((resolve, reject) => {
        getClassTime().then(response => {
          commit('SET_CLASSTIME', response);
          resolve(response);
        });
      });
    },
    //获取开课方式
    GetCourse({ commit, state }, course) {
      return state.course && state.course.length > 0 ?
      Promise.resolve(state.course) :
      new Promise((resolve, reject) => {
        getCourse().then(response => {
          commit('SET_COURSE', response);
          resolve(response);
        });
      });
    },
    //获取实验类型
    GetType({ commit, state }, type) {
      return state.type && state.type.length > 0 ?
      Promise.resolve(state.type) :
      new Promise((resolve, reject) => {
        getType().then(response => {
          commit('SET_TYPE', response);
          resolve(response);
        });
      });
    },
    //根据年级获取科目
    GetGradeSubject({ commit, state }, grade) {
      return state.gradeSubject[grade] && state.gradeSubject[grade].length > 0 ?
      Promise.resolve(state.gradeSubject[grade]) :
      new Promise((resolve, reject) => {
        getSubject(grade).then(response => {
          let obj = {response: response, grade: grade}
          commit('SET_GRADESUBJECT', obj);
          resolve(response);
        });
      });
    },
    //获取科目
    GetSubject({ commit, state }, subject) {
      return state.subject && state.subject.length > 0 ?
      Promise.resolve(state.subject) :
      new Promise((resolve, reject) => {
        getSubject().then(response => {
          commit('SET_SUBJECT', response);
          resolve(response);
        });
      });
    },
    //获取学段
      GetSection({ commit, state },sectionData) {
        return  new Promise((resolve, reject) => {
        getSections().then(response => {
          commit('SET_SECTIONS', response);
          resolve(response);
        });
      });
    },

    //获取学期
    GetTerm({ commit, state }, term) {
      return state.term && state.term.length > 0 ?
      Promise.resolve(state.term) :
      new Promise((resolve, reject) => {
        getTerm().then(response => {
          commit('SET_TERM', response);
          resolve(response);
        });
      });
    },
    //获取管理端学年信息
    GetGuideYears({ commit, state }, guideYears) {
      return state.guideYears && state.guideYears.length > 0 ?
      Promise.resolve(state.guideYears) :
      new Promise((resolve, reject) => {
        getGuideYears().then(response => {
          commit('SET_GUIDEYEARS', response);
          resolve(response);
        });
      });
    },
    // 获取当年学年信息
    GetYear({ commit, state }, years) {
      return state.years && state.years != null ?
      Promise.resolve(state.years) :
      new Promise((resolve, reject) => {
        getMineYear().then(response => {
          commit('SET_YEARS', response);
          resolve(response);
        });
      });
    },
    // 获取当前年度
    GetNowYear({ commit, state }) {
      return state.nowYear && state.nowYear.length > 0 ?
      Promise.resolve(state.nowYear) :
      new Promise((resolve, reject) => {
        getYear().then(response => {
          commit('SET_NOWYEARS', response);
          resolve(response);
        });
      });
    },
    // 获取所带班级
    GetMineClass({ commit }, mineClass) {
      return new Promise((resolve, reject) => {
        getMineClass().then(response => {
          commit('SET_MINECLASS', response);
          resolve(response);
        });
      });
    },
    // 获取所有教室种类
    GetClassRooms({ commit }, classRooms) {
      return new Promise((resolve, reject) => {
        getClassRooms().then(response => {
          commit('SET_CLASSROOMS', response);
          resolve(response);
        });
      });
    },
    //根据科目获取年级
    GetSubjectGrade({ commit, state }, subject){
      return state.subjectGrade[subject] && state.subjectGrade[subject].length > 0 ?
      Promise.resolve(state.subjectGrade[subject]) :
      new Promise((resolve, reject) => {
        getGrade(subject).then(response => {
          let obj = {response: response, subject: subject}
          commit('SET_SUBJECTGRADE', obj);
          resolve(response);
        });
      });
    },
    //获取所有年级
    GetAllGrade({ commit, state }) {
      return state.gradeAllData.length > 0?
      Promise.resolve(state.gradeAllData) :
      new Promise((resolve, reject) => {
        getGrade().then(response => {
          commit('SET_GRADEALLDATA', response);
          resolve(response);
        });
      });
    },
    //获取年级
    GetGrade({ commit }, grade) {
      return new Promise((resolve, reject) => {
        getGrade(grade).then(response => {
          commit('SET_GRADE', response);
          resolve(response);
        });
      });
    },
    GetTeach({ commit, state}) {
      return state.teach && state.teach.length > 0 ?
      Promise.resolve(state.teach) :
      new Promise((resolve, reject) => {
        getTeach().then(response => {
          const data = response;
          commit('SET_TEACH', data);
          resolve(data);
        });
      });
    },
    //获取顶级节点信息
    GetUserUnit({ commit, state}) {
      return (state.userUnit.unitId != '')?
      Promise.resolve(state.userUnit) :
      new Promise((resolve, reject) => {
        getuserUnit().then(response => {
          const data = response;
          commit('SET_USERUNIT', data);
          resolve(data);
        });
      });
    }
  }
};

export default commonData;
