import { fetch } from 'utils/fetch';

export function getList(query) {
  return fetch({
    url: '/article/list',
    method: 'get',
    params: query
  });
}

export function getArticle(query) {
  return fetch({
    url: '/article/detail',
    method: 'get',
    params: query
  });
}

