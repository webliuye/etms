
import { fetch } from 'utils/fetch';
//获取错误率和时长
export function getSelfStatic() {
  return fetch({
    url: '/api/test/self/statistics',
    method: 'get'
  });
}
//获取最后五次的练习
export function getLastFive() {
  return fetch({
    url: '/api/test/self/lastRate5',
    method: 'get'
  });
}
//获取全部10全站排名
export function getTopTen() {
  return fetch({
    url: '/api/test/self/top10',
    method: 'get'
  });
}
//获取个人全站排名
export function getPrsRank() {
  return fetch({
    url: '/api/test/self/rank',
    method: 'get'
  });
}

//获取个人错题本
export function getPrsErrBook(data) {
    return fetch({
      url: '/api/test/self-question/wrongList',
      method: 'get',
      params:data
    });
  }

//获取个人所带科目
export function getOwnSubjects(data) {
    return fetch({
      url: '/api/guides/self-subject',
      method: 'get',
      params: data
    });
  }

