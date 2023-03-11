import { assert, expect } from "chai";
import { BigNumber, Signer } from "ethers";
import { ethers } from "hardhat";
import { LinkToken, FigurePrintOracle, UserIdentityNFT, Test1 } from "../typechain-types";


import { getLinkToken, getFigurePrintOracle, getUserIdentityNFT, getTest1 } from "../instructions"
import { keccak256 } from "@ethersproject/keccak256";
import { toUtf8Bytes } from "@ethersproject/strings";
import { log } from "console";
import { getStringToBytes } from "../utils/convert"
import { test } from "../instructions"
import { SIGNING_DOMAIN_NAME, SIGNING_DOMAIN_VERSION, IPFS_SIMPLE } from "../helper-hardhat-config"

describe("FigurePrintOracle", async function () {
  let deployer: Signer;
  let deployer2: Signer
  let deployer3: Signer
  let deployer4: Signer
  let deployer5: Signer
  let deployer6: Signer //0x0308b55f7bACa0324Ba6Ff06b22Af1B4e5d71a74
  let deployer7: Signer //0x0308b55f7bACa0324Ba6Ff06b22Af1B4e5d71a74

  let linkToken: LinkToken;
  let figurePrintOracle: FigurePrintOracle;
  let userIdentityNFT: Test1;
  let voucher: any;

  before(async () => {
    [deployer, deployer2, deployer3, deployer4, deployer5, deployer6, deployer7] = await ethers.getSigners(); // could also do with getNamedAccounts
    linkToken = await getLinkToken();
    figurePrintOracle = await getFigurePrintOracle();
    const _userId = getStringToBytes("7d80a6386ef543a3abb52817f6707e3b")
    const _fingurePrint = getStringToBytes("7d80a6386ef543a3abb52817f6707e3a")
    userIdentityNFT = await getTest1();
    voucher = (await test(
      userIdentityNFT,
      deployer,
      1,
      2,
      SIGNING_DOMAIN_NAME,
      SIGNING_DOMAIN_VERSION,
    )) as any;


  });

  describe("figurePrint Oracle Test", async function () {
    it("test calldata", async function () {
      let address: string = await deployer.getAddress();
      // await userIdentityNFT.connect(deployer).transferFrom(address, address, 1)
      console.log(await (userIdentityNFT.connect(deployer).getAddress({ tokenId: 1, status: 1 })))
    });

  });

});
