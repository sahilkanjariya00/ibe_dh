// dh.ts
import { x25519 } from '@noble/curves/ed25519';

export function generateDHKeys() {
  const privateKey = x25519.utils.randomPrivateKey(); // 32-byte Uint8Array
  const publicKey = x25519.getPublicKey(privateKey); // g^α or g^β
  return { privateKey, publicKey };
}

export function computeSharedSecret(theirPublicKey: Uint8Array, myPrivateKey: Uint8Array) {
  return x25519.getSharedSecret(myPrivateKey, theirPublicKey); // g^αβ
}
