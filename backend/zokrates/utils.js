import crypto from 'crypto';

export function serializeArtifacts(artifacts) {
    return {
        program: Buffer.from(artifacts.program).toString('base64'),
        abi: artifacts.abi,
        snarkjs: artifacts.snarkjs ? {
            program: Buffer.from(artifacts.snarkjs.program).toString('base64')
        } : undefined,
        constraintCount: artifacts.constraintCount
    };
}

export function deserializeArtifacts(serializedArtifacts) {
    return {
        program: new Uint8Array(Buffer.from(serializedArtifacts.program, 'base64')),
        abi: serializedArtifacts.abi,
        snarkjs: serializedArtifacts.snarkjs ? {
            program: new Uint8Array(Buffer.from(serializedArtifacts.snarkjs.program, 'base64'))
        } : undefined,
        constraintCount: serializedArtifacts.constraintCount
    };
}

export function serializeKeypair(keypair) {
    return {
        vk: serializeVerificationKey(keypair.vk),
        pk: serializeProvingKey(keypair.pk)
    };
}

export function deserializeKeypair(serializedKeypair) {
    return {
        vk: deserializeVerificationKey(serializedKeypair.vk),
        pk: deserializeProvingKey(serializedKeypair.pk)
    };
}

function serializeVerificationKey(vk) {
    return JSON.parse(JSON.stringify(vk, (key, value) => {
        if (value instanceof Uint8Array) {
            return {
                type: 'Uint8Array',
                data: Buffer.from(value).toString('base64')
            };
        }
        return value;
    }));
}

function deserializeVerificationKey(serializedVk) {
    return JSON.parse(JSON.stringify(serializedVk), (key, value) => {
        if (value && value.type === 'Uint8Array' && value.data) {
            return new Uint8Array(Buffer.from(value.data, 'base64'));
        }
        return value;
    });
}

function serializeProvingKey(pk) {
    return Buffer.from(pk).toString('base64');
}

function deserializeProvingKey(serializedPk) {
    return new Uint8Array(Buffer.from(serializedPk, 'base64'));
}


export function sha512(input) {
    return crypto.createHash('sha512').update(Buffer.from(input, 'utf8')).digest();
}

export function sha256(input) {
    return crypto.createHash('sha256').update(Buffer.from(input, 'utf8')).digest();
}

export function split512BitHashTo128BitFields(hash) {
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

export function splitAddressTo128BitFields(address) {
    address = address.startsWith('0x') ? address.slice(2) : address;

    if (address.length !== 40) {
        throw new Error('Invalid Ethereum address length');
    }

    const paddedAddress = address.padStart(64, '0');

    const address0 = BigInt(`0x${paddedAddress.slice(0, 32)}`).toString();
    const address1 = BigInt(`0x${paddedAddress.slice(32)}`).toString();

    return [address0, address1];
}

export function sha256PackedTo128BitFields(a, b, c, d) {
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