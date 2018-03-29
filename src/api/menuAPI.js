import { fetch } from 'utils/fetch';

export function getMenuInfo(token) {
  return fetch({
    url: '/api/security/menus',
    method: 'get'
  });
}