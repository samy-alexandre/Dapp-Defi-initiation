const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const Fenda = artifacts.require("Fenda");

const DecentralBank = artifacts.require("DecentralBank");

require("chai")
    .use(require("chai-as-promised"))
    .should();

contract("decentralBank", ([owner, investor]) => {
    let tether, rwd, fenda, decentralBank;

    function tokens(number) {
        return web3.utils.toWei(number, "ether");
    }

    before(async() => {
        // Load Contracts
        tether = await Tether.new();
        rwd = await RWD.new();
        fenda = await Fenda.new();
        decentralBank = await DecentralBank.new(
            rwd.address,
            tether.address,
            fenda.address
        );

        // Transfert all tokens to DecentralBank (1million)
        await rwd.transfert(decentralBank.address, tokens("1000000"));

        // Transfert 100 mock Tethers to investor
        await tether.transfert(investor, tokens("100"), { from: owner });
    });

    //All of the code goes here for testing
    describe("Mock Tether Deployement", async() => {
        it("matches name successfully", async() => {
            let tether = await Tether.new();
            const name = await tether.name();
            assert.equal(name, "Mock Tether Token");
        });
    });

    describe("Reward Token", async() => {
        it("matches name successfully", async() => {
            let rwd = await RWD.new();
            const name = await rwd.name();
            assert.equal(name, "Reward Token");
        });
    });

    describe("Fenda", async() => {
        it("matches name successfully", async() => {
            let fenda = await Fenda.new();
            const name = await fenda.name();
            assert.equal(name, "Fenda");
        });
    });

    describe("Decentrale Bank Deployement", async() => {
        it("matches name successfully", async() => {
            const name = await decentralBank.name();
            assert.equal(name, "Decentral Bank");
        });

        it("contract has tokens", async() => {
            let balance = await rwd.balanceOf(decentralBank.address);
            assert.equal(balance, tokens("1000000"));
        });
    });

    describe("Yield Farming", async() => {
        it("rewards tokens for staking", async() => {
            let result;

            //  Check Investor Balance
            result = await tether.balanceOf(investor);
            assert.equal(
                result.toString(),
                tokens("100"),
                "investor mock wallet balance before staking"
            );

            // Check Staking For investor of 100 tokens
            await tether.approve(decentralBank.address, tokens("100"), {
                from: investor,
            });
            await decentralBank.depositTokens(tokens("100"), { from: investor });

            //Check updated balance of investor

            result = await tether.balanceOf(investor);
            assert.equal(
                result.toString(),
                tokens("0"),
                "investor mock wallet balance after staking 100 tokens"
            );

            //Check updated balance of decentralBank
            result = await tether.balanceOf(decentralBank.address);
            assert.equal(
                result.toString(),
                tokens("100"),
                "decentral banck mock wallet balance after staking from investor"
            );

            // Is Staking Balance
            result = await decentralBank.isStaking(investor);
            assert.equal(
                result.toString(),
                "true",
                "investor is staking status after staking "
            );

            // Issue Tokens
            await decentralBank.issueTokens({ from: owner });

            // Ensure only the owner can issue tokens

            await decentralBank.issueTokens({ from: investor }).should.be.rejected;

            //Unstake Tokens
            await decentralBank.unstakeTokens({ from: investor });

            // Check Unstaking

            //Check updated balance of investor

            result = await tether.balanceOf(investor);
            assert.equal(
                result.toString(),
                tokens("100"),
                "investor mock wallet balance after unstaking 100 tokens"
            );

            //Check updated balance of decentralBank
            result = await tether.balanceOf(decentralBank.address);
            assert.equal(
                result.toString(),
                tokens("0"),
                "decentral banck mock wallet balance after unstaking from investor"
            );

            result = await decentralBank.stakingBalance(investor);
            assert.equal(
                result.toString(),
                tokens("0"),
                "investor balance staking correct after unstaking"
            );

            // Is Staking Balance
            result = await decentralBank.isStaking(investor);
            assert.equal(
                result.toString(),
                "false",
                "investor is unstaking status after unstack "
            );
        });
    });
});