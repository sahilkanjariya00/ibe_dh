// utils/ibeCrypto.ts
export function pemToArrayBuffer(pem: string): ArrayBuffer {
    const b64 = pem.replace(/-----.*-----/g, "").replace(/\s/g, "");
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

export async function importPublicKey(pem: string): Promise<CryptoKey> {
    return crypto.subtle.importKey(
    "spki",
    pemToArrayBuffer(pem),
    { name: "ECDH", namedCurve: "P-256" },
    true,
    []
    );
}

export async function importPrivateKey(pem: string): Promise<CryptoKey> {
    return crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(pem),
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveBits", "deriveKey"]
    );
}

// Encrypt data with IBE public key.
export async function encryptWithIBE(publicKeyPEM: string, message: string) {
    const publicKey = await importPublicKey(publicKeyPEM);

    // Generate temporary ECDH key pair
    const tempKeyPair = await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveKey"]
    );

    // Derive shared key (from temp private and their public)
    const aesKey = await crypto.subtle.deriveKey(
    {
        name: "ECDH",
        public: publicKey,
    },
    tempKeyPair.privateKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt"]
    );


    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM
    const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    new TextEncoder().encode(message)
    );

    // Export temp public key so receiver can use it to derive the key too
    const exportedPubKey = await crypto.subtle.exportKey("spki", tempKeyPair.publicKey);

    return {
        iv: btoa(String.fromCharCode(...iv)),
        data: btoa(String.fromCharCode(...new Uint8Array(encryptedData))),
        ephemeralPublicKey: btoa(String.fromCharCode(...new Uint8Array(exportedPubKey))),
      };
      
}

// Decrypt data with IBE private key
export async function decryptWithIBE(privateKeyPEM: string, ivB64: string, dataB64: string, senderPubKeyB64: string) {
    const privateKey = await importPrivateKey(privateKeyPEM);

    // Re-import sender's ephemeral public key
    const senderPubKey = await crypto.subtle.importKey(
    "spki",
    Uint8Array.from(atob(senderPubKeyB64), c => c.charCodeAt(0)),
    { name: "ECDH", namedCurve: "P-256" },
    true,
    []
    );

    // Derive shared AES key
    const aesKey = await crypto.subtle.deriveKey(
    {
        name: "ECDH",
        public: senderPubKey,
    },
    privateKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["decrypt"]
    );

    const decrypted = await crypto.subtle.decrypt(
    {
        name: "AES-GCM",
        iv: Uint8Array.from(atob(ivB64), c => c.charCodeAt(0)),
    },
    aesKey,
    Uint8Array.from(atob(dataB64), c => c.charCodeAt(0))
    );

    return new TextDecoder().decode(decrypted);
}

export const readPEMFile = async (file: File): Promise<string> => {
    const text = await file.text();
    return text
      .replace(/-----BEGIN [\w\s]+-----/, '')
      .replace(/-----END [\w\s]+-----/, '')
      .replace(/\s+/g, '');
};

export const readPEMText = async (text: string): Promise<string> => {
    return text
      .replace(/-----BEGIN [\w\s]+-----/, '')
      .replace(/-----END [\w\s]+-----/, '')
      .replace(/\s+/g, '');
};
  