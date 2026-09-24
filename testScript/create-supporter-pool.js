import { SharedArray } from 'k6/data';
import { signUpSupporter } from '../helpers/signup.js';
import { SUPPORTER_DATA } from '../data/signup-data.js';

const POOL_FILE = __ENV.SUPPORTER_POOL_FILE || '../data/supporter-pool.json';

const SUPPORTER_POOL = new SharedArray(
  'supporter-pool',
  function () {
    return JSON.parse(open(POOL_FILE));
  }
);

export const options = {
  scenarios: {
    create_supporter_pool: {
      executor: 'per-vu-iterations',
      vus: SUPPORTER_POOL.length,
      iterations: 1,
      maxDuration: '15m',
    },
  },
};

export default function () {
  const user = SUPPORTER_POOL[__VU - 1];

  console.log(
    `[Supporter Pool] VU ${__VU}/${SUPPORTER_POOL.length} | Creating ${user.email}`
  );

  const result = signUpSupporter({
    ...SUPPORTER_DATA,
    email: user.email,
    password: user.password || __ENV.TEST_PASSWORD || SUPPORTER_DATA.password,
    displayName: user.displayName,
  });

  const isSuccess = result.res.status >= 200 && result.res.status < 300;

  if (isSuccess) {
    console.log(`[Supporter Pool] SUCCESS | ${user.email}`);
    if (result.token) {
      console.log(
        `[USER_EXPORT] ${JSON.stringify({
          token: result.token,
          email: user.email,
          password: user.password || __ENV.TEST_PASSWORD || SUPPORTER_DATA.password,
          firstName: SUPPORTER_DATA.firstName,
          lastName: SUPPORTER_DATA.lastName,
          displayName: user.displayName,
          phoneNumber: SUPPORTER_DATA.phoneNumber,
          dateOfBirth: SUPPORTER_DATA.dateOfBirth,
          gender: SUPPORTER_DATA.gender,
        })}`
      );
    }
  } else {
    console.log(`[Supporter Pool] FAILED | ${user.email}`);
    console.log(`[Supporter Pool] Status: ${result.res.status}`);
    console.log(`[Supporter Pool] Response: ${result.res.body}`);
  }
}
