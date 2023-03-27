import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import verify from "../instructions/verify-code"
import { networkConfig, developmentChains, MIN_DELAY, contractAddressFile } from "../helper-hardhat-config"
import { ethers } from "hardhat"
import { storeProposalId } from "../utils/storeContractAddress"
const deployTimeLock: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    let { network, deployments, getNamedAccounts } = hre
    let { deploy, log } = deployments
    let { deployer } = await getNamedAccounts();
    log("Deploying Time Lock  Contract .... ")
    const Test1 = await deploy("Test1", {
        from: deployer,
        args: [],
        log: true,
        value: ethers.utils.parseUnits("0.0001", "ether"),

        // we need to wait if on a live network so we can verify properly
        waitConfirmations: networkConfig[network.name].blockConfirmations || 1,
    })
    log(`Time Lock at ${Test1.address}`)
    await storeProposalId(Test1.address, "Test1", contractAddressFile)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(Test1.address, [])
    }

}


export default deployTimeLock
deployTimeLock.tags = ["all", "test"];