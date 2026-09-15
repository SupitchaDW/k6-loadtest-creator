import { CREATOR_USERS } from '../../creator-users.js';
import { login } from '../../helpers/auth.js';
import { generate2D, clearTasks, } from '../../helpers/ai-generate.js';
import { AI_GENERATE_2D_DATA } from '../../data/ai-generate-data.js';


export function aiGenerate2DFlow() {
  const user = CREATOR_USERS[__VU - 1];

  console.log(
    `[AI 2D] VU ${__VU}/${CREATOR_USERS.length} | ${user.email}`
  );

  // Login
  const loginResult = login(
    user.email,
    __ENV.TEST_PASSWORD
  );

  console.log(
    `[AI 2D] Login status: ${loginResult.res.status}`
  );

  if (!loginResult.token) {
    console.log(
      `[AI 2D] Login failed | ${user.email}`
    );

    console.log(
      `[AI 2D] Login response: ${loginResult.res.body}`
    );

    return;
  }

  console.log(
    `[AI 2D] Login success | ${user.email}`
  );


  const taskIds = [];

  // Generate 2D
  const res = generate2D(
    AI_GENERATE_2D_DATA,
    loginResult.token,
    taskIds
  );

  console.log(
    `[AI 2D] Status: ${res.status} | ${user.email}`
  );

  console.log(
    `[AI 2D] Response: ${res.body}`
  );

  // clear all task
  clearTasks(taskIds, loginResult.token);
}