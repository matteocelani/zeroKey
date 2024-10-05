// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;
library Pairing {
    struct G1Point {
        uint X;
        uint Y;
    }
    // Encoding of field elements is: X[0] * z + X[1]
    struct G2Point {
        uint[2] X;
        uint[2] Y;
    }
    /// @return the generator of G1
    function P1() internal pure returns (G1Point memory) {
        return G1Point(1, 2);
    }
    /// @return the generator of G2
    function P2() internal pure returns (G2Point memory) {
        return
            G2Point(
                [
                    10857046999023057135944570762232829481370756359578518086990519993285655852781,
                    11559732032986387107991004021392285783925812861821192530917403151452391805634
                ],
                [
                    8495653923123431417604973247489272438418190587263600148770280649306958101930,
                    4082367875863433681332203403145435568316851327593401208105741076214120093531
                ]
            );
    }
    /// @return the negation of p, i.e. p.addition(p.negate()) should be zero.
    function negate(G1Point memory p) internal pure returns (G1Point memory) {
        // The prime q in the base field F_q for G1
        uint q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;
        if (p.X == 0 && p.Y == 0) return G1Point(0, 0);
        return G1Point(p.X, q - (p.Y % q));
    }
    /// @return r the sum of two points of G1
    function addition(
        G1Point memory p1,
        G1Point memory p2
    ) internal view returns (G1Point memory r) {
        uint[4] memory input;
        input[0] = p1.X;
        input[1] = p1.Y;
        input[2] = p2.X;
        input[3] = p2.Y;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 6, input, 0xc0, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success
            case 0 {
                invalid()
            }
        }
        require(success);
    }

    /// @return r the product of a point on G1 and a scalar, i.e.
    /// p == p.scalar_mul(1) and p.addition(p) == p.scalar_mul(2) for all points p.
    function scalar_mul(
        G1Point memory p,
        uint s
    ) internal view returns (G1Point memory r) {
        uint[3] memory input;
        input[0] = p.X;
        input[1] = p.Y;
        input[2] = s;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 7, input, 0x80, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success
            case 0 {
                invalid()
            }
        }
        require(success);
    }
    /// @return the result of computing the pairing check
    /// e(p1[0], p2[0]) *  .... * e(p1[n], p2[n]) == 1
    /// For example pairing([P1(), P1().negate()], [P2(), P2()]) should
    /// return true.
    function pairing(
        G1Point[] memory p1,
        G2Point[] memory p2
    ) internal view returns (bool) {
        require(p1.length == p2.length);
        uint elements = p1.length;
        uint inputSize = elements * 6;
        uint[] memory input = new uint[](inputSize);
        for (uint i = 0; i < elements; i++) {
            input[i * 6 + 0] = p1[i].X;
            input[i * 6 + 1] = p1[i].Y;
            input[i * 6 + 2] = p2[i].X[1];
            input[i * 6 + 3] = p2[i].X[0];
            input[i * 6 + 4] = p2[i].Y[1];
            input[i * 6 + 5] = p2[i].Y[0];
        }
        uint[1] memory out;
        bool success;
        assembly {
            success := staticcall(
                sub(gas(), 2000),
                8,
                add(input, 0x20),
                mul(inputSize, 0x20),
                out,
                0x20
            )
            // Use "invalid" to make gas estimation work
            switch success
            case 0 {
                invalid()
            }
        }
        require(success);
        return out[0] != 0;
    }
    /// Convenience method for a pairing check for two pairs.
    function pairingProd2(
        G1Point memory a1,
        G2Point memory a2,
        G1Point memory b1,
        G2Point memory b2
    ) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](2);
        G2Point[] memory p2 = new G2Point[](2);
        p1[0] = a1;
        p1[1] = b1;
        p2[0] = a2;
        p2[1] = b2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for three pairs.
    function pairingProd3(
        G1Point memory a1,
        G2Point memory a2,
        G1Point memory b1,
        G2Point memory b2,
        G1Point memory c1,
        G2Point memory c2
    ) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](3);
        G2Point[] memory p2 = new G2Point[](3);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for four pairs.
    function pairingProd4(
        G1Point memory a1,
        G2Point memory a2,
        G1Point memory b1,
        G2Point memory b2,
        G1Point memory c1,
        G2Point memory c2,
        G1Point memory d1,
        G2Point memory d2
    ) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](4);
        G2Point[] memory p2 = new G2Point[](4);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p1[3] = d1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        p2[3] = d2;
        return pairing(p1, p2);
    }
}

contract Verifier {
    using Pairing for *;
    struct VerifyingKey {
        Pairing.G1Point alpha;
        Pairing.G2Point beta;
        Pairing.G2Point gamma;
        Pairing.G2Point delta;
        Pairing.G1Point[] gamma_abc;
    }
    struct Proof {
        Pairing.G1Point a;
        Pairing.G2Point b;
        Pairing.G1Point c;
    }
    function verifyingKey() internal pure returns (VerifyingKey memory vk) {
        vk.alpha = Pairing.G1Point(
            uint256(
                0x14f6e0d0c2aa26526e17b40316c35592bd0d5f78f6ad9a753aae9fc59903b837
            ),
            uint256(
                0x2c497fd29c109c8b7890da1c075752137da9cf00b72eab33081b855f5249d931
            )
        );
        vk.beta = Pairing.G2Point(
            [
                uint256(
                    0x2b932c0f8e34459160aac5b217577f64cde2e7974791b5637ffed56f8b894552
                ),
                uint256(
                    0x1ba7a58f35d4b96449f364c448139a1c750955f589903d4cd1b352e60e9fd107
                )
            ],
            [
                uint256(
                    0x0a94d13cdd853dab6e5fa78f11b41b9701472cb00d968b4213462d5bd7a074d0
                ),
                uint256(
                    0x2e533ec1852a5c890d37933461bd3153d22ea0b55729e8b3e99949d11d78f2d6
                )
            ]
        );
        vk.gamma = Pairing.G2Point(
            [
                uint256(
                    0x1b816af21747ee6b3846c88abf27a25c55189944ce636aad1688aa43cd35fc2b
                ),
                uint256(
                    0x13684b4bcd8ee044a5c4c73b00401a8c9ac19de2391cb80f6fb25229c3bda4f0
                )
            ],
            [
                uint256(
                    0x2e720adf85d00e1a2f59cad79214fc9fd232d99fd4665f2f7292b17b8a49dae1
                ),
                uint256(
                    0x1b8412f3af933980bc9067d9dcdb4b4cf306c792ec9ff8422149c8ae78a5f441
                )
            ]
        );
        vk.delta = Pairing.G2Point(
            [
                uint256(
                    0x244f1b4633fbe22ff15972d5a99c928d10fabdac7ba8c9eec25347d1dcee9a45
                ),
                uint256(
                    0x27716c8914f0bb14d7e1ea1dcd864c5e4c71f7db2301b41bea48efb9732110f4
                )
            ],
            [
                uint256(
                    0x05a46822664708e435c3022ade6ceb8bcfd78e597be0bacfccc7b4d2ae93819e
                ),
                uint256(
                    0x19e398195dc5b2426f26a89a45d8b1b07a57db673f1210ad93cdd38018b0d01d
                )
            ]
        );
        vk.gamma_abc = new Pairing.G1Point[](7);
        vk.gamma_abc[0] = Pairing.G1Point(
            uint256(
                0x0f63062b0dd94602c7572ecb12e748ecbe88dd47d8a13820428b7723409d58fc
            ),
            uint256(
                0x16df030f5b0d7da507fd0cb697adcf17cf250f242f62c5ff93ead3006e3261da
            )
        );
        vk.gamma_abc[1] = Pairing.G1Point(
            uint256(
                0x206b3f641c3bc96c4da0dbf464a5561edb1e2c6e737bec1036c77c926384cb03
            ),
            uint256(
                0x2e62ef3438105fff1ce04fdb1504e7d3bbc0592bba453948b2f9fe39394635d9
            )
        );
        vk.gamma_abc[2] = Pairing.G1Point(
            uint256(
                0x2d2cf48fa69cc6cf573d7c6ba7861a61b5a020b39b852a1d54c8bb95bd3d3bfe
            ),
            uint256(
                0x0f11d9990f7e3fc391b94257180a5d51f407806ff5e9dfc82604339d4160f258
            )
        );
        vk.gamma_abc[3] = Pairing.G1Point(
            uint256(
                0x1bfe3b5c285d02447e1f96616c429f391598a291b3fc646f2715ece6edf5540b
            ),
            uint256(
                0x0875fce5ff79054f55aeb28930acc4f26438f8d10e089ac4bd7c11c3aa9632bc
            )
        );
        vk.gamma_abc[4] = Pairing.G1Point(
            uint256(
                0x22651dc30aa41e35a78f3c6c7421e6e5fca79c161575a4c1f5efa443f57c35c5
            ),
            uint256(
                0x1e44f7f5eda7b643e0081a6374a3560153aadfb4b4163a66e3e45204b0535191
            )
        );
        vk.gamma_abc[5] = Pairing.G1Point(
            uint256(
                0x155298795414d6c025bbf760bc9c03981db764b737936d78eb94290b784812ad
            ),
            uint256(
                0x012c8917f541b130ec85c677fc0270e7bcdaabd61f06e0bcef464d913228b571
            )
        );
        vk.gamma_abc[6] = Pairing.G1Point(
            uint256(
                0x26023df4065e85361ed9fe663b69488b49198c1a435018ef3d282ac174153a45
            ),
            uint256(
                0x17a4ab83a45f1601c39fc27ddfe01c9a27a4ec421b25b1c771dd132833dbf12e
            )
        );
    }
    function verify(
        uint[] memory input,
        Proof memory proof
    ) internal view returns (uint) {
        uint256 snark_scalar_field = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
        VerifyingKey memory vk = verifyingKey();
        require(input.length + 1 == vk.gamma_abc.length);
        // Compute the linear combination vk_x
        Pairing.G1Point memory vk_x = Pairing.G1Point(0, 0);
        for (uint i = 0; i < input.length; i++) {
            require(input[i] < snark_scalar_field);
            vk_x = Pairing.addition(
                vk_x,
                Pairing.scalar_mul(vk.gamma_abc[i + 1], input[i])
            );
        }
        vk_x = Pairing.addition(vk_x, vk.gamma_abc[0]);
        if (
            !Pairing.pairingProd4(
                proof.a,
                proof.b,
                Pairing.negate(vk_x),
                vk.gamma,
                Pairing.negate(proof.c),
                vk.delta,
                Pairing.negate(vk.alpha),
                vk.beta
            )
        ) return 1;
        return 0;
    }
    function verifyTx(
        Proof memory proof,
        uint[6] memory input
    ) public view returns (bool r) {
        uint[] memory inputValues = new uint[](6);

        for (uint i = 0; i < input.length; i++) {
            inputValues[i] = input[i];
        }
        if (verify(inputValues, proof) == 0) {
            return true;
        } else {
            return false;
        }
    }
}
