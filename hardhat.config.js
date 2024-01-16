require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    bsctest: {
      url: `https://data-seed-prebsc-2-s1.binance.org:8545/`,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.BSC_SCAN_API_KEY
  }
};
