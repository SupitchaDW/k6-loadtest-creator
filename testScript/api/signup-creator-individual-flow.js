import { registerBusiness, buildUniqueCreatorDisplayName } from '../../helpers/signup.js';
import { logResponse } from '../../helpers/logger.js';
import { CREATOR_INDIVIDUAL_DATA } from '../../data/signup-data.js';
import { USERS } from '../../data/supporter-users.js';
import { login } from '../../helpers/auth.js';

export function signupCreatorIndividualFlow() {
  const user = USERS[(__VU - 1) % USERS.length];
  const creatorDisplayName = buildUniqueCreatorDisplayName();

  // ใช้ Token จาก JSON หรือ login ถ้าไม่มี token ในไฟล์
  let token = user.token;
  if (!token) {
    const auth = login(user.email, user.password);
    token = auth.token;
  }

  const businessPayload = {
    ...CREATOR_INDIVIDUAL_DATA.businessData,
    basicInformation: {
      ...CREATOR_INDIVIDUAL_DATA.businessData?.basicInformation,
      displayName: creatorDisplayName,
      phoneNumber: user.phoneNumber || '0200000000',
      firstName: user.firstName || 'ploy',
      lastName: user.lastName || 'test',
      dateOfBirth: user.dateOfBirth || '1995-05-15',
    },
  };

  // ยิงเฉพาะ register-business เส้นเดียว
  const businessRes = registerBusiness(token, businessPayload, {
    apiFlow: __ENV.API_FLOW || 'creator-individual',
    testCase: __ENV.TEST_CASE,
  });

  logResponse('Creator Individual - Register Creator', businessRes);
  console.log(`[Creator Individual] User: ${user.email}`);

  return {
    success: businessRes.status >= 200 && businessRes.status < 300,
    email: user.email,
    creatorDisplayName,
    token,
    businessRes,
  };
}