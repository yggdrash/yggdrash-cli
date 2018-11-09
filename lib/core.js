const chalk = require('chalk')
const { create, getAccounts, getAccount, coinbase, clear } = require('./wallet/account')
const { plant } = require('./stem/plant')
const { seed } = require('./stem/seed')
const { deploy } = require('./stem/deploy')
const { transferFrom, transfer } = require('./branch/sendTransaction')
const { getBalance } = require('./branch/getBalance')
const { restart, setConfig } = require('./admin/index')


const account = {
    create: () => {
        const address = create();
        console.log(`  ` + `Address - ${chalk.green(address)}`)
    },
    getAccounts: () => {
        return getAccounts();
    },
    getAccount: index => {
        return getAccount(index);
    },
    coinbase: (owner) => {
        console.log(`  ` + `Coinbase - ${chalk.green(coinbase(owner))}`)
    },
    clear: () => {
        return clear()
    }   
}

const node = {
    restart: (net) => {
        return restart(net);
    },
    setConfig: (port, log, net) => {
        return setConfig(port, log, net);
    }
}


module.exports = {
    account: account,
    node: node,
    seed: (name, symbol, property, type, description, tag, version, reference_address, reserve_address) => {
        seed(name, symbol, property, type, description, tag, version, reference_address, reserve_address);
    },
    plant: (seedFile) => {
        plant(seedFile);
    },
    deploy: (branchFile) => {
        deploy(branchFile);
    },
    transferFrom: (branchId, from, to, amount, net) => {
        return transferFrom(branchId, from, to, amount, net);
    },
    transfer: (branchId, to, amount, net) => {
        return transfer(branchId, to, amount, net);
    },
    getBalance: (branchId, address, net) => {
        return getBalance(branchId, address, net);
    }
}