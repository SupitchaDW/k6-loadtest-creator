import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from './config.js';

export function landingPage() {
  const res = http.get(`${BASE_URL}/`, {
    tags: {
      api: 'landing-page',
      api_flow: 'landing',
    },
  });

  check(res, {
    'Landing page returns 2xx': (r) =>
      r.status >= 200 && r.status < 300,
  });

  return res;
}