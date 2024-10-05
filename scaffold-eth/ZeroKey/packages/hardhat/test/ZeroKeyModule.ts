import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { deploySafeSingleOwner } from "../utils/Safe";
import { readFileSync } from "fs";
import { MetaTransactionData } from "@safe-global/safe-core-sdk-types";

describe("ZeroKey", function () {
  async function deployFixture() {
    const [user] = await ethers.getSigners();

    // deploy Safe
    const { safe, safeAddress } = await deploySafeSingleOwner(user);

    // deploy Verifier contract
    const Verifier = await ethers.getContractFactory("Verifier");
    const verifier = await Verifier.deploy();
    const verifierAddress = await verifier.getAddress();

    // deploy ZeroKeyModule contract
    const ZeroKeyModule = await ethers.getContractFactory("ZeroKeyModule");
    const zeroKeyModule = await ZeroKeyModule.deploy(verifierAddress);
    const zeroKeyModuleAddress = await zeroKeyModule.getAddress();

    // enable ZeroKeyModule
    const safeEnableModuleTx = await safe.createEnableModuleTx(zeroKeyModuleAddress);
    await safe.executeTransaction(safeEnableModuleTx);

    // transfer 1 ETH to the safe
    await user.sendTransaction({
      to: safeAddress,
      value: ethers.parseEther("1"),
    });

    return { user, safe, safeAddress, zeroKeyModule, zeroKeyModuleAddress };
  }

  describe("ZeroKeyModule functions", function () {
    it("Should set the hash and make a transaction", async function () {
      const { user, safe, safeAddress, zeroKeyModule, zeroKeyModuleAddress } = await loadFixture(deployFixture);

      const tx = {
        to: safeAddress,
        value: 0,
        callData: "0x",
      };

      const proofJson = JSON.parse(readFileSync("zokrates/proof.json", "utf-8"));

      const proof = proofJson.proof;
      const inputs = proofJson.inputs;

      const secret = "xxx";
      const hash512 = ethers.sha512(ethers.toUtf8Bytes(secret));
      const hash256 = ethers.sha256(hash512);

      // during setup
      const transactions: MetaTransactionData[] = [
        {
          to: zeroKeyModuleAddress,
          data: zeroKeyModule.interface.encodeFunctionData("setHash", [hash256]),
          value: "0",
        },
      ];

      const safeAllowanceTx = await safe.createTransaction({ transactions });
      await safe.executeTransaction(safeAllowanceTx);

      // recovery
      await zeroKeyModule.connect(user).executeTransactionWithProof(safeAddress, tx, proof, inputs);
    });
  });
});
