// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;
pragma abicoder v2;

import "hardhat/console.sol";
import {ISafe} from "./interfaces/safe/ISafe.sol";
import {Enum} from "./interfaces/safe/Enum.sol";
import {IVerifier} from "./interfaces/IVerifier.sol";

contract ZeroKeyModule {
    struct Transaction {
        address to;
        uint value;
        bytes callData;
    }

    IVerifier public immutable verifier;
    mapping(address => bytes32) private _hashes;

    error InvalidProof();
    error InvalidSender();
    error InvalidHash();

    constructor(address _verifier) {
        verifier = IVerifier(_verifier);
    }

    function executeTransactionWithProof(
        address wallet,
        Transaction calldata transaction,
        IVerifier.Proof memory proof,
        uint[6] calldata input
    ) external {
        // verify proof
        if (!verifier.verifyTx(proof, input)) {
            revert InvalidProof();
        }

        // verify hash
        uint provingHash = (input[0] << 128) | input[1];
        if (_hashes[wallet] != bytes32(provingHash)) {
            revert InvalidHash();
        }

        // verify sender
        uint sender = (input[2] << 128) | input[3];
        if (msg.sender != address(uint160(sender))) {
            revert InvalidSender();
        }

        ISafe(wallet).execTransactionFromModule(
            transaction.to,
            transaction.value,
            transaction.callData,
            Enum.Operation.Call
        );
    }

    function setHash(bytes32 hash) external {
        _hashes[msg.sender] = hash;
    }

    function getHash(address wallet) external view returns (bytes32) {
        return _hashes[wallet];
    }
}
