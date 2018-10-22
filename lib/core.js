const chalk = require('chalk')
const { createAccount, getAccounts, getAccount } = require('./wallet/account')
const { plant } = require('./stem/plant')
const { transferFrom } = require('./coin/sendTransaction')
const { getBalance } = require('./coin/getBalance')

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
    plant: (author, seedFile, net) => {
        plant(author, seedFile, net);
    },
    transferFrom: (branchId, from, to, amount, net) => {
        let timestamp = Math.round(new Date().getTime() / 1000);
        return transferFrom(branchId, from, to, amount, net, timestamp);
    },
    getBalance: (branchId, address, net) => {
        return getBalance(branchId, address, net);
    }
}