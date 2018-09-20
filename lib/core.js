const chalk = require('chalk')
const { createAccount, getAccounts, getAccount } = require('./wallet/account')
const { plant } = require('./stem/plant')
const { rawPlant } = require('./stem/rawPlant')
const { register } = require('./stem/register')
const { rawRegister } = require('./stem/rawRegister')
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
        let timestamp = Math.round(new Date().getTime() / 1000);
        plant(author, seedFile, timestamp);
    },
    rawPlant: (author, seedFile) => {
        let timestamp = Math.round(new Date().getTime() / 1000);
        return rawPlant(author, seedFile, timestamp);
    },
    register: (params, net) => {
        return register(params, net);
    },
    rawRegister: params => {
        return rawRegister(params);
    },
    fromTransfer: (branchId, from, to, amount, net) => {
        let timestamp = Math.round(new Date().getTime() / 1000);
        return fromTransfer(branchId, from, to, amount, net, timestamp);
    },
    getBalance: (branchId, address) => {
        return getBalance(branchId, address);
    }
}