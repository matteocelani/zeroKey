import { initialize } from 'zokrates-js';
import crypto from 'crypto';
import fs from 'fs';

class HashPreimageProver {
    constructor() {
        this.zokratesProvider = null;
    }

    async initialize() {
        this.zokratesProvider = await initialize();
    }

    stringToField(str) {
        const hash = crypto.createHash('sha256').update(str).digest();
        const field = BigInt(`0x${hash.slice(0, 16).toString('hex')}`);
        return field.toString();
    }

    prepareInputsFromQuestions(questions) {
        const fields = questions.map(q => this.stringToField(q));
        while (fields.length < 4) {
            fields.push('0');
        }
        return fields.slice(0, 4);
    }

    sha256packed(a, b, c, d) {
        const inputs = [a, b, c, d].map(x => BigInt(x) & BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"));

        const buffer = Buffer.alloc(64);

        inputs.forEach((input, index) => {
            buffer.writeBigUInt64BE(input >> 64n, index * 16);
            buffer.writeBigUInt64BE(input & BigInt("0xFFFFFFFFFFFFFFFF"), index * 16 + 8);
        });

        const hash = crypto.createHash('sha256').update(buffer).digest();

        const e = BigInt(`0x${hash.slice(0, 16).toString('hex')}`);
        const f = BigInt(`0x${hash.slice(16, 32).toString('hex')}`);

        return [e.toString(), f.toString()];
    }

    async proveHashPreimage(questions) {
        if (!this.zokratesProvider) {
            throw new Error('ZoKrates provider not initialized. Call initialize() first.');
        }

        const inputs = this.prepareInputsFromQuestions(questions);
        const [e, f] = this.sha256packed(...inputs);
        inputs.push(e, f);

        console.log("Prepared inputs:", inputs);
        console.log("Hash values:", e, "   AND   ", f);

        const source = `
      import "hashes/sha256/512bitPacked" as sha256packed;

      def main(private field a, private field b, private field c, private field d, field e, field f) {
          field[2] h = sha256packed([a, b, c, d]);
          assert(h[0] == e);
          assert(h[1] == f);
          return;
      }
    `;

        // Compilation
        const artifacts = this.zokratesProvider.compile(source);

        // Compute witness
        const { witness, output } = this.zokratesProvider.computeWitness(artifacts, inputs);

        // Generate setup
        const keypair = this.zokratesProvider.setup(artifacts.program);

        // Generate proof
        const proof = this.zokratesProvider.generateProof(artifacts.program, witness, keypair.pk);

        // Verify proof
        const isVerified = this.zokratesProvider.verify(keypair.vk, proof);

        // Export Solidity verifier
        const verifier = this.zokratesProvider.exportSolidityVerifier(keypair.vk);

        // Save verifier to file
        fs.writeFileSync('verifier.sol', verifier);

        return {
            proof,
            isVerified,
            verifier
        };
    }
}

// Main execution
async function main() {
    const prover = new HashPreimageProver();
    await prover.initialize();

    const questions = [
        "favorite ice cream? vanilla",
        "first pet's name? fluffy",
        "mother's maiden name? smith",
        "city of birth? new york"
    ];

    try {
        const result = await prover.proveHashPreimage(questions);
        console.log('Questions:', questions);
        console.log('Proof generated:', result.proof);
        console.log('Proof verified:', result.isVerified);
        console.log('Solidity verifier contract saved to verifier.sol');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main().catch(console.error);
