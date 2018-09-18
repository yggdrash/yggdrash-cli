const { createAccount, getAccounts, getAccount } = require('./wallet/create')
const { createBranch } = require('./stem/txData')
const { createBranchJson } = require('./stem/txData2')
const { plantToStem } = require('./stem/plant')
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
    createBranch: author => {
        return createBranch(author, timestamp);
    },
    createBranchJson: (author, Object) => {
        return createBranchJson(author, timestamp, Object);
    },
    plantToStem: params => {
        return plantToStem(params);
    },
    fromYeedTransfer: (from, to, amount) => {
        return fromYeedTransfer(from, to, amount, timestamp);
    },
    getYeedBalance: address => {
        return getYeedBalance(address);
    }
}