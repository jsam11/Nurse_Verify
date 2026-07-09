import "server-only";

import crypto from "crypto";

export function createPlainApiKey() {
  return `nv_live_${crypto.randomBytes(24).toString("base64url")}`;
}

export function hashApiKey(key: string) {
  return crypto.createHash("sha256").update(key).digest("hex");
}

export function getApiKeyPrefix(key: string) {
  return `${key.slice(0, 11)}...${key.slice(-4)}`;
}
