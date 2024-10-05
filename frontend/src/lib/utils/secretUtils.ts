import { ethers } from 'ethers';
import crypto from 'crypto';
import { initialize, Proof } from 'zokrates-js';
// Importing Constants
import { SECURITY_QUESTIONS } from '@/lib/constants/questions';

// Lazy loading JSON
const getArtifactsJson = () => import('@/lib/json/artifacts.json');
const getKeypairJson = () => import('@/lib/json/keypair.json');

// Cache for deserialized data
let cachedArtifacts: Artifacts | null = null;
let cachedKeypair: Keypair | null = null;

type SerializedArtifacts = {
  program: string;
  abi: any;
  snarkjs?: {
    program: string;
  };
  constraintCount: number;
};

type Artifacts = {
  program: Uint8Array;
  abi: any;
  snarkjs?: {
    program: Uint8Array;
  };
  constraintCount: number;
};

type SerializedKeypair = {
  vk: any;
  pk: string;
};

type Keypair = {
  vk: any;
  pk: Uint8Array;
};

export function deserializeArtifacts(
  serializedArtifacts: SerializedArtifacts
): Artifacts {
  return {
    program: new Uint8Array(Buffer.from(serializedArtifacts.program, 'base64')),
    abi: serializedArtifacts.abi,
    snarkjs: serializedArtifacts.snarkjs
      ? {
          program: new Uint8Array(
            Buffer.from(serializedArtifacts.snarkjs.program, 'base64')
          ),
        }
      : undefined,
    constraintCount: serializedArtifacts.constraintCount,
  };
}

export function deserializeKeypair(
  serializedKeypair: SerializedKeypair
): Keypair {
  return {
    vk: deserializeVerificationKey(serializedKeypair.vk),
    pk: deserializeProvingKey(serializedKeypair.pk),
  };
}

function deserializeVerificationKey(serializedVk: any): any {
  return JSON.parse(JSON.stringify(serializedVk), (key, value) => {
    if (value && value.type === 'Uint8Array' && value.data) {
      return new Uint8Array(Buffer.from(value.data, 'base64'));
    }
    return value;
  });
}

function deserializeProvingKey(serializedPk: string): Uint8Array {
  return new Uint8Array(Buffer.from(serializedPk, 'base64'));
}

export function sha512(input: string): Buffer {
  return crypto
    .createHash('sha512')
    .update(Buffer.from(input, 'utf8'))
    .digest();
}

export function sha256(input: string | Buffer): Buffer {
  return crypto
    .createHash('sha256')
    .update(Buffer.isBuffer(input) ? input : Buffer.from(input, 'utf8'))
    .digest();
}

export function split512BitHashTo128BitFields(hash: Buffer): string[] {
  if (hash.length !== 64) {
    throw new Error('Input hash must be 512 bits (64 bytes)');
  }

  const fields: string[] = [];
  for (let i = 0; i < 4; i++) {
    const start = i * 16;
    const end = start + 16;
    const field = BigInt(`0x${hash.slice(start, end).toString('hex')}`);
    fields.push(field.toString());
  }

  return fields;
}

export function splitAddressTo128BitFields(address: string): [string, string] {
  address = address.startsWith('0x') ? address.slice(2) : address;

  if (address.length !== 40) {
    throw new Error('Invalid Ethereum address length');
  }

  const paddedAddress = address.padStart(64, '0');

  const address0 = BigInt(`0x${paddedAddress.slice(0, 32)}`).toString();
  const address1 = BigInt(`0x${paddedAddress.slice(32)}`).toString();

  return [address0, address1];
}

export function sha256PackedTo128BitFields(
  a: string,
  b: string,
  c: string,
  d: string
): [string, string] {
  const inputs = [a, b, c, d].map(
    (x) => BigInt(x) & BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF')
  );

  const buffer = Buffer.alloc(64);

  inputs.forEach((input, index) => {
    // @ts-expect-error - Argument of type 'bigint' is not assignable to parameter of type 'number'
    buffer.writeBigUInt64BE(input >> 64n, index * 16);
    buffer.writeBigUInt64BE(
      input & BigInt('0xFFFFFFFFFFFFFFFF'),
      index * 16 + 8
    );
  });

  const hash = sha256(buffer);

  const e = BigInt(`0x${hash.slice(0, 16).toString('hex')}`);
  const f = BigInt(`0x${hash.slice(16, 32).toString('hex')}`);

  return [e.toString(), f.toString()];
}

async function getDeserializedArtifacts(): Promise<Artifacts> {
  if (cachedArtifacts) return cachedArtifacts;
  const { default: artifactsJson } = await getArtifactsJson();
  cachedArtifacts = deserializeArtifacts(
    artifactsJson as unknown as SerializedArtifacts
  );
  return cachedArtifacts;
}

async function getDeserializedKeypair(): Promise<Keypair> {
  if (cachedKeypair) return cachedKeypair;
  const { default: keypairJson } = await getKeypairJson();
  cachedKeypair = deserializeKeypair(
    keypairJson as unknown as SerializedKeypair
  );
  return cachedKeypair;
}

export function generateHash(secret: string): string {
  const hash512 = ethers.sha512(ethers.toUtf8Bytes(secret));
  const hash256 = ethers.sha256(hash512);
  return hash256;
}

export async function generateProof(
  secret: string,
  address: string
): Promise<Proof> {
  const secretHash = sha512(secret);
  const secretHashSplitted = split512BitHashTo128BitFields(secretHash);
  // @ts-expect-error - Argument of type 'string' is not assignable to parameter of type 'Buffer'
  const hashSplitted = sha256PackedTo128BitFields(...secretHashSplitted);
  const senderSplitted = splitAddressTo128BitFields(address.toLowerCase());

  const secretInputs = [
    ...secretHashSplitted,
    ...hashSplitted,
    ...senderSplitted,
  ];

  const zokrates = await initialize();

  const artifacts = await getDeserializedArtifacts();
  const keypair = await getDeserializedKeypair();

  const { witness } = zokrates.computeWitness(artifacts, secretInputs);
  const proof = zokrates.generateProof(artifacts.program, witness, keypair.pk);

  return proof;
}

export function serializeQuestionsAndAnswers(
  selectedQuestions: string[],
  answers: string[]
): string {
  return selectedQuestions.reduce((acc, questionIndex, i) => {
    const question = SECURITY_QUESTIONS[parseInt(questionIndex)].replace(
      /\s+/g,
      ''
    );
    const answer = answers[i].replace(/\s+/g, '');
    return acc + question + answer;
  }, '');
}
