const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");
const Fenda = artifacts.require("Fenda");

module.exports = async function(deployer, network, accounts) {
    // Deploy Mock Tether Contract
    await deployer.deploy(Tether);
    const tether = await Tether.deployed();

    // Deploy RWD Contract
    await deployer.deploy(RWD);
    const rwd = await RWD.deployed();

    // Deploy Fenda Contract
    await deployer.deploy(Fenda);
    const fenda = await Fenda.deployed();

    // Deploy DecentralBank Contract
    await deployer.deploy(DecentralBank, rwd.address, tether.address, fenda.address);
    const decentralBank = await DecentralBank.deployed();

    // Transfer all RWD tokens to Decentral Bank
    await rwd.transfert(decentralBank.address, "1000000000000000000000000");

    //Distribute 100 tether tokens to investor
    await tether.transfert(accounts[1], "100000000000000000000");

    //Distribute 100 tether tokens to investor
    await fenda.transfert(accounts[1], "100000000000000000000");
};