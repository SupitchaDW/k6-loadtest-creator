import { USERS } from '../../data/supporter-users.js';
import { generateContent, clearTasks } from '../../helpers/ai-generate.js';
import { AI_GENERATE_CONTENT_DATA } from '../../data/ai-generate-data.js';

export function aiGenerateContentFlow() {
  const user = USERS[(__VU - 1) % USERS.length];

  console.log(
    `[AI Content] VU ${__VU}/${USERS.length} | ${user.email}`
  );

  const token = user.token;

  if (!token) {
    console.log(
      `[AI Content] No token found for user | ${user.email}`
    );
    return;
  }

  const taskIds = [];

  // Generate Content
  const res = generateContent(
    AI_GENERATE_CONTENT_DATA,
    token,
    taskIds
  );

  console.log(
    `[AI Content] Status: ${res.status} | ${user.email}`
  );

  console.log(
    `[AI Content] Response: ${res.body}`
  );

  // clear all task
  clearTasks(taskIds, token);
}