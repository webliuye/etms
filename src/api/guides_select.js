import { fetch } from 'utils/fetch';

export function guidesList(query) {
  return fetch({
    url: '/guides_select/list',
    method: 'get',
    params: query
  });
}

export function subjectList(query) {
  return fetch({
    url: '/guides_select/subList',
    method: 'get',
    params: query
  });
}

export function termList(query) {
  return fetch({
    url: '/guides_select/termLists',
    method: 'get',
    params: query
  });
}