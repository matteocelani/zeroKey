import { initialize } from 'zokrates-js';
import * as utils from './utils.js'
import * as fs from 'fs';


async function main() {

    const secret = "xxx";
    const sender = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266" // lowercase

    const secretHash = utils.sha512(secret);
    const secretHashSplitted = utils.split512BitHashTo128BitFields(secretHash);
    const hashSplitted = utils.sha256PackedTo128BitFields(...secretHashSplitted);
    const senderSplitted = utils.splitAddressTo128BitFields(sender);

    const secretInputs = [
        ...secretHashSplitted,
        ...hashSplitted,
        ...senderSplitted
    ];

    const zokrates = await initialize();

    const artifactsJson = JSON.parse(fs.readFileSync('artifacts.json', 'utf8'));
    const artifacts = utils.deserializeArtifacts(artifactsJson);

    const keypairJson = JSON.parse(fs.readFileSync('keypair.json', 'utf8'));
    const keypair = utils.deserializeKeypair(keypairJson);

    const { witness, output } = zokrates.computeWitness(artifacts, secretInputs);
    const proof = zokrates.generateProof(artifacts.program, witness, keypair.pk);
    fs.writeFileSync('proof.json', JSON.stringify(proof, null, 2));

    fs.writeFileSync('verifier.sol', zokrates.exportSolidityVerifier(keypair.vk));
}

main().catch(console.error);
