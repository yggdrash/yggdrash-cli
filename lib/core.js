const chalk = require('chalk')
const { createAccount, getAccounts, getAccount, coinbase, accountClear } = require('./wallet/account')
const { plant } = require('./stem/plant')
const { transferFrom } = require('./branch/sendTransaction')
const { getBalance } = require('./branch/getBalance')
const { admin } = require('./admin/index')

module.exports = {
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
    accountClear: () => {
        return accountClear()
    },
    plant: (author, seedFile, net) => {
        plant(author, seedFile, net);
    },
    transferFrom: (branchId, from, to, amount, net) => {
        let timestamp = Math.round(new Date().getTime());
        return transferFrom(branchId, from, to, amount, net, timestamp);
    },
    getBalance: (branchId, address, net) => {
        return getBalance(branchId, address, net);
    },
    admin: (action, port, log, net) => {
        return admin(action, port, log, net);
    }
}