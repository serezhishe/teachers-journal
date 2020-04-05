import { BASE_URL } from '../constants/base-url';

export function parseURL(url: string): {path: string; id: string} {
  const routes = url.replace(`${BASE_URL}/`, '').split('/');
  const path = routes[0];
  const id = routes[1] ? routes[1] : undefined; // REVIEW: no need ternary operator, just `= routes[1]`

  return {
    path,
    id,
  };
}
