import { CREATOR_USERS } from '../../creator-users.js';
import { login } from '../../helpers/auth.js';
import { clearContentTasks } from '../../helpers/ai-cleanup.js';

export const options = {
  scenarios: {
    cleanup: {
      executor: 'per-vu-iterations',
      vus: CREATOR_USERS.length,
      iterations: 1,
      maxDuration: '10m',
    },
  },
};

export default function () {
  const user = CREATOR_USERS[__VU - 1];

  console.log(
    `[AI Cleanup] VU ${__VU}/${CREATOR_USERS.length} | ${user.email}`
  );

  const loginResult = login(
    user.email,
    __ENV.TEST_PASSWORD
  );

  console.log(
    `[AI Cleanup] Login result | ${user.email} | token=${!!loginResult.token}`
  );

  if (!loginResult.token) {
    console.log(
      `[AI Cleanup] Login failed | ${user.email}`
    );
    return;
  }

  const taskCount = clearContentTasks(
    loginResult.token
  );

  console.log(
    `[AI Cleanup] Completed | ${user.email} | tasks=${taskCount}`
  );
}