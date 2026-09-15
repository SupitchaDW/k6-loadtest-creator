import { signUpCreator } from '../../helpers/signup.js';
import { logResponse } from '../../helpers/logger.js';
import { CREATOR_JURISTIC_DATA } from '../../data/signup-data.js';

export function signupCreatorJuristicFlow() {
  const result = signUpCreator(CREATOR_JURISTIC_DATA);

  logResponse('Creator Juristic - Signup', result.signUpRes);
  logResponse('Creator Juristic - Register Creator', result.businessRes);
  console.log(`[Creator Juristic] Email: ${result.email}`);

  return result;
}