// hashUtils.js

import crypto from 'crypto';

export function sha256(input) {
    return crypto.createHash('sha256').update(input).digest();
}

export function sha512(input) {
    return crypto.createHash('sha512').update(input).digest();
}

export function sha256packed(a, b, c, d) {
    const inputs = [a, b, c, d].map(x => BigInt(x) & BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"));

    const buffer = Buffer.alloc(64);

    inputs.forEach((input, index) => {
        buffer.writeBigUInt64BE(input >> 64n, index * 16);
        buffer.writeBigUInt64BE(input & BigInt("0xFFFFFFFFFFFFFFFF"), index * 16 + 8);
    });

    const hash = sha256(buffer);

    const e = BigInt(`0x${hash.slice(0, 16).toString('hex')}`);
    const f = BigInt(`0x${hash.slice(16, 32).toString('hex')}`);

    return [e.toString(), f.toString()];
}
