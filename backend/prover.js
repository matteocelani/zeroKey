import fs from 'fs';
import { sha256packed } from './hashUtils.js';
import { prepareInputFromString, splitAddressToFields } from './fieldConversion.js';
import { ZokratesWrapper } from './zokratesWrapper.js';

export class HashPreimageProver {
    constructor() {
        this.zokrates = new ZokratesWrapper();
    }

    async initialize() {
        await this.zokrates.initialize();
    }

    async proveHashPreimage(secret, userAddress) {
        if (!this.zokrates.provider) {
            throw new Error('ZoKrates provider not initialized. Call initialize() first.');
        }

        const inputs = prepareInputFromString(secret);
        const [hash0, hash1] = sha256packed(...inputs);
        const [address0, address1] = splitAddressToFields(userAddress);

        inputs.push(hash0, hash1, address0, address1);

        console.log("Prepared inputs:", inputs);
        console.log("Hash values:", hash0, "   AND   ", hash1);
        console.log("Address values:", address0, "   AND   ", address1);

        const source = `
        import "hashes/sha256/512bitPacked" as sha256packed;

        def main(private field s0, private field s1, private field s2, private field s3, field hash0, field hash1, field address0, field address1) -> field[2] {
            field[2] h = sha256packed([s0, s1, s2, s3]);
            assert(h[0] == hash0);
            assert(h[1] == hash1);
            field[2] addresses = sha256packed([address0, address1,0,0]);
            return addresses;
        }
        `;

        const artifacts = this.zokrates.compile(source);
        console.log("1");
        const { witness, output } = this.zokrates.computeWitness(artifacts, inputs);

        console.log("2");
        const keypair = this.zokrates.setup(artifacts.program);
        console.log("3");
        const proof = this.zokrates.generateProof(artifacts.program, witness, keypair.pk);
        console.log("4");

        const isVerified = this.zokrates.verify(keypair.vk, proof);
        console.log("5");

        const verifier = this.zokrates.exportSolidityVerifier(keypair.vk);

        // creating verifier.sol
        fs.writeFileSync('verifier.sol', verifier);

        return { proof, isVerified, verifier, addressHash: output };
    }
}
