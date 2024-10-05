import hre from "hardhat";
import { ContractNetworksConfig, SafeFactory } from "@safe-global/protocol-kit";

const contractNetworks: ContractNetworksConfig = {
  [31337]: {
    safeSingletonAddress: "0x41675C099F32341bf84BFc5382aF534df5C7461a",
    safeProxyFactoryAddress: "0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67",
    multiSendAddress: "0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526",
    multiSendCallOnlyAddress: "0x9641d764fc13c8B624c04430C7356C1C7C8102e2",
    fallbackHandlerAddress: "0xfd0732Dc9E303f09fCEf3a7388Ad10A83459Ec99",
    signMessageLibAddress: "0xd53cd0aB83D845Ac265BE939c57F53AD838012c9",
    createCallAddress: "0x9b35Af71d77eaf8d7e40252370304687390A1A52",
    simulateTxAccessorAddress: "0x3d4BA2E0884aa488718476ca2FB8Efc291A46199",
    safeWebAuthnSignerFactoryAddress: "",
    safeWebAuthnSharedSignerAddress: "",
  },
};

export async function deploySafeSingleOwner(owner: any) {
  const saltNonce = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString();

  const safeFactory = await SafeFactory.init({
    provider: hre.network.provider,
    signer: owner.address,
    safeVersion: "1.4.1",
    contractNetworks,
  });

  const safeAccountConfig = {
    owners: [owner.address],
    threshold: 1,
  };

  const safe = await safeFactory.deploySafe({ safeAccountConfig, saltNonce });
  const safeAddress = await safe.getAddress();

  return { safe, safeAddress };
}
