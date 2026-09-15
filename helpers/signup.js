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


export function signUpSupporter(data = {}) {
  const email = buildUniqueEmail();
  const displayName = buildUniqueUserDisplayName();
  const idempotencyKey = uuidv4();

  const payload = JSON.stringify({
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
  });

  const res = http.post(
    `${CONFIG.baseUrl}${CONFIG.signUpPath}`,
    payload,
    {
      headers: {
        ...jsonHeaders(),

        // Required by Sign Up API
        'Idempotency-Key': idempotencyKey,

        // Required by Auth API
        'x-device': CONFIG.deviceId,
      },

      timeout: CONFIG.timeout,

      tags: {
        api: 'sign-up',
        signup_type: 'supporter',
        api_flow: __ENV.API_FLOW || 'signup-supporter',
        test_case: __ENV.TEST_CASE || 'TC01',
        environment: __ENV.ENVIRONMENT || 'sit',
      },
    }
  );

  check(res, {
    'supporter signup returns 2xx': (r) =>
      r.status >= 200 && r.status < 300,
  });

  // console.log(`Signup status: ${res.status}`);
  // console.log(`Email: ${email}`);

  return {
    res,
    email,
    displayName,
  };
}


export function signUpCreator(data = {}) {
  const email = data.email || buildUniqueEmail();
  const userDisplayName = data.userDisplayName || buildUniqueUserDisplayName();
  const creatorDisplayName = data.creatorDisplayName || buildUniqueCreatorDisplayName();
  const idempotencyKey = uuidv4();


  // Step 1-2: Sign Up User
  const signUpPayload = {
    email,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    displayName: userDisplayName,
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

  const signUpRes = http.post(
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
        signup_type: 'creator',
        api_flow: __ENV.API_FLOW || 'signup-supporter',
        test_case: __ENV.TEST_CASE || 'TC01',
        environment: __ENV.ENVIRONMENT || 'sit',
      },
    }
  );

  check(signUpRes, {
    'creator user signup returns 2xx': (r) =>
      r.status >= 200 && r.status < 300,
  });

  if (
    signUpRes.status < 200 ||
    signUpRes.status >= 300
  ) {
    // console.log(`Signup status: ${signUpRes.status}`);
    // console.log(`Response: ${signUpRes.body}`);

    return {
      success: false,
      step: 'sign-up',
      email,
      userDisplayName,
      creatorDisplayName,
      signUpRes,
    };
  }

  // Get token
  const signUpBody = signUpRes.json();
  const token = signUpBody.data?.token;

  if (!token) {
    console.log('Sign Up response does not contain token');

    return {
      success: false,
      step: 'sign-up-token',
      email,
      userDisplayName,
      creatorDisplayName,
      signUpRes,
    };
  }


  // Register as Creator
  const businessPayload = {
    ...data.businessData,

    basicInformation: {
      ...data.businessData.basicInformation,
      displayName: creatorDisplayName,
    },
  };

  // console.log(`Register Business URL: ${CONFIG.baseUrl}${CONFIG.registerBusinessPath}`);

  const businessRes = http.post(
    `${CONFIG.baseUrl}${CONFIG.registerBusinessPath}`,
    JSON.stringify(businessPayload),
    {
      headers: {
        ...jsonHeaders(),
        'Authorization': `Bearer ${token}`,
        // 'idempotency-key': idempotencyKey,
        'x-device': CONFIG.deviceId,
      },

      timeout: CONFIG.timeout,

      tags: {
        api: 'register-business',
        api_flow: __ENV.API_FLOW || 'creator-individual',
        test_case: __ENV.TEST_CASE || 'TC01',
        environment: __ENV.ENVIRONMENT || 'sit',
      },
    }
  );

  check(businessRes, {
    'register creator returns 2xx': (r) =>
      r.status >= 200 && r.status < 300,
  });

  return {
    success:
      businessRes.status >= 200 &&
      businessRes.status < 300,

    email,
    userDisplayName,
    creatorDisplayName,
    signUpRes,
    businessRes,
  };
}