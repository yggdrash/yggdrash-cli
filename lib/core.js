const { createAccount, getAccounts, getAccount } = require('./wallet/create')
const { plant } = require('./stem/plant')
const { rawPlant } = require('./stem/rawPlant')
const { actionPlant } = require('./action/plant')
const { actionCreateAccount } = require('./action/create')
const { register } = require('./stem/register')
const { rawRegister } = require('./stem/rawRegister')
const { fromYeedTransfer } = require('./yeed/transferTxData')
const { getYeedBalance } = require('./yeed/getBalance')

module.exports = {
    createAccount: () => {
        return createAccount();
    },
    actionCreateAccount: () => {
        return actionCreateAccount();
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
    actionPlant: (pk, seedFile) => {
        let timestamp = Math.round(new Date().getTime() / 1000);
        return actionPlant(pk, seedFile, timestamp);
    },
    register: params => {
        return register(params);
    },
    rawRegister: params => {
        return rawRegister(params);
    },
    fromYeedTransfer: (from, to, amount) => {
        let timestamp = Math.round(new Date().getTime() / 1000);
        return fromYeedTransfer(from, to, amount, timestamp);
    },
    getYeedBalance: address => {
        return getYeedBalance(address);
    }
}