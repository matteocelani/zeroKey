import { sha512 } from './hashUtils.js';

export function stringTo512BitHash(str) {
    // Generate a 512-bit (64-byte) hash from the input string
    const hash = sha512(Buffer.from(str, 'utf8'));
    return hash;
}

export function splitHashTo128BitFields(hash) {
    if (hash.length !== 64) {
        throw new Error('Input hash must be 512 bits (64 bytes)');
    }

    const fields = [];
    for (let i = 0; i < 4; i++) {
        const start = i * 16;
        const end = start + 16;
        const field = BigInt(`0x${hash.slice(start, end).toString('hex')}`);
        fields.push(field.toString());
    }

    return fields;
}

export function prepareInputFromString(str) {
    const hash = stringTo512BitHash(str);
    return splitHashTo128BitFields(hash);
}

export function splitAddressToFields(address) {
    // Remove '0x' prefix if present
    address = address.startsWith('0x') ? address.slice(2) : address;

    if (address.length !== 40) {
        throw new Error('Invalid Ethereum address length');
    }

    // Pad the address to 64 characters (256 bits) with leading zeros
    const paddedAddress = address.padStart(64, '0');

    // Split into two 128-bit parts
    const address0 = BigInt(`0x${paddedAddress.slice(0, 32)}`).toString();
    const address1 = BigInt(`0x${paddedAddress.slice(32)}`).toString();

    return [address0, address1];
}
