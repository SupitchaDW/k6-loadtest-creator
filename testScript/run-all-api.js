// import { login } from '../helpers/auth.js';
import { loginFlow } from './api/login-test.js';
import { signupSupporterFlow } from './api/signup-supporter-flow.js';
import { signupCreatorIndividualFlow } from './api/signup-creator-individual-flow.js';
import { signupCreatorJuristicFlow } from './api/signup-creator-juristic-flow.js';
import { aiGenerateContentFlow } from './api/ai-generate-content-flow.js';
import { aiGenerate2DFlow } from './api/ai-generate-2d-flow.js';
import { aiGenerate3DFlow } from './api/ai-generate-3d-flow.js';
import { landingFlow } from './api/landing-flow.js';

import { LOGIN_TEST_CASES, REGISTER_TEST_CASES, AI_TEST_CASES, LANDING_TEST_CASES, } from './loadConfig/test-cases.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';

const API_FLOW = __ENV.API_FLOW || 'login';
const TEST_CASE = __ENV.TEST_CASE || 'TC001';
const ENVIRONMENT = __ENV.ENVIRONMENT || 'sit';

function getTestCases() {
  switch (API_FLOW) {
    case 'login':
      return LOGIN_TEST_CASES;

    case 'signup-supporter':
    case 'creator-individual':
    case 'creator-juristic':
      return REGISTER_TEST_CASES;

    case 'ai-generate-content':
    case 'ai-generate-2d':
    case 'ai-generate-3d':
      return AI_TEST_CASES;

    case 'landing':
      return LANDING_TEST_CASES;

    default:
      throw new Error(`Unknown API_FLOW: ${API_FLOW}`);
  }
}

const TEST_CASES = getTestCases();

if (!TEST_CASES[TEST_CASE]) {
  throw new Error(
    `Unknown TEST_CASE: ${TEST_CASE} for API_FLOW: ${API_FLOW}`
  );
}

export const options = {
  scenarios: {
    [API_FLOW.replace(/[^a-zA-Z0-9_]/g, '_')]: {
      ...TEST_CASES[TEST_CASE],
      exec: 'runFlow',
    },
  },
};

export function runFlow() {
  switch (API_FLOW) {
    // ========================= // Auth // =========================
    case 'login':
      loginFlow();
      break;

    case 'signup-supporter':
      signupSupporterFlow();
      break;

    case 'creator-individual':
      signupCreatorIndividualFlow();
      break;

    case 'creator-juristic':
      signupCreatorJuristicFlow();
      break;

    // ========================= // AI Generate // =========================
    case 'ai-generate-content': 
      aiGenerateContentFlow(); 
      break; 
    
    case 'ai-generate-2d': 
      aiGenerate2DFlow(); 
      break; 
      
    case 'ai-generate-3d': 
      aiGenerate3DFlow(); 
      break;

    // ========================= // Landing Page // =========================
    case 'landing':
      landingFlow();
      break;

    default:
      throw new Error(`Unknown API_FLOW: ${API_FLOW}`);
  }
}

// =========================
// HTML Report
// =========================

export function handleSummary(data) {
  const reportPath = __ENV.HTML_REPORT;

  return {
    stdout: textSummary(data, {
      indent: ' ',
      enableColors: true,
    }),

    ...(reportPath
      ? {
          [reportPath]: buildHtmlReport(data),
        }
      : {}),
  };
}

// function buildHtmlReport(data) {
//   const metrics = data.metrics;

//   const checks = metrics.checks?.values || {};
//   const httpReqs = metrics.http_reqs?.values || {};
//   const duration = metrics.http_req_duration?.values || {};
//   const failed = metrics.http_req_failed?.values || {};

//   const iterations = metrics.iterations?.values || {};
//   const iterationDuration = metrics.iteration_duration?.values || {};
//   const vus = metrics.vus?.values || {};
//   const vusMax = metrics.vus_max?.values || {};

//   const dataReceived = metrics.data_received?.values || {};
//   const dataSent = metrics.data_sent?.values || {};

//   const checksPassed = checks.passes || 0;
//   const checksFailed = checks.fails || 0;
//   const totalChecks = checksPassed + checksFailed;

//   const successRate =
//     totalChecks > 0
//       ? ((checksPassed / totalChecks) * 100).toFixed(2)
//       : '0.00';

//   const failedRate =
//     failed.rate !== undefined
//       ? (failed.rate * 100).toFixed(2)
//       : '0.00';

//   const formatMs = (value) =>
//     value !== undefined ? `${value.toFixed(2)} ms` : '-';

//   const formatNumber = (value) =>
//     value !== undefined ? value.toLocaleString() : '-';

//   const formatPercent = (value) =>
//     value !== undefined ? `${(value * 100).toFixed(2)}%` : '-';

//   const p90 = duration['p(90)'];
//   const p95 = duration['p(95)'];
//   const p99 = duration['p(99)'];

//   return `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">

//   <title>${API_FLOW} - ${TEST_CASE}</title>

//   <style>
//     body {
//       font-family: Arial, sans-serif;
//       margin: 40px;
//       background: #f5f5f5;
//       color: #222;
//     }

//     h1 {
//       margin-bottom: 5px;
//     }

//     h2 {
//       margin-top: 40px;
//     }

//     h3 {
//       margin-top: 25px;
//     }

//     .info {
//       margin-bottom: 30px;
//       color: #555;
//       line-height: 1.8;
//     }

//     .grid {
//       display: grid;
//       grid-template-columns: repeat(4, 1fr);
//       gap: 15px;
//     }

//     .card {
//       background: white;
//       padding: 20px;
//       border-radius: 8px;
//       box-shadow: 0 1px 4px rgba(0,0,0,0.1);
//     }

//     .label {
//       color: #666;
//       font-size: 14px;
//     }

//     .value {
//       font-size: 24px;
//       font-weight: bold;
//       margin-top: 8px;
//     }

//     table {
//       width: 100%;
//       margin-top: 15px;
//       border-collapse: collapse;
//       background: white;
//     }

//     th, td {
//       padding: 12px;
//       border-bottom: 1px solid #ddd;
//       text-align: left;
//     }

//     th {
//       background: #eee;
//     }

//     .section {
//       margin-top: 30px;
//     }
//   </style>
// </head>

// <body>

// <h1>K6 Load Test Report</h1>

// <div class="info">
//   <div><b>Environment:</b> ${ENVIRONMENT}</div>
//   <div><b>API Flow:</b> ${API_FLOW}</div>
//   <div><b>Test Case:</b> ${TEST_CASE}</div>
// </div>


// <!-- =========================
//      OVERVIEW
// ========================= -->

// <div class="grid">

//   <div class="card">
//     <div class="label">Total Requests</div>
//     <div class="value">
//       ${formatNumber(httpReqs.count || 0)}
//     </div>
//   </div>

//   <div class="card">
//     <div class="label">Check Success</div>
//     <div class="value">
//       ${successRate}%
//     </div>
//   </div>

//   <div class="card">
//     <div class="label">P95 Response Time</div>
//     <div class="value">
//       ${formatMs(p95)}
//     </div>
//   </div>

//   <div class="card">
//     <div class="label">Max VUs</div>
//     <div class="value">
//       ${formatNumber(vusMax.max || 0)}
//     </div>
//   </div>

// </div>


// <!-- =========================
//      TOTAL RESULTS
// ========================= -->

// <h2>TOTAL RESULTS</h2>


// <!-- CHECKS -->

// <h3>Checks</h3>

// <table>
//   <tr>
//     <th>Metric</th>
//     <th>Value</th>
//   </tr>

//   <tr>
//     <td>Checks Total</td>
//     <td>${formatNumber(totalChecks)}</td>
//   </tr>

//   <tr>
//     <td>Checks Passed</td>
//     <td>${formatNumber(checksPassed)}</td>
//   </tr>

//   <tr>
//     <td>Checks Failed</td>
//     <td>${formatNumber(checksFailed)}</td>
//   </tr>

//   <tr>
//     <td>Check Success Rate</td>
//     <td>${successRate}%</td>
//   </tr>
// </table>


// <!-- HTTP -->

// <h3>HTTP</h3>

// <table>
//   <tr>
//     <th>Metric</th>
//     <th>Value</th>
//   </tr>

//   <tr>
//     <td>Total Requests</td>
//     <td>${formatNumber(httpReqs.count || 0)}</td>
//   </tr>

//   <tr>
//     <td>Failed Requests</td>
//     <td>${failedRate}%</td>
//   </tr>

//   <tr>
//     <td>Average Response Time</td>
//     <td>${formatMs(duration.avg)}</td>
//   </tr>

//   <tr>
//     <td>Min Response Time</td>
//     <td>${formatMs(duration.min)}</td>
//   </tr>

//   <tr>
//     <td>Median Response Time</td>
//     <td>${formatMs(duration.med)}</td>
//   </tr>

//   <tr>
//     <td>Max Response Time</td>
//     <td>${formatMs(duration.max)}</td>
//   </tr>

//   <tr>
//     <td>P90</td>
//     <td>${formatMs(p90)}</td>
//   </tr>

//   <tr>
//     <td>P95</td>
//     <td>${formatMs(p95)}</td>
//   </tr>

//   <tr>
//     <td>P99</td>
//     <td>${formatMs(p99)}</td>
//   </tr>
// </table>


// <!-- EXECUTION -->

// <h3>Execution</h3>

// <table>
//   <tr>
//     <th>Metric</th>
//     <th>Value</th>
//   </tr>

//   <tr>
//     <td>Iterations</td>
//     <td>${formatNumber(iterations.count || 0)}</td>
//   </tr>

//   <tr>
//     <td>Iteration Rate</td>
//     <td>${iterations.rate !== undefined
//       ? iterations.rate.toFixed(2)
//       : '-'} /s</td>
//   </tr>

//   <tr>
//     <td>Iteration Duration Avg</td>
//     <td>${formatMs(iterationDuration.avg)}</td>
//   </tr>

//   <tr>
//     <td>Current VUs</td>
//     <td>${formatNumber(vus.value || 0)}</td>
//   </tr>

//   <tr>
//     <td>Max VUs</td>
//     <td>${formatNumber(vusMax.max || 0)}</td>
//   </tr>
// </table>


// <!-- NETWORK -->

// <h3>Network</h3>

// <table>
//   <tr>
//     <th>Metric</th>
//     <th>Value</th>
//   </tr>

//   <tr>
//     <td>Data Received</td>
//     <td>${formatNumber(dataReceived.count || 0)} bytes</td>
//   </tr>

//   <tr>
//     <td>Data Received Rate</td>
//     <td>${formatNumber(dataReceived.rate || 0)} bytes/s</td>
//   </tr>

//   <tr>
//     <td>Data Sent</td>
//     <td>${formatNumber(dataSent.count || 0)} bytes</td>
//   </tr>

//   <tr>
//     <td>Data Sent Rate</td>
//     <td>${formatNumber(dataSent.rate || 0)} bytes/s</td>
//   </tr>
// </table>

// </body>
// </html>
// `;
// }

function buildHtmlReport(data) {
  const metrics = data.metrics;

  // ============================================================
  // TOTAL metrics
  // ============================================================

  const checks = metrics.checks?.values || {};
  const httpReqs = metrics.http_reqs?.values || {};
  const duration = metrics.http_req_duration?.values || {};
  const failed = metrics.http_req_failed?.values || {};

  const iterations = metrics.iterations?.values || {};
  const iterationDuration = metrics.iteration_duration?.values || {};
  const vus = metrics.vus?.values || {};
  const vusMax = metrics.vus_max?.values || {};

  const dataReceived = metrics.data_received?.values || {};
  const dataSent = metrics.data_sent?.values || {};

  // ============================================================
  // AI metrics
  // ============================================================

  const ai2DRequests =
    metrics.ai_2d_requests?.values?.count || 0;

  const ai2DSuccess201 =
    metrics.ai_2d_success_201?.values?.count || 0;

  const ai2DResponseTime =
    metrics.ai_2d_response_time?.values || {};

  const ai3DRequests =
    metrics.ai_3d_requests?.values?.count || 0;

  const ai3DSuccess201 =
    metrics.ai_3d_success_201?.values?.count || 0;

  const ai3DResponseTime =
    metrics.ai_3d_response_time?.values || {};

  const aiContentRequests =
    metrics.ai_content_requests?.values?.count || 0;

  const aiContentSuccess201 =
    metrics.ai_content_success_201?.values?.count || 0;

  const aiContentResponseTime =
    metrics.ai_content_response_time?.values || {};

  // ============================================================
  // Identify current API flow
  // ============================================================

  const currentApiFlow =
    String(API_FLOW || '')
      .trim()
      .toLowerCase();

  const isContentFlow =
    currentApiFlow === 'ai-generate-content' ||
    currentApiFlow === 'content';

  const is2DFlow =
    currentApiFlow === 'ai-generate-2d' ||
    currentApiFlow === '2d';

  const is3DFlow =
    currentApiFlow === 'ai-generate-3d' ||
    currentApiFlow === '3d';

  const isAiFlow =
    isContentFlow ||
    is2DFlow ||
    is3DFlow;

  // ============================================================
  // Total Checks
  // ============================================================

  const checksPassed = checks.passes || 0;
  const checksFailed = checks.fails || 0;

  const totalChecks =
    checksPassed + checksFailed;

  const successRate =
    totalChecks > 0
      ? ((checksPassed / totalChecks) * 100).toFixed(2)
      : '0.00';

  const failedRate =
    failed.rate !== undefined
      ? (failed.rate * 100).toFixed(2)
      : '0.00';

  // ============================================================
  // Helpers
  // ============================================================

  const formatMs = (value) =>
    value !== undefined && value !== null
      ? `${Number(value).toFixed(2)} ms`
      : '-';

  const formatNumber = (value) =>
    value !== undefined && value !== null
      ? Number(value).toLocaleString()
      : '-';

  const calcSuccessRate = (success, total) =>
    total > 0
      ? ((success / total) * 100).toFixed(2)
      : '0.00';

  const calcErrorRate = (success, total) =>
    total > 0
      ? (((total - success) / total) * 100).toFixed(2)
      : '0.00';

  const p90 = duration['p(90)'];
  const p95 = duration['p(95)'];
  const p99 = duration['p(99)'];

  // ============================================================
  // AI values
  // ============================================================

  const ai2DSuccessRate =
    calcSuccessRate(
      ai2DSuccess201,
      ai2DRequests
    );

  const ai2DErrorRate =
    calcErrorRate(
      ai2DSuccess201,
      ai2DRequests
    );

  const ai3DSuccessRate =
    calcSuccessRate(
      ai3DSuccess201,
      ai3DRequests
    );

  const ai3DErrorRate =
    calcErrorRate(
      ai3DSuccess201,
      ai3DRequests
    );

  const aiContentSuccessRate =
    calcSuccessRate(
      aiContentSuccess201,
      aiContentRequests
    );

  const aiContentErrorRate =
    calcErrorRate(
      aiContentSuccess201,
      aiContentRequests
    );

  // ============================================================
  // AI Generate Section
  //
  // แสดงเฉพาะ flow ที่กำลังรัน
  // ============================================================

  let aiGenerateSection = '';

  if (isContentFlow) {
    aiGenerateSection = `
      <h2>AI GENERATE RESULTS</h2>

      <h3>AI Generate Content</h3>

      <table>

        <tr>
          <th>Metric</th>
          <th>Value</th>
        </tr>

        <tr>
          <td>Total Gen Requests</td>
          <td>${formatNumber(aiContentRequests)}</td>
        </tr>

        <tr>
          <td>201 Success</td>
          <td>${formatNumber(aiContentSuccess201)}</td>
        </tr>

        <tr>
          <td>Error Rate (%)</td>
          <td>${aiContentErrorRate}%</td>
        </tr>

        <tr>
          <td>201 Success Rate (%)</td>
          <td>${aiContentSuccessRate}%</td>
        </tr>

        <tr>
          <td>Avg (ms)</td>
          <td>${formatMs(aiContentResponseTime.avg)}</td>
        </tr>

        <tr>
          <td>P90 (ms)</td>
          <td>${formatMs(aiContentResponseTime['p(90)'])}</td>
        </tr>

        <tr>
          <td>P95 (ms)</td>
          <td>${formatMs(aiContentResponseTime['p(95)'])}</td>
        </tr>

      </table>
    `;
  }

  if (is2DFlow) {
    aiGenerateSection = `
      <h2>AI GENERATE RESULTS</h2>

      <h3>AI Generate 2D</h3>

      <table>

        <tr>
          <th>Metric</th>
          <th>Value</th>
        </tr>

        <tr>
          <td>Total Gen Requests</td>
          <td>${formatNumber(ai2DRequests)}</td>
        </tr>

        <tr>
          <td>201 Success</td>
          <td>${formatNumber(ai2DSuccess201)}</td>
        </tr>

        <tr>
          <td>Error Rate (%)</td>
          <td>${ai2DErrorRate}%</td>
        </tr>

        <tr>
          <td>201 Success Rate (%)</td>
          <td>${ai2DSuccessRate}%</td>
        </tr>

        <tr>
          <td>Avg (ms)</td>
          <td>${formatMs(ai2DResponseTime.avg)}</td>
        </tr>

        <tr>
          <td>P90 (ms)</td>
          <td>${formatMs(ai2DResponseTime['p(90)'])}</td>
        </tr>

        <tr>
          <td>P95 (ms)</td>
          <td>${formatMs(ai2DResponseTime['p(95)'])}</td>
        </tr>

      </table>
    `;
  }

  if (is3DFlow) {
    aiGenerateSection = `
      <h2>AI GENERATE RESULTS</h2>

      <h3>AI Generate 3D</h3>

      <table>

        <tr>
          <th>Metric</th>
          <th>Value</th>
        </tr>

        <tr>
          <td>Total Gen Requests</td>
          <td>${formatNumber(ai3DRequests)}</td>
        </tr>

        <tr>
          <td>201 Success</td>
          <td>${formatNumber(ai3DSuccess201)}</td>
        </tr>

        <tr>
          <td>Error Rate (%)</td>
          <td>${ai3DErrorRate}%</td>
        </tr>

        <tr>
          <td>201 Success Rate (%)</td>
          <td>${ai3DSuccessRate}%</td>
        </tr>

        <tr>
          <td>Avg (ms)</td>
          <td>${formatMs(ai3DResponseTime.avg)}</td>
        </tr>

        <tr>
          <td>P90 (ms)</td>
          <td>${formatMs(ai3DResponseTime['p(90)'])}</td>
        </tr>

        <tr>
          <td>P95 (ms)</td>
          <td>${formatMs(ai3DResponseTime['p(95)'])}</td>
        </tr>

      </table>
    `;
  }

  // ============================================================
  // HTML
  // ============================================================

  return `
<!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="UTF-8">

  <title>${API_FLOW} - ${TEST_CASE}</title>

  <style>

    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      background: #f5f5f5;
      color: #222;
    }

    h1 {
      margin-bottom: 5px;
    }

    h2 {
      margin-top: 40px;
    }

    h3 {
      margin-top: 25px;
    }

    .info {
      margin-bottom: 30px;
      color: #555;
      line-height: 1.8;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
    }

    .card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
    }

    .label {
      color: #666;
      font-size: 14px;
    }

    .value {
      font-size: 24px;
      font-weight: bold;
      margin-top: 8px;
    }

    table {
      width: 100%;
      margin-top: 15px;
      border-collapse: collapse;
      background: white;
    }

    th,
    td {
      padding: 12px;
      border-bottom: 1px solid #ddd;
      text-align: left;
    }

    th {
      background: #eee;
    }

  </style>

</head>

<body>

<h1>K6 Load Test Report</h1>

<div class="info">

  <div>
    <b>Environment:</b> ${ENVIRONMENT}
  </div>

  <div>
    <b>API Flow:</b> ${API_FLOW}
  </div>

  <div>
    <b>Test Case:</b> ${TEST_CASE}
  </div>

</div>


<!-- ============================================================
     OVERVIEW
============================================================ -->

<div class="grid">

  <div class="card">

    <div class="label">
      Total Requests
    </div>

    <div class="value">
      ${formatNumber(httpReqs.count || 0)}
    </div>

  </div>


  <div class="card">

    <div class="label">
      Check Success
    </div>

    <div class="value">
      ${successRate}%
    </div>

  </div>


  <div class="card">

    <div class="label">
      P95 Response Time
    </div>

    <div class="value">
      ${formatMs(p95)}
    </div>

  </div>


  <div class="card">

    <div class="label">
      Max VUs
    </div>

    <div class="value">
      ${formatNumber(vusMax.max || 0)}
    </div>

  </div>

</div>


<!-- ============================================================
     AI GENERATE
     
     แสดงเฉพาะ AI flow ที่กำลังรัน
============================================================ -->

${aiGenerateSection}


<!-- ============================================================
     TOTAL RESULTS
============================================================ -->

<h2>TOTAL RESULTS</h2>


<!-- CHECKS -->

<h3>Checks</h3>

<table>

  <tr>
    <th>Metric</th>
    <th>Value</th>
  </tr>

  <tr>
    <td>Checks Total</td>
    <td>${formatNumber(totalChecks)}</td>
  </tr>

  <tr>
    <td>Checks Passed</td>
    <td>${formatNumber(checksPassed)}</td>
  </tr>

  <tr>
    <td>Checks Failed</td>
    <td>${formatNumber(checksFailed)}</td>
  </tr>

  <tr>
    <td>Check Success Rate</td>
    <td>${successRate}%</td>
  </tr>

</table>


<!-- HTTP -->

<h3>HTTP</h3>

<table>

  <tr>
    <th>Metric</th>
    <th>Value</th>
  </tr>

  <tr>
    <td>Total Requests</td>
    <td>${formatNumber(httpReqs.count || 0)}</td>
  </tr>

  <tr>
    <td>Failed Requests</td>
    <td>${failedRate}%</td>
  </tr>

  <tr>
    <td>Average Response Time</td>
    <td>${formatMs(duration.avg)}</td>
  </tr>

  <tr>
    <td>Min Response Time</td>
    <td>${formatMs(duration.min)}</td>
  </tr>

  <tr>
    <td>Median Response Time</td>
    <td>${formatMs(duration.med)}</td>
  </tr>

  <tr>
    <td>Max Response Time</td>
    <td>${formatMs(duration.max)}</td>
  </tr>

  <tr>
    <td>P90</td>
    <td>${formatMs(p90)}</td>
  </tr>

  <tr>
    <td>P95</td>
    <td>${formatMs(p95)}</td>
  </tr>

  <tr>
    <td>P99</td>
    <td>${formatMs(p99)}</td>
  </tr>

</table>


<!-- EXECUTION -->

<h3>Execution</h3>

<table>

  <tr>
    <th>Metric</th>
    <th>Value</th>
  </tr>

  <tr>
    <td>Iterations</td>
    <td>${formatNumber(iterations.count || 0)}</td>
  </tr>

  <tr>
    <td>Iteration Rate</td>
    <td>
      ${
        iterations.rate !== undefined
          ? iterations.rate.toFixed(2)
          : '-'
      } /s
    </td>
  </tr>

  <tr>
    <td>Iteration Duration Avg</td>
    <td>${formatMs(iterationDuration.avg)}</td>
  </tr>

  <tr>
    <td>Current VUs</td>
    <td>${formatNumber(vus.value || 0)}</td>
  </tr>

  <tr>
    <td>Max VUs</td>
    <td>${formatNumber(vusMax.max || 0)}</td>
  </tr>

</table>


<!-- NETWORK -->

<h3>Network</h3>

<table>

  <tr>
    <th>Metric</th>
    <th>Value</th>
  </tr>

  <tr>
    <td>Data Received</td>
    <td>
      ${formatNumber(dataReceived.count || 0)} bytes
    </td>
  </tr>

  <tr>
    <td>Data Received Rate</td>
    <td>
      ${formatNumber(dataReceived.rate || 0)} bytes/s
    </td>
  </tr>

  <tr>
    <td>Data Sent</td>
    <td>
      ${formatNumber(dataSent.count || 0)} bytes
    </td>
  </tr>

  <tr>
    <td>Data Sent Rate</td>
    <td>
      ${formatNumber(dataSent.rate || 0)} bytes/s
    </td>
  </tr>

</table>

</body>
</html>
`;
}