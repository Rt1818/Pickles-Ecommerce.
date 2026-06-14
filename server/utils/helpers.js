/**
 * Generate a unique order number like SP-20260614-A3K9
 */
function generateOrderNumber() {
  const date = new Date();
  const dateStr = date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let suffix = '';
  for (let i = 0; i < 4; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SP-${dateStr}-${suffix}`;
}

/**
 * Calculate estimated delivery date
 */
function getEstimatedDelivery(deliveryType = 'standard') {
  const now = new Date();
  const days = deliveryType === 'express' ? 3 : 7;
  now.setDate(now.getDate() + days);
  return now.toISOString().split('T')[0];
}

/**
 * Sanitize user object (remove password hash)
 */
function sanitizeUser(user) {
  if (!user) return null;
  const { password_hash, ...safe } = user;
  return safe;
}

module.exports = { generateOrderNumber, getEstimatedDelivery, sanitizeUser };
