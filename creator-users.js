import { SharedArray } from 'k6/data';

export const CREATOR_USERS = new SharedArray(
  'creator-pool',
  function () {
    return JSON.parse(
      open('./data/creator-pool.json')
    );
  }
);
