import { USERS } from '../../data/supporter-users.js';
import { generate2D, clearTasks } from '../../helpers/ai-generate.js';
import { AI_GENERATE_2D_DATA } from '../../data/ai-generate-data.js';

export function aiGenerate2DFlow() {
  const user = USERS[(__VU - 1) % USERS.length];

  console.log(
    `[AI 2D] VU ${__VU}/${USERS.length} | ${user.email}`
  );

  const token = user.token;

  if (!token) {
    console.log(
      `[AI 2D] No token found for user | ${user.email}`
    );
    return;
  }

  const taskIds = [];

  // Generate 2D
  const res = generate2D(
    AI_GENERATE_2D_DATA,
    token,
    taskIds
  );

  console.log(
    `[AI 2D] Status: ${res.status} | ${user.email}`
  );

  console.log(
    `[AI 2D] Response: ${res.body}`
  );

  // clear all task
  clearTasks(taskIds, token);
}