import crypto from 'k6/crypto';
import encoding from 'k6/encoding';

const JWT_SALT = __ENV.JWT_SALT || '';

function base64UrlEncode(str) {
  return encoding.b64encode(str, 'rawurl');
}

/**
 * สร้าง JWT Token ตรงตาม Format ของ fc-creator-backend
 * (src/shared/common/common.crypto.ts -> encodeUserJwt)
 *
 * @param {Object} entity
 * @param {string} entity.userId - User ID ในฐานข้อมูล
 * @param {string} [entity.accountId] - Account ID ในฐานข้อมูล (default เป็น userId)
 * @param {boolean} [entity.isCreator] - สถานะ Creator (default: false)
 * @param {boolean} [entity.isSeller] - สถานะ Seller (default: false)
 * @param {boolean} [entity.isBusinessActive] - สถานะ Business (default: false)
 * @param {number} [expiresInSeconds] - อายุ token เป็นวินาที (default: 3600 = 1 ชม.)
 * @returns {string} Bearer JWT Token
 */
export function generateUserJwt(entity, expiresInSeconds = 3600) {
  const salt = __ENV.JWT_SALT || JWT_SALT;
  if (!salt) {
    throw new Error('JWT_SALT is required in .env or environment variable');
  }

  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    message: {
      accountType: 'CUSTOMER',
      userId: entity.userId,
      accountId: entity.accountId || entity.userId,
      isCreator: entity.isCreator || false,
      isSeller: entity.isSeller || false,
      isBusinessActive: entity.isBusinessActive || false,
    },
    iat: now,
    exp: now + expiresInSeconds,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto.hmac('sha256', salt, dataToSign, 'rawurl');

  return `${dataToSign}.${signature}`;
}
