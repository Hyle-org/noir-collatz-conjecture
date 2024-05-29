import { BarretenbergBackend  } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';
import * as fs from 'fs';
import * as dotenv from "dotenv";
dotenv.config({ path: '../Prover.toml' });

// Loading circuit
import circuit from "../target/noir_collatz_conjecture.json";

// Circuit tools setup
const backend = new BarretenbergBackend(circuit);
const verificationKey = await backend.getVerificationKey();

/////// LOCAL PROOF CREATION /////////
// Proving
const input = {
    version: process.env.version,
    initial_state: JSON.parse(process.env.initial_state as string),
    next_state: JSON.parse(process.env.next_state as string),
    origin_len: process.env.origin_len,
    origin: process.env.origin,
    caller: process.env.caller,
    caller_len: process.env.caller_len,
    block_number: process.env.block_number,
    block_time: process.env.block_time,
    tx_hash: JSON.parse(process.env.tx_hash as string),
    program_outputs: process.env.program_outputs
};
const noir = new Noir(circuit, backend);
const proof = await noir.generateProof(input);
var jsonProof = JSON.stringify({
    ...proof,
    proof: Array.from(proof.proof)
});
fs.writeFileSync('../target/proof.json', jsonProof);
fs.writeFileSync('../target/vkey', verificationKey);

process.exit();