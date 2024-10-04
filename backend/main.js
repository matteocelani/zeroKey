import { HashPreimageProver } from './prover.js';

async function main() {
    const prover = new HashPreimageProver();
    await prover.initialize();

    const secret = "vanillaiqaweufbgviuywrebgiyrwbrgywergiwybebwrguiyigbuwrbuiogwrrgbiojugiowrbujwrgbuiouiob";
    const userAddress = "0x955954d5ac0a61b0996cced9d43e2534b0d99f5e"
    try {
        const result = await prover.proveHashPreimage(secret,userAddress);
        console.log('secret:', secret);
        console.log('Proof generated:', result.proof);
        console.log('Proof verified:', result.isVerified);
        console.log('Solidity verifier contract saved to verifier.sol');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main().catch(console.error);
