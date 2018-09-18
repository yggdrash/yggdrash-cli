const { createAccount, getAccounts, getAccount } = require('./wallet/create')
const { plant } = require('./stem/plant')
const { register } = require('./stem/register')
const { rawRegister } = require('./stem/rawRegister')
const { fromYeedTransfer } = require('./yeed/transferTxData')
const { getYeedBalance } = require('./yeed/getBalance')

var timestamp = null

setInterval(() => {
    timestamp = Math.round(new Date().getTime() / 1000);
}, 1 );

module.exports = {
    createAccount: () => {
        return createAccount();
    },
    getAccounts: () => {
        return getAccounts();
    },
    getAccount: index => {
        return getAccount(index);
    },
    plant: (author, seedFile) => {
        return plant(author, seedFile, timestamp);
    },
    register: params => {
        return register(params);
    },
    rawRegister: params => {
        return rawRegister(params);
    },
    fromYeedTransfer: (from, to, amount) => {
        return fromYeedTransfer(from, to, amount, timestamp);
    },
    getYeedBalance: address => {
        return getYeedBalance(address);
    }
}