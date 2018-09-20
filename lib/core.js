const chalk = require('chalk')
const { createAccount, getAccounts, getAccount } = require('./wallet/account')
const { plant } = require('./stem/plant')
const { rawPlant } = require('./stem/rawPlant')
const { register } = require('./stem/register')
const { rawRegister } = require('./stem/rawRegister')
const { fromTransfer } = require('./yeed/txFromTransferData')
const { getBalance } = require('./yeed/getBalance')
const { fromPrivateKey } = require('./wallet')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('account.json')
const db = low(adapter)
db.defaults({ accounts: [], principals:[] })
  .write()


module.exports = {
    createAccount: () => {
        const pk = createAccount();
        const account = fromPrivateKey(pk);
        const address = account.getAddressString();
        db.get('accounts').push({
            address: address
        }).write()
        db.get('principals').push({
            address:address,
            EncryptedKey:pk.toString('hex')
        }).write()
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
    register: params => {
        return register(params);
    },
    rawRegister: params => {
        return rawRegister(params);
    },
    fromTransfer: (branchId, from, to, amount) => {
        let timestamp = Math.round(new Date().getTime() / 1000);
        return fromTransfer(branchId, from, to, amount, timestamp);
    },
    getBalance: (branchId, address) => {
        return getBalance(branchId, address);
    }
}