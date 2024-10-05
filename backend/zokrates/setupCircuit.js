import { initialize } from 'zokrates-js';
import { serializeArtifacts, serializeKeypair } from './utils.js'
import * as fs from 'fs';

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

async function main() {

    const zokrates = await initialize();

    const artifacts = zokrates.compile(source);
    const keypair = zokrates.setup(artifacts.program);

    fs.writeFileSync('artifacts.json', JSON.stringify(serializeArtifacts(artifacts), null, 2));

    fs.writeFileSync('keypair.json', JSON.stringify(serializeKeypair(keypair), null, 2));
}

main().catch(console.error);
