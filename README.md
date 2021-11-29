# Final project - NFT Trade

## Public Ethereum wallet for certification:
## Deployed version url:

https://nfttrade.vercel.app/

## Screencast link

## Project description

## Simple workflow

## Directory structure

- `client`: Project's React frontend.
- `contracts`: Smart contracts that are deployed in the Ropsten testnet.
- `migrations`: Migration files for deploying contracts in `contracts` directory.
- `test`: Tests for smart contracts.

## How to run this project locally:
### Prerequisites

- Node.js >= v14
- Truffle and Ganache
- Yarn
- `git checkout main`

### Contracts

- Run `yarn install` in project root to install Truffle build and smart contract dependencies
- Run local testnet in port `7545` with an Ethereum client, e.g. Ganache
- `truffle migrate --network development`
- `truffle console --network development`
- Run tests in Truffle console: `test`
  
### Frontend

- `cd client`
- `yarn install`
- `yarn start`
- Open `http://localhost:3000`

### How to populate locally deployed contract with NFT listings

```solidity
- `truffle migrate --network development`
- `truffle console --network development`
- `let instance = await NFTTrade.deployed()`
- `instance.listNFT("0xd2AAd45015090F8d45ad78E456B58dd61Fb7cD79","1",web3.utils.toWei("0.1"),true,"https://lh3.googleusercontent.com/MYk0ArAtB1GR0MzSTbWYTkB-FoKLjCw_VX7ltTuteOmfSR1BWcYPzC883tNNeYmuwBu1B0ABlsnogRgCes_9Jav2dBxBhrpaRCUX9g=w600","Look at that mask")`
- `instance.listNFT("0xd2AAd45015090F8d45ad78E456B58dd61Fb7cD79","2",web3.utils.toWei("0.2"),true,"https://lh3.googleusercontent.com/YajdcvOrejrvSWAiKgoH1NN97VxGwv9TS-QyXfQWQqzRbi9KaoUbMmiIIQ5eTyjK9z96XEqI4I1k122Y4Mjr6Ef9odlmBEjzCSa_KA=w600","Looks rare")`
-`instance.listNFT("0xd2AAd45015090F8d45ad78E456B58dd61Fb7cD79","3",web3.utils.toWei("0.2"),true,"https://lh3.googleusercontent.com/V6qiNY-BYdeEiuwEmEDaz29epi_OqBi71wOat12JGqpo3hzz-l9IhC2YXg4yr_hYIYkR_9eq827JA6c8oWpQIw50PvO6k91Sv616yw=w600","777 with hat")`
-`instance.listNFT("0xd2AAd45015090F8d45ad78E456B58dd61Fb7cD79","4",web3.utils.toWei("0.2"),true,"https://lh3.googleusercontent.com/MktMpPyG32XgB6e6Q7RjChcLoUanigNM6Y2_iI8WRiqBNw5dAKp8aoi5BHbeZBGIAkwaP7GkKfNoitPiKm4juPA-uFKz-HhHr7HWIg=w600","AN 8-BIT OBITUARY OF FAMILY FIENDS")`
```

## Environment variables (not needed for running project locally)

```
ROPSTEN_INFURA_PROJECT_ID=
ROPSTEN_MNEMONIC=
```

## TODO features

