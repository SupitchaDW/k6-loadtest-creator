import { signUpCreator } from '../../helpers/signup.js';
import { logResponse } from '../../helpers/logger.js';
import { CREATOR_INDIVIDUAL_DATA } from '../../data/signup-data.js';

export function signupCreatorIndividualFlow() {
  const result = signUpCreator(CREATOR_INDIVIDUAL_DATA);

  logResponse('Creator Individual - Signup', result.signUpRes);
  logResponse('Creator Individual - Register Creator', result.businessRes);
  console.log(`[Creator Individual] Email: ${result.email}`);

  return result;
}