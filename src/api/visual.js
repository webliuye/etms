import { fetch1 } from 'utils/fetch';

// 生成试卷
export function rankTen(data) {
  return fetch1({
    url:'/pub/cros/experiment-report/top',
    method: 'get',
    params:data
  });
}
export function getTestData(data) {
  return fetch1({
    url:'/pub/cros/experiment-report/question/use',
    method: 'get',
    params:data
  });
}
export function getUvInfo(data) {
  return fetch1({
    url:'/pub/cros/experiment-report/uvInfo',
    method: 'get',
    params:data
  });
}
export function getLiveNotice(data) {
  return fetch1({
    url:'pub/cros/experiment-report/courseInfo',
    method: 'get',
    params:data
  });
}
export function gettrandency(data) {
  return fetch1({
    url:'/pub/cros/experiment-report/courseCountAxis',
    method: 'get',
    params:data
  });
}
export function getsrcUseData(data) {
  return fetch1({
    url:'/pub/cros/experiment-report/resourceCountAxis',
    method: 'get',
    params:data
  });
}





