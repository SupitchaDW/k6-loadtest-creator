import http from 'k6/http';
import { check } from 'k6';
import { CONFIG, jsonHeaders } from './config.js';

// Login / Authentication
export function login(username = CONFIG.username, password = CONFIG.password) {
  const payload = JSON.stringify({
    username,
    password,
  });

  const res = http.post(
    `${CONFIG.baseUrl}${CONFIG.loginPath}`,
    payload,
    {
      headers: {
        ...jsonHeaders(),
        'x-device': CONFIG.deviceId,
      },
      timeout: CONFIG.timeout,
      tags: {
        api: 'login',
        api_flow: __ENV.API_FLOW || 'login',
        test_case: __ENV.TEST_CASE,
        environment: __ENV.ENVIRONMENT || 'sit',
      },
    }
  );

  // console.log(
  //   `[Login] ${username} | Status: ${res.status} | Response: ${res.body}`
  // );

  check(res, {
    'login returns 2xx': (r) =>
      r.status >= 200 && r.status < 300,
  });

  let token = null;

  try {
    const body = res.json();

    token =
      body.accessToken ||
      body.access_token ||
      body.token ||
      body.data?.accessToken ||
      body.data?.token ||
      null;
  } catch (_) {}

  return {
    res,
    token,
  };
}
