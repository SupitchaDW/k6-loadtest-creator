import http from 'k6/http';
import { check } from 'k6';
import { CONFIG, jsonHeaders } from './config.js';

function deleteTask(taskId, token) {
  const res = http.del(
    `${CONFIG.baseUrl}/v1/ai-generate/task/${taskId}`,
    JSON.stringify({}),
    {
      headers: {
        ...jsonHeaders(),
        'x-device': CONFIG.deviceId,
        Authorization: `Bearer ${token}`,
      },
      timeout: CONFIG.timeout,
      tags: {
        api: 'ai-generate-task-delete',
        api_flow: 'ai-generate-cleanup',
        test_case: __ENV.TEST_CASE || 'TC01',
        environment: __ENV.ENVIRONMENT || 'sit',
      },
    }
  );

  console.log(
    `[AI Cleanup] DELETE ${taskId} | Status: ${res.status} | Response: ${res.body}`
  );

  check(res, {
    'delete AI task returns 2xx': (r) =>
      r.status >= 200 && r.status < 300,
  });

  return res;
}

export function clearContentTasks(token) {
  const res = http.get(
    `${CONFIG.baseUrl}/v1/ai-generate/task/content`,
    {
      headers: {
        ...jsonHeaders(),
        'x-device': CONFIG.deviceId,
        Authorization: `Bearer ${token}`,
      },
      timeout: CONFIG.timeout,
      tags: {
        api: 'ai-generate-task-content',
        api_flow: 'ai-generate-cleanup',
        test_case: __ENV.TEST_CASE || 'TC01',
        environment: __ENV.ENVIRONMENT || 'sit',
      },
    }
  );

  // 404 taskNotFound = ไม่มี task ที่ต้อง cleanup
  if (res.status === 404) {
    const key = res.json('key');

    if (key === 'taskNotFound') {
      console.log(
        '[AI Cleanup] No active content task'
      );
      return 0;
    }
  }

  // Unexpected error
  if (res.status < 200 || res.status >= 300) {
    console.log(
      `[AI Cleanup] GET content task failed | Status: ${res.status} | Response: ${res.body}`
    );
    return 0;
  }

  const taskId = res.json('data.task_id');

  console.log(
    `[AI Cleanup] Found task: ${taskId || 'none'}`
  );

  if (!taskId) {
    console.log('[AI Cleanup] No task to delete');
    return 0;
  }

  const deleteRes = deleteTask(taskId, token);

  if (deleteRes.status >= 200 && deleteRes.status < 300) {
    return 1;
  }

  return 0;
}