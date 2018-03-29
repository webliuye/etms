function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time);
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }

  if ((time + '').length === 10) {
    time = +time * 1000
  }


  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time == 'object') {
    date = time;
  } else {
    date = new Date(parseInt(time));
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
    if (result.length > 0 && value < 10) {
      value = '0' + value;
    }
    return value || 0;
  });
  return time_str;
}
export function dateStringTen(value){
  var time = new Date(value);
   var Y = time.getFullYear(),
      m = time.getMonth() + 1,
      d = time.getDate();
   if (m < 10) {
        m = '0' + m;
    }
    if (d < 10) {
        d = '0' + d;
    }
    var t = Y + '-' + m + '-' + d;
    return t;
}

export function formatTime(time, option) {
  time = +time * 1000;
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}



/* 数字 格式化*/
export function nFormatter(num, digits) {
  const si = [
        { value: 1E18, symbol: 'E' },
        { value: 1E15, symbol: 'P' },
        { value: 1E12, symbol: 'T' },
        { value: 1E9, symbol: 'G' },
        { value: 1E6, symbol: 'M' },
        { value: 1E3, symbol: 'k' }
  ];
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol;
    }
  }
  return num.toString();
}

export function dateString(val){
  return val.slice(0,10);
}



export function html2Text(val) {
  const div = document.createElement('div');
  div.innerHTML = val;
  return div.textContent || div.innerText;
}


export function toThousandslsFilter(num) {
  return (+num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}

export function numberAvgTimes(value) {   //次数保留2位小数
  const num = Number(value);
  if(num){
    return num.toFixed(2);
  }else{
    return 0;
  }
}

export function numberTrans(value) {   //带百分号
  const num = Number(value);
  if(num){
    return (num*100).toFixed(2)+'%';
  }else{
    return 0;
  }
}

export function numberTransValue(value) {   //不带百分号
  const num = Number(value);
  if(num){
    return Math.round(num*10000) / 100;
  }else{
    return 0;
  }
}

export function numberTransTwo(value1,value2) {   //计算百分比
  const num1 = Number(value1);
  const num2 = Number(value2) || 0;
  if(num1){
    if(num1 > num2){
      return 100;
    }else{
      return Math.round((num1/num2) * 100);
    }
  }else{
    return 0;
  }
}

export function changeClassTime(value) {
  const name = ['','第一节','第二节','第三节','第四节','第五节','第六节','第七节','第八节'];
  if(value){
    return name[value];
  }else{
    return '';
  }
}

export function changeDate(date) {   //将时间格式转化为20180120这种格式
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  if(month < 10){
    month = '0' + month;
  }
  if(day < 10){
    day = '0' + day;
  }
  return ('' + year + month + day);
}

// 根据value获取列表中对应label值
export function turnValueLabel(status,listData) {
  let statustxt = '' ;
  for (let i = 0 ; i < listData.length ; i++){
    if(status == listData[i].value) {
     statustxt =   listData[i].label
    }
  }
  return statustxt;
}
// 批量根据value获取列表中对应label值
export function formAny (data){
  var data = data;
  const subject = data.subject;
  const courseMode = data.courseMode;
  const grade = data.grade;
  const term = data.term;
  const type = data.type;
  const teach = data.teachingMaterial;

  const subjectArr = ['科学', '物理', '化学', '生物'];
  const courseArr = ['分组实验', '演示实验'];
  const gradeArr = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '八年级', '九年级', '高中一年级', '高中二年级', '高中三年级'];
  const termArr = ['全学年', '上学期', '下学期']; // 0开始
  const typeArr = ['基本实验', '拓展实验', '校本实验'];
  const teachArr = ['人教版', '北师大版', '苏教版', '科教版', '冀教版', '沪科版', '沪教版', '教科版', '湘教版', '冀人版', '粤教沪科版', '科粤版', '鲁教版'];

  if(subject){ data.subjectLabel = subjectArr[parseInt(subject)-1] }
  if(courseMode){ data.modeLabel = courseArr[parseInt(courseMode)-1] }
  if(grade){ data.gradeLabel = gradeArr[parseInt(grade)-1] }
  if(term){ data.termLabel = termArr[parseInt(term)] }
  if(type){ data.typeLabel = typeArr[parseInt(type)-1] }
  if(teach){ data.teachingMaterialLabel = teachArr[parseInt(teach)-1] }
  return data;
}
