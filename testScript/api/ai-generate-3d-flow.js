import { USERS } from '../../data/supporter-users.js';
import { generate3D, clearTasks } from '../../helpers/ai-generate.js';
import { AI_GENERATE_3D_DATA } from '../../data/ai-generate-data.js';

export function aiGenerate3DFlow() {
  const user = USERS[(__VU - 1) % USERS.length];

  console.log(
    `[AI 3D] VU ${__VU}/${USERS.length} | ${user.email}`
  );

  const token = user.token;

  if (!token) {
    console.log(
      `[AI 3D] No token found for user | ${user.email}`
    );
    return;
  }

  const taskIds = [];

  // Generate 3D
  const res = generate3D(
    AI_GENERATE_3D_DATA,
    token,
    taskIds
  );

  console.log(
    `[AI 3D] Status: ${res.status} | ${user.email}`
  );

  console.log(
    `[AI 3D] Response: ${res.body}`
  );

  // clear all task
  clearTasks(taskIds, token);
}