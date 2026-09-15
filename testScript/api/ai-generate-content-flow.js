import { CREATOR_USERS } from '../../creator-users.js';
import { login } from '../../helpers/auth.js';
import { generateContent, clearTasks, } from '../../helpers/ai-generate.js';
import { AI_GENERATE_CONTENT_DATA } from '../../data/ai-generate-data.js';


export function aiGenerateContentFlow() {
  const user = CREATOR_USERS[__VU - 1];

  console.log(
    `[AI Content] VU ${__VU}/${CREATOR_USERS.length} | ${user.email}`
  );

  // Login
  const loginResult = login(
    user.email,
    __ENV.TEST_PASSWORD
  );

  if (!loginResult.token) {
    console.log(
      `[AI Content] Login failed | ${user.email}`
    );
    return;
  }

  console.log(
    `[AI Content] Login success | ${user.email}`
  );


  const taskIds = [];

  // Generate Content
  const res = generateContent(
    AI_GENERATE_CONTENT_DATA,
    loginResult.token,
    taskIds
  );

  console.log(
    `[AI Content] Status: ${res.status} | ${user.email}`
  );

  console.log(
    `[AI Content] Response: ${res.body}`
  );

  // clear all task
  clearTasks(taskIds, loginResult.token);
}