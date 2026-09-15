import { check } from 'k6';
import { login } from '../../helpers/auth.js';
import { logResponse } from '../../helpers/logger.js';

export function loginFlow() {
  const result = login();

  logResponse('Login', result.res);

  return result;
}