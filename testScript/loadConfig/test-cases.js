export const LOGIN_TEST_CASES = {

  // TC001 - Smoke
  TC001: {
    executor: 'per-vu-iterations',
    vus: 10,
    iterations: 1,
    maxDuration: '1m',
  },
};


export const REGISTER_TEST_CASES = {

  // TC001 - Smoke
  TC001: {
    executor: 'per-vu-iterations',
    vus: 10,
    iterations: 1,
    maxDuration: '1m',
  },

  // TC002 - Concurrent Capacity
  // Run: 100 → 250 → 300 → 350 VUs
  TC002: {
    executor: 'per-vu-iterations',
    vus: 300,
    iterations: 1,
    maxDuration: '5m',
  },

  // TC003 - Sustained Load
  TC003: {
    executor: 'constant-arrival-rate',
    rate: 10,
    timeUnit: '1s',

    duration: '10m',

    preAllocatedVUs: 93,
    maxVUs: 150,
  },

  // TC004 - Spike
  TC004: {
    executor: 'ramping-vus',

    startVUs: 20,

    stages: [
      { duration: '1m', target: 20 },
      { duration: '30s', target: 60 },
      { duration: '2m', target: 60 },
      { duration: '1m', target: 20 },
      { duration: '2m', target: 20 },
      { duration: '1m', target: 0 },
    ],
  },

  // TC005 - Stress
  TC005: {
    executor: 'ramping-vus',

    startVUs: 0,

    stages: [
      { duration: '1m', target: 40 },
      { duration: '1m', target: 50 },
      { duration: '1m', target: 60 },
      { duration: '1m', target: 75 },
      { duration: '2m', target: 75 },
      { duration: '1m', target: 0 },
    ],
  },
};


export const AI_TEST_CASES = {

  // TC001 - Smoke
  TC001: {
    executor: 'per-vu-iterations',
    vus: 2,
    iterations: 1,
    maxDuration: '1m',
  },

  // TC002 - Capacity
  TC002: {
    executor: 'per-vu-iterations',

    // 20 → 40 → 60 → 80 → 100
    vus: 100,
    iterations: 1,
    maxDuration: '2m',
  },

  // TC003 - Sustained Load
  TC003: {
  executor: 'constant-arrival-rate',

  // 20 signup flows per second
  rate: 20,
  timeUnit: '1s',

  duration: '10m',

  preAllocatedVUs: 150,
  maxVUs: 300,
},

  // TC004 - Spike
  TC004: {
    executor: 'ramping-vus',
    startVUs: 20,

    stages: [
      { duration: '1m', target: 20 },
      { duration: '30s', target: 120 },
      { duration: '2m', target: 120 },
      { duration: '1m', target: 20 },
      { duration: '2m', target: 20 },
      { duration: '1m', target: 0 },
    ],
  },

  // TC005 - Stress
  TC005: {
    executor: 'ramping-vus',
    startVUs: 20,

    stages: [
      { duration: '1m', target: 40 },
      { duration: '1m', target: 60 },
      { duration: '1m', target: 80 },
      { duration: '1m', target: 100 },
      { duration: '1m', target: 120 },
      { duration: '1m', target: 140 },

      // Hold the observed stress point
      { duration: '2m', target: 140 },

      { duration: '1m', target: 0 },
    ],
  },

};