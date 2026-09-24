import { SharedArray } from 'k6/data';

const DEFAULT_USERS_FILE = '../result-data/signup-supporter/TC001/';
const FILE = 'signup-supporter_TC001_sit_20260924_182432_users.json'
const USERS_FILE = __ENV.USERS_FILE || DEFAULT_USERS_FILE + FILE;

export const USERS = new SharedArray('users', function () {
  return JSON.parse(open(USERS_FILE));
});

export const SUPPORTER_USERS = USERS;
