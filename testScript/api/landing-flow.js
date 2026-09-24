import { sleep } from 'k6';
import { landingPage } from '../../helpers/landing.js';

export function landingFlow() {
  landingPage();

  sleep(1);
}