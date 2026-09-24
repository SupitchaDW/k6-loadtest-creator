const ENV = __ENV.ENVIRONMENT || 'sit';

export const BASE_URL = {
  //sit: 'https://api-sit.fc-creator.datawow.io',
  sit: 'http://api-loadtest.fc-creator.datawow.io',
  web: 'http://loadtest.fc-creator.datawow.io',
  // uat: 'https://uat.example.com',
  // prod: 'https://example.com',
}[ENV];

if (!BASE_URL) {
  throw new Error(
    `Invalid ENVIRONMENT: ${ENV}. Available: sit, uat, prod`
  );
}

export const CONFIG = {
  environment: ENV,
  baseUrl: BASE_URL,
  loginPath: '/v1/auth/sign-in',
  signUpPath: '/v1/auth/sign-up',
  registerBusinessPath: '/v1/users/register-business',
  aiGenerate2DPath: '/v1/ai-generate/2d',
  aiGenerate3DPath: '/v1/ai-generate/3d/preview',
  aiGenerateContentPath: '/v1/ai-generate/content',


  aiGenerate2DTimeout: '300s',
  aiGenerate3DTimeout: '300s',
  aiGenerateContentTimeout: '300s',


  username: __ENV.TEST_USERNAME,
  password: __ENV.TEST_PASSWORD,
  deviceId: __ENV.DEVICE_ID,
  timeout: __ENV.TIMEOUT || '30s',
  aiGenerateTaskDeleteTimeout: '300s',
};


export function jsonHeaders(token) {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}
