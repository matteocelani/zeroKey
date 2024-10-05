import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.ALCHEMY_KEY;

const urlMap: any = {
  ethereum: `https://eth-mainnet.alchemyapi.io/v2/${apiKey}`,
  base: `https://base-mainnet.g.alchemy.com/v2/${apiKey}`,
  arbitrum: `https://arb-mainnet.g.alchemy.com/v2/${apiKey}`,
};

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    hardhat: {
      forking: {
        url: urlMap[process.env.CHAIN || "ethereum"],
      },
    },
    ethereum: {
      url: urlMap["ethereum"],
      accounts: [`0x${process.env.ACCOUNT_PRIVATE_KEY}`],
    },
    base: {
      url: urlMap["base"],
      accounts: [`0x${process.env.ACCOUNT_PRIVATE_KEY}`],
    },
    arbitrum: {
      url: urlMap["arbitrum"],
      accounts: [`0x${process.env.ACCOUNT_PRIVATE_KEY}`],
    },
  },
};

export default config;
