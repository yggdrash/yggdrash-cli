const { getYeedAccounts, createYeedAccount, getYeedAccount } = require('./wallet/create')
const { createBranch } = require('./stem/txData')
const { plantToStem } = require('./stem/plant')
const { fromYeedTransfer } = require('./yeed/transferTxData')
const { getYeedBalance } = require('./yeed/getBalance')

var timestamp = null

setInterval(() => {
    timestamp = Math.round(new Date().getTime() / 1000);
}, 10 );



module.exports = {
    createYeedAccount: () => {
        return createYeedAccount();
    },
    getYeedAccounts: () => {
        return getYeedAccounts();
    },
    getYeedAccount: index => {
        return getYeedAccount(index);
    },
    createBranch: author => {
        return createBranch(author, timestamp);
    },
    plantToStem: params => {
        return plantToStem(params);
    },
    fromYeedTransfer: (author, to, amount) => {
        return fromYeedTransfer(author, to, amount, timestamp);
    },
    getYeedBalance: address => {
        return getYeedBalance(address);
    }
}