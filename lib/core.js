const chalk = require('chalk')
const { createAccount, getAccounts, getAccount } = require('./wallet/create')
const { plant } = require('./stem/plant')
const { rawPlant } = require('./stem/rawPlant')
const { register } = require('./stem/register')
const { rawRegister } = require('./stem/rawRegister')
const { fromYeedTransfer } = require('./yeed/transferTxData')
const { getYeedBalance } = require('./yeed/getBalance')


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
        let timestamp = Math.round(new Date().getTime() / 1000);
        let info = plant(author, seedFile, timestamp);
        setTimeout(() => {
            console.log()
            console.log(`  ` + `CREATOR - ${chalk.green(info.author)}`)
        }, 100)
        setTimeout(() => {
            console.log(`  ` + `Branch Name - ${chalk.green(info.branch.name)}`)
        }, 150)
        setTimeout(() => {
            console.log(`  ` + `Branch Symbol - ${chalk.green(info.branch.symbol)}`)
        }, 200)
        setTimeout(() => {
            console.log(`  ` + `Branch type - ${chalk.green(info.branch.type)}`)
        }, 250)
        setTimeout(() => {
            console.log(`  ` + `Branch Property- ${chalk.green(info.branch.property)}`)
        }, 300)
        setTimeout(() => {
            console.log(`  ` + `Branch Description- ${chalk.green(info.branch.description)}`)
            console.log(`  ` + "...")
            console.log(`  ` + "...")
        }, 350)
        setTimeout(() => {
            console.log(`  ` + `Branch Version ${chalk.green(info.branch.version)}`)
        }, 400)
        setTimeout(() => {
            console.log()
            console.log(`  ` + `==> Branch ID : ${chalk.yellow(info.branchId)}`)
        }, 450)
    },
    rawPlant: (author, seedFile) => {
        let timestamp = Math.round(new Date().getTime() / 1000);
        return rawPlant(author, seedFile, timestamp);
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