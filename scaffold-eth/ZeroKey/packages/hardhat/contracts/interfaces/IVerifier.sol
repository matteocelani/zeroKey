// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IVerifier {
    struct G1Point {
        uint X;
        uint Y;
    }

    struct G2Point {
        uint[2] X;
        uint[2] Y;
    }

    struct VerifyingKey {
        G1Point alpha;
        G2Point beta;
        G2Point gamma;
        G2Point delta;
        G1Point[] gamma_abc;
    }

    struct Proof {
        G1Point a;
        G2Point b;
        G1Point c;
    }

    function verify(
        uint[] memory input,
        Proof memory proof
    ) external view returns (uint);

    function verifyTx(
        Proof memory proof,
        uint[6] memory input
    ) external view returns (bool);
}
