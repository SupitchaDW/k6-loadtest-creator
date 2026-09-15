import { CREATOR_USERS } from '../../creator-users.js';
import { login } from '../../helpers/auth.js';
import { generate3D, clearTasks, } from '../../helpers/ai-generate.js';
import { AI_GENERATE_3D_DATA } from '../../data/ai-generate-data.js';


export function aiGenerate3DFlow() {
  const user = CREATOR_USERS[__VU - 1];

  console.log(
    `[AI 3D] VU ${__VU}/${CREATOR_USERS.length} | ${user.email}`
  );

  // Login
  const loginResult = login(
    user.email,
    __ENV.TEST_PASSWORD
  );

  console.log(
    `[AI 3D] Login status: ${loginResult.res.status}`
  );

  if (!loginResult.token) {
    console.log(
      `[AI 3D] Login failed | ${user.email}`
    );

    console.log(
      `[AI 3D] Login response: ${loginResult.res.body}`
    );

    return;
  }

  console.log(
    `[AI 3D] Login success | ${user.email}`
  );

  
  const taskIds = [];

  // Generate 3D
  const res = generate3D(
    AI_GENERATE_3D_DATA,
    loginResult.token,
    taskIds
  );

  console.log(
    `[AI 3D] Status: ${res.status} | ${user.email}`
  );

  console.log(
    `[AI 3D] Response: ${res.body}`
  );

  // clear all task
  clearTasks(taskIds, loginResult.token);
}