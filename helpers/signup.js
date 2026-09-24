import http from 'k6/http';
import { check } from 'k6';
import { CONFIG, jsonHeaders } from './config.js';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';


export function buildUniqueEmail(prefix = 'k6lt_user') {
  return `${prefix}_${__VU}_${__ITER}_${Date.now()}@example.com`;
}
export function buildUniqueUserDisplayName() {
  return `k6lt_user_${__VU}_${__ITER}_${Date.now()}`;
}
export function buildUniqueCreatorDisplayName() {
  return `k6lt_creator_${__VU}_${__ITER}_${Date.now()}`;
}


export function signUpUser(data = {}, options = {}) {
  const email = data.email || buildUniqueEmail();
  const displayName = data.displayName || data.userDisplayName || buildUniqueUserDisplayName();
  const idempotencyKey = uuidv4();

  const signUpPayload = {
    email,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    displayName,
    phoneNumber: data.phoneNumber,
    dateOfBirth: data.dateOfBirth,
    gender: data.gender,

    ...(data.legalEntityNumber
      ? { legalEntityNumber: data.legalEntityNumber }
      : {}),

    ...(data.address
      ? { address: data.address }
      : {}),
  };

  const res = http.post(
    `${CONFIG.baseUrl}${CONFIG.signUpPath}`,
    JSON.stringify(signUpPayload),
    {
      headers: {
        ...jsonHeaders(),
        'idempotency-key': idempotencyKey,
        'x-device': CONFIG.deviceId,
      },
      timeout: CONFIG.timeout,
      tags: {
        api: 'sign-up',
        signup_type: options.signupType || 'supporter',
        api_flow: options.apiFlow || __ENV.API_FLOW || 'signup-supporter',
        test_case: options.testCase || __ENV.TEST_CASE || 'TC01',
        environment: __ENV.ENVIRONMENT || 'sit',
      },
    }
  );

  check(res, {
    'user signup returns 2xx': (r) =>
      r.status >= 200 && r.status < 300,
  });

  let token = null;
  try {
    const body = res.json();
    token =
      body.data?.token ||
      body.token ||
      body.data?.accessToken ||
      body.accessToken ||
      null;
  } catch (_) {}

  return {
    res,
    token,
    email,
    displayName,
    success: res.status >= 200 && res.status < 300 && !!token,
  };
}

export function registerBusiness(token, businessData = {}, options = {}) {
  const businessRes = http.post(
    `${CONFIG.baseUrl}${CONFIG.registerBusinessPath}`,
    JSON.stringify(businessData),
    {
      headers: {
        ...jsonHeaders(),
        'Authorization': `Bearer ${token}`,
        'x-device': CONFIG.deviceId,
      },
      timeout: CONFIG.timeout,
      tags: {
        api: 'register-business',
        api_flow: options.apiFlow || __ENV.API_FLOW || 'creator-individual',
        test_case: options.testCase || __ENV.TEST_CASE,
        environment: __ENV.ENVIRONMENT || 'sit',
      },
    }
  );

  check(businessRes, {
    'register creator returns 2xx': (r) =>
      r.status >= 200 && r.status < 300,
  });

  return businessRes;
}

export function signUpSupporter(data = {}) {
  const result = signUpUser(data, {
    signupType: 'supporter',
    apiFlow: __ENV.API_FLOW || 'signup-supporter',
    testCase: __ENV.TEST_CASE || 'TC01',
  });

  return {
    res: result.res,
    token: result.token,
    email: result.email,
    displayName: result.displayName,
    success: result.success,
  };
}

export function signUpCreator(data = {}) {
  const creatorDisplayName = data.creatorDisplayName || buildUniqueCreatorDisplayName();

  // Step 1: Sign up user & get token
  const userResult = signUpUser(
    {
      ...data,
      displayName: data.userDisplayName || data.displayName,
    },
    {
      signupType: 'creator',
      apiFlow: __ENV.API_FLOW || 'creator-individual',
      testCase: __ENV.TEST_CASE,
    }
  );

  if (!userResult.success || !userResult.token) {
    return {
      success: false,
      step: 'sign-up',
      email: userResult.email,
      userDisplayName: userResult.displayName,
      creatorDisplayName,
      signUpRes: userResult.res,
      token: null,
    };
  }

  // Step 2: Register business using token
  const businessPayload = {
    ...data.businessData,
    basicInformation: {
      ...data.businessData?.basicInformation,
      displayName: creatorDisplayName,
    },
  };

  const businessRes = registerBusiness(userResult.token, businessPayload, {
    apiFlow: __ENV.API_FLOW || 'creator-individual',
    testCase: __ENV.TEST_CASE,
  });

  return {
    success: businessRes.status >= 200 && businessRes.status < 300,
    email: userResult.email,
    userDisplayName: userResult.displayName,
    creatorDisplayName,
    token: userResult.token,
    signUpRes: userResult.res,
    businessRes,
  };
}