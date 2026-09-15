import http from 'k6/http';
import { check } from 'k6';
import { Counter, Trend } from 'k6/metrics';
import { CONFIG, jsonHeaders } from './config.js';

// ============================================================
// AI Generate Metrics
// ============================================================

const ai2DRequests = new Counter('ai_2d_requests');
const ai2DSuccess201 = new Counter('ai_2d_success_201');
const ai2DResponseTime = new Trend('ai_2d_response_time');

const ai3DRequests = new Counter('ai_3d_requests');
const ai3DSuccess201 = new Counter('ai_3d_success_201');
const ai3DResponseTime = new Trend('ai_3d_response_time');

const aiContentRequests = new Counter('ai_content_requests');
const aiContentSuccess201 = new Counter('ai_content_success_201');
const aiContentResponseTime = new Trend('ai_content_response_time');


// ============================================================
// Metric Helper
// ============================================================

function recordAiMetrics(type, res) {
  if (type === '2d') {
    ai2DRequests.add(1);
    ai2DResponseTime.add(res.timings.duration);

    if (
      res.status === 201 &&
      !!res.json('data.task_id')
    ) {
      ai2DSuccess201.add(1);
    }

    return;
  }

  if (type === '3d') {
    ai3DRequests.add(1);
    ai3DResponseTime.add(res.timings.duration);

    if (
      res.status === 201 &&
      !!res.json('data.task_id')
    ) {
      ai3DSuccess201.add(1);
    }

    return;
  }

  if (type === 'content') {
    aiContentRequests.add(1);
    aiContentResponseTime.add(res.timings.duration);

    if (
      res.status === 201 &&
      !!res.json('data.task_id')
    ) {
      aiContentSuccess201.add(1);
    }
  }
}


// ============================================================
// Generate
// ============================================================

function generate(
  name,
  metricType,
  path,
  payload,
  token,
  timeout,
  taskIds
) {
  const res = http.post(
    `${CONFIG.baseUrl}${path}`,
    JSON.stringify(payload),
    {
      headers: {
        ...jsonHeaders(),
        'x-device': CONFIG.deviceId,
        Authorization: `Bearer ${token}`,
      },

      timeout,

      tags: {
        api: name,
        api_flow: __ENV.API_FLOW || name,
        test_case: __ENV.TEST_CASE || 'TC01',
        environment: __ENV.ENVIRONMENT || 'sit',
      },
    }
  );

  // ==========================================================
  // Record AI-specific metrics
  // ==========================================================

  recordAiMetrics(metricType, res);

  // ==========================================================
  // Get task ID
  // ==========================================================

  let taskId;

  if (res.status === 201) {
    try {
      taskId = res.json('data.task_id');
    } catch (e) {
      taskId = null;
    }

    console.log(
      `[${name}] task_id: ${taskId}`
    );

    if (taskId) {
      taskIds.push(taskId);
    } else {
      console.log(
        `[${name}] WARNING: 201 but task_id not found | Response: ${res.body}`
      );
    }
  }

  // ==========================================================
  // Parse response
  // ==========================================================

  let body = {};

  try {
    body = res.json();
  } catch (e) {
    // Ignore invalid JSON
  }

  // ==========================================================
  // Business errors that are intentionally accepted
  // activeTaskExist = user already has active AI task
  // insufficientCredit = user has no credit
  // ==========================================================

  const isActiveTaskExist =
    res.status === 400 &&
    body?.key === 'activeTaskExist';

  const isInsufficientCredit =
    res.status === 400 &&
    body?.key === 'insufficientCredit';


  check(res, {
    [`${name} accepted`]: (r) =>
      (
        r.status === 201 &&
        !!r.json('data.task_id')
      ) ||
      isActiveTaskExist ||
      isInsufficientCredit,
  });

  if (isActiveTaskExist) {
    console.log(
      `[${name}] SKIP activeTaskExist | User already has active task`
    );
  }

  if (isInsufficientCredit) {
    console.log(
      `[${name}] SKIP insufficientCredit | User has no credit`
    );
  }

  return res;
}


// ============================================================
// AI Generate 2D
// ============================================================

export function generate2D(payload, token, taskIds) {
  return generate(
    'ai-generate-2d',
    '2d',
    CONFIG.aiGenerate2DPath,
    payload,
    token,
    CONFIG.aiGenerate2DTimeout,
    taskIds
  );
}


// ============================================================
// AI Generate 3D
// ============================================================

export function generate3D(payload, token, taskIds) {
  return generate(
    'ai-generate-3d',
    '3d',
    CONFIG.aiGenerate3DPath,
    payload,
    token,
    CONFIG.aiGenerate3DTimeout,
    taskIds
  );
}


// ============================================================
// AI Generate Content
// ============================================================

export function generateContent(payload, token, taskIds) {
  return generate(
    'ai-generate-content',
    'content',
    CONFIG.aiGenerateContentPath,
    payload,
    token,
    CONFIG.aiGenerateContentTimeout,
    taskIds
  );
}


// ============================================================
// Clear AI Tasks
// ============================================================

export function clearTasks(taskIds, token) {
  for (const taskId of taskIds) {
    const res = http.del(
      `${CONFIG.baseUrl}/v1/ai-generate/task/${taskId}`,
      null,
      {
        headers: {
          'x-device': CONFIG.deviceId,
          Authorization: `Bearer ${token}`,
        },

        timeout: CONFIG.aiGenerateTaskDeleteTimeout,

        tags: {
          api: 'ai-generate-task-delete',
          api_flow: 'ai-generate-cleanup',
          test_case: __ENV.TEST_CASE || 'TC01',
          environment: __ENV.ENVIRONMENT || 'sit',
        },
      }
    );

    if (res.status >= 200 && res.status < 300) {
      console.log(
        `[AI Cleanup] DELETE ${taskId} | cancelled successfully`
      );
    } else {
      let key = '';

      try {
        key = res.json('key');
      } catch (e) {
        // Ignore invalid JSON
      }

      if (key === 'taskAlreadyStarted') {
        console.log(
          `[AI Cleanup] DELETE ${taskId} | taskAlreadyStarted | ignored`
        );
      } else {
        console.log(
          `[AI Cleanup] DELETE ${taskId} | Status: ${res.status} | Response: ${res.body}`
        );
      }
    }

    check(res, {
      'delete AI task returns expected status': (r) => {
        if (r.status >= 200 && r.status < 300) {
          return true;
        }

        try {
          const body = r.json();

          return (
            r.status === 400 &&
            body.key === 'taskAlreadyStarted'
          );
        } catch (e) {
          return false;
        }
      },
    });
  }

  taskIds.length = 0;
}