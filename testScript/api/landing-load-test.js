import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';

import { landingFlow } from './landing-flow.js';
import { LANDING_TEST_CASES } from '../loadConfig/test-cases.js';

const TEST_CASE = __ENV.TEST_CASE || 'TC001';
const ENVIRONMENT = __ENV.ENVIRONMENT || 'web';
const API_FLOW = 'landing';

if (!LANDING_TEST_CASES[TEST_CASE]) {
  throw new Error(`Unknown TEST_CASE: ${TEST_CASE}`);
}

export const options = {
  scenarios: {
    landing: {
      ...LANDING_TEST_CASES[TEST_CASE],
      exec: 'runLanding',
    },
  },
};

export function runLanding() {
  landingFlow();
}


// ============================================================
// HTML REPORT
// ============================================================

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


function buildHtmlReport(data) {
  const metrics = data.metrics;

  const checks = metrics.checks?.values || {};
  const httpReqs = metrics.http_reqs?.values || {};
  const duration = metrics.http_req_duration?.values || {};
  const failed = metrics.http_req_failed?.values || {};

  const iterations = metrics.iterations?.values || {};
  const iterationDuration =
    metrics.iteration_duration?.values || {};

  const vus = metrics.vus?.values || {};
  const vusMax = metrics.vus_max?.values || {};

  const dataReceived =
    metrics.data_received?.values || {};

  const dataSent =
    metrics.data_sent?.values || {};


  // ============================================================
  // Checks
  // ============================================================

  const checksPassed = checks.passes || 0;
  const checksFailed = checks.fails || 0;

  const totalChecks =
    checksPassed + checksFailed;

  const successRate =
    totalChecks > 0
      ? ((checksPassed / totalChecks) * 100).toFixed(2)
      : '0.00';


  // ============================================================
  // HTTP
  // ============================================================

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


  const p90 = duration['p(90)'];
  const p95 = duration['p(95)'];
  const p99 = duration['p(99)'];


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

<h2>LANDING PAGE RESULTS</h2>

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