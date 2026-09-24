import { USERS } from '../../data/supporter-users.js';
import { clearContentTasks } from '../../helpers/ai-cleanup.js';

export const options = {
  scenarios: {
    cleanup: {
      executor: 'per-vu-iterations',
      vus: __ENV.VUS ? parseInt(__ENV.VUS, 10) : USERS.length,
      iterations: 1,
      maxDuration: '10m',
    },
  },
};

export default function () {
  const user = USERS[(__VU - 1) % USERS.length];

  console.log(
    `[AI Cleanup] VU ${__VU}/${USERS.length} | ${user.email}`
  );

  const token = user.token;

  if (!token) {
    console.log(
      `[AI Cleanup] No token found for user | ${user.email}`
    );
    return;
  }

  const taskCount = clearContentTasks(token);

  console.log(
    `[AI Cleanup] Completed | ${user.email} | tasks=${taskCount}`
  );
}