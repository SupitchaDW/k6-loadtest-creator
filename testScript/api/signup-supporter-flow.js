import { signUpSupporter } from '../../helpers/signup.js';
import { logResponse } from '../../helpers/logger.js';
import { SUPPORTER_DATA } from '../../data/signup-data.js';

export function signupSupporterFlow() {
  const result = signUpSupporter(SUPPORTER_DATA);

  logResponse('Signup Supporter', result.res);
  console.log(`[Signup Supporter] Email: ${result.email}`);

  if (result.res && result.res.status >= 200 && result.res.status < 300) {
    console.log(
      `[USER_EXPORT] ${JSON.stringify({
        token: result.token,
        email: result.email,
        password: SUPPORTER_DATA.password,
        firstName: SUPPORTER_DATA.firstName,
        lastName: SUPPORTER_DATA.lastName,
        displayName: result.displayName,
        phoneNumber: SUPPORTER_DATA.phoneNumber,
        dateOfBirth: SUPPORTER_DATA.dateOfBirth,
        gender: SUPPORTER_DATA.gender,
      })}`
    );
  }

  return result;
}