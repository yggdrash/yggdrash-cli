const chalk = require('chalk')
const { createAccount, getAccounts, getAccount } = require('./wallet/account')
const { plant } = require('./stem/plant')
const { fromTransfer } = require('./coin/txFromTransferData')
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
    plant: (author, seedFile) => {
        plant(author, seedFile);
    },
    fromTransfer: (branchId, from, to, amount, net) => {
        let timestamp = Math.round(new Date().getTime() / 1000);
        return fromTransfer(branchId, from, to, amount, net, timestamp);
    },
    getBalance: (branchId, address) => {
        return getBalance(branchId, address);
    }
}