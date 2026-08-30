import "server-only";
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

import { getServerEnvironment } from "@/lib/server/env";
import { AppError } from "@/lib/server/errors";

const key = () => {
  const value = getServerEnvironment().CLARIO_HANA_ENCRYPTION_KEY;
  if (!value) {
    throw new AppError(
      "DEPENDENCY_UNAVAILABLE",
      "Credential encryption is not configured.",
      503
    );
  }
  return Buffer.from(value, "hex");
};

export const encryptSecret = (secret: string) => {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const ciphertext = Buffer.concat([
    cipher.update(secret, "utf-8"),
    cipher.final(),
  ]);
  return {
    ciphertext: Buffer.concat([ciphertext, cipher.getAuthTag()]).toString(
      "base64"
    ),
    nonce: iv.toString("base64"),
  };
};

export const decryptSecret = (ciphertext: string, nonce: string) => {
  const payload = Buffer.from(ciphertext, "base64");
  const decipher = createDecipheriv(
    "aes-256-gcm",
    key(),
    Buffer.from(nonce, "base64")
  );
  decipher.setAuthTag(payload.subarray(-16));
  return Buffer.concat([
    decipher.update(payload.subarray(0, -16)),
    decipher.final(),
  ]).toString("utf-8");
};

export const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");
