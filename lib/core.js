const { getAccounts, createAccount, getAccount } = require('./wallet/create')
const { createBranch } = require('./stem/txData')
const { plant } = require('./stem/plant')

var timestamp = null

setInterval(() => {
    timestamp = Math.round(new Date().getTime() / 1000);
}, 10 );



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
    createBranch: author => {
        return createBranch(author, timestamp);
    },
    plant: params => {
        return plant(params)
    }
}