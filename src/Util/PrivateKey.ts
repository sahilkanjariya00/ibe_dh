// Private key decryption after receiving from server.
async function decryptPrivateKey(
  encryptedHex: string,
  saltHex: string,
  password: string
): Promise<string> {
  const encryptedData = Uint8Array.from(
    encryptedHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );
  const salt = Uint8Array.from(
    saltHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );

  // Derive the key
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const key = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );

  const nonce = encryptedData.slice(0, 12); // First 12 bytes
  const ciphertext = encryptedData.slice(12); // Remaining bytes

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: nonce,
    },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
}

// Encrypte privte key for secure localstorage purpose
async function encryptPrivateKeyLocally(
  privateKeyPEM: string,
  password: string
): Promise<{ encryptedHex: string; saltHex: string }> {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const key = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );

  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    new TextEncoder().encode(privateKeyPEM)
  );

  // Combine IV + encrypted content
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);

  return {
    encryptedHex: Array.from(combined)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""),
    saltHex: Array.from(salt)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""),
  };
}

// Decrypt privte key for secure localstorage purpose
async function decryptPrivateKeyLocally(
  encryptedHex: string,
  saltHex: string,
  password: string
): Promise<string> {
  const encryptedBytes = Uint8Array.from(
    encryptedHex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16))
  );
  const salt = Uint8Array.from(
    saltHex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16))
  );

  const iv = encryptedBytes.slice(0, 12);
  const ciphertext = encryptedBytes.slice(12);

  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const key = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
}

export {
  decryptPrivateKey,
  encryptPrivateKeyLocally,
  decryptPrivateKeyLocally,
};
