const chalk = require('chalk')
const { createAccount, getAccounts, getAccount, coinbase, clear } = require('./wallet/account')
const { plant } = require('./stem/plant')
const { transferFrom, transfer } = require('./branch/sendTransaction')
const { getBalance } = require('./branch/getBalance')
const { restart, setConfig } = require('./admin/index')


const account = {
    createAccount: () => {
        const address = createAccount();
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
    plant: (author, seedFile, net) => {
        plant(author, seedFile, net);
    },
    transferFrom: (branchId, from, to, amount, net) => {
        let timestamp = new Date().getTime()
        return transferFrom(branchId, from, to, amount, net, timestamp);
    },
    transfer: (branchId, to, amount, net) => {
        let timestamp = new Date().getTime()
        return transfer(branchId, to, amount, net, timestamp);
    },
    getBalance: (branchId, address, net) => {
        return getBalance(branchId, address, net);
    }
}