import { SharedArray } from 'k6/data';
import { signUpCreator } from '../helpers/signup.js';

const CREATOR_POOL = new SharedArray(
  'creator-pool',
  function () {
    return JSON.parse(open('../data/creator-pool.json'));
  }
);

export const options = {
  scenarios: {
    create_creator_pool: {
      executor: 'per-vu-iterations',
      vus: CREATOR_POOL.length,
      iterations: 1,
      maxDuration: '15m',
    },
  },
};

export default function () {
  const user = CREATOR_POOL[__VU - 1];

  console.log(
    `[Creator Pool] VU ${__VU}/${CREATOR_POOL.length} | Creating ${user.email}`
  );

  const result = signUpCreator({
    email: user.email,
    password: __ENV.TEST_PASSWORD,

    firstName: 'k6',
    lastName: 'test',
    phoneNumber: '0200000000',
    dateOfBirth: '1995-05-15',
    gender: 'UNDISCLOSED',

    userDisplayName: user.userDisplayName,
    creatorDisplayName: user.creatorDisplayName,

    businessData: {
      businessProfileType: 'INDIVIDUAL',
      isSeller: true,
      isCreator: false,

      basicInformation: {
        phoneNumber: '0200000000',
        firstName: 'k6',
        lastName: 'test',
        dateOfBirth: '1995-05-15',
      },
    },
  });

  if (result.success) {
    console.log(
      `[Creator Pool] SUCCESS | ${user.email}`
    );
  } else {
    console.log(
      `[Creator Pool] FAILED | ${user.email}`
    );

    if (result.signUpRes) {
      console.log(
        `[Creator Pool] Signup status: ${result.signUpRes.status}`
      );

      console.log(
        `[Creator Pool] Signup response: ${result.signUpRes.body}`
      );
    }

    if (result.businessRes) {
      console.log(
        `[Creator Pool] Register Creator status: ${result.businessRes.status}`
      );

      console.log(
        `[Creator Pool] Register Creator response: ${result.businessRes.body}`
      );
    }
  }
}

