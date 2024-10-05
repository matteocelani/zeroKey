import { ethers } from 'ethers';

export function generateHash(secret: string): string {
  const hash512 = ethers.sha512(ethers.toUtf8Bytes(secret));
  const hash256 = ethers.sha256(hash512);
  return hash256;
}
