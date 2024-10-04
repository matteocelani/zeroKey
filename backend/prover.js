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


        console.log("1");
        function serializeArtifacts(artifacts) {
            return {
                program: Buffer.from(artifacts.program).toString('base64'),
                abi: artifacts.abi,
                snarkjs: artifacts.snarkjs ? {
                    program: Buffer.from(artifacts.snarkjs.program).toString('base64')
                } : undefined,
                constraintCount: artifacts.constraintCount
            };
        }

        function deserializeArtifacts(serializedArtifacts) {
            return {
                program: new Uint8Array(Buffer.from(serializedArtifacts.program, 'base64')),
                abi: serializedArtifacts.abi,
                snarkjs: serializedArtifacts.snarkjs ? {
                    program: new Uint8Array(Buffer.from(serializedArtifacts.snarkjs.program, 'base64'))
                } : undefined,
                constraintCount: serializedArtifacts.constraintCount
            };
        }

// Saving the artifacts
        const artifacts = this.zokrates.compile(source);
        console.log("1");

        const serializedArtifacts = serializeArtifacts(artifacts);
        fs.writeFileSync('artifacts.json', JSON.stringify(serializedArtifacts, null, 2));


// Later, when you need to reuse the artifacts:
        const loadedArtifactsJson = JSON.parse(fs.readFileSync('artifacts.json', 'utf8'));
        const loadedArtifacts = deserializeArtifacts(loadedArtifactsJson);


        const { witness, output } = this.zokrates.computeWitness(artifacts, inputs);
        console.log("2");
        fs.writeFileSync('witness.txt', witness.toString());
        fs.writeFileSync('output.txt', output.toString());

        const keypair = this.zokrates.setup(artifacts.program);
        console.log("3");
        fs.writeFileSync('keypair.txt', keypair.toString());

        const proof = this.zokrates.generateProof(artifacts.program, witness, keypair.pk);
        console.log("4");
        fs.writeFileSync('proof.json', JSON.stringify(proof, null, 2));

        const isVerified = this.zokrates.verify(keypair.vk, proof);
        console.log("5");
        fs.writeFileSync('verification_result.txt', isVerified.toString());

        const verifier = this.zokrates.exportSolidityVerifier(keypair.vk);
        fs.writeFileSync('verifier.sol', verifier);

        return { proof, isVerified, verifier, addressHash: output };
    }
}
