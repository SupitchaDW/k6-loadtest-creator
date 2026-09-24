import { SharedArray } from 'k6/data';

const DEFAULT_USERS_FILE = '../result-data/signup-supporter/TC002/signup-supporter_TC002_sit_20260923_134409_users.json';
const USERS_FILE = __ENV.USERS_FILE || DEFAULT_USERS_FILE;

export const USERS = new SharedArray('users', function () {
  return JSON.parse(open(USERS_FILE));
});

export const SUPPORTER_USERS = USERS;
