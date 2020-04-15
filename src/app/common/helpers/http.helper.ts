import { BASE_URL } from '../constants/base-url';

export function parseURL(url: string): {path: string; id: string} {
  const routes = url.replace(`${BASE_URL}/`, '').split('/');
  let id: string = null;
  let path: string;
  for (const route of routes) {
    path = id;
    id = route;
  }
  if (!path) {
    path = id;
    id = null;
  }

  return {
    path,
    id,
  };
}
