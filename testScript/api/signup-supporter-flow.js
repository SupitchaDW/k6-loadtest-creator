import { signUpSupporter } from '../../helpers/signup.js';
import { logResponse } from '../../helpers/logger.js';
import { SUPPORTER_DATA } from '../../data/signup-data.js';

export function signupSupporterFlow() {
  const result = signUpSupporter(SUPPORTER_DATA);

  logResponse('Signup Supporter', result.res);
  console.log(`[Signup Supporter] Email: ${result.email}`);

  return result;
}