import { initialize } from 'zokrates-js';

export class ZokratesWrapper {
    constructor() {
        this.provider = null;
    }

    async initialize() {
        this.provider = await initialize();
    }

    compile(source) {
        return this.provider.compile(source);
    }

    computeWitness(artifacts, args) {
        return this.provider.computeWitness(artifacts, args);
    }

    setup(program) {
        return this.provider.setup(program);
    }

    generateProof(program, witness, provingKey) {
        return this.provider.generateProof(program, witness, provingKey);
    }

    verify(verificationKey, proof) {
        return this.provider.verify(verificationKey, proof);
    }

    exportSolidityVerifier(verificationKey) {
        return this.provider.exportSolidityVerifier(verificationKey);
    }
}
