'use strict'

const bip39 = require('bip39')
const HDKey = require('./hdkey')
const chalk = require('chalk')

const HDpath = "m/44'/60'/0'/0/0";


const createAccount = () => {
    const low = require('lowdb')
    const FileSync = require('lowdb/adapters/FileSync')
    const adapter = new FileSync('account.json')
    const db = low(adapter)
    db.defaults({ accounts: [], principals:[] }).write()

    let mnemonic = bip39.generateMnemonic();
    const hdwallet = HDKey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
    const wallet = hdwallet.derivePath(HDpath).getWallet();
    const address = wallet.getAddressString();
    const fromPrivateKeyBuffer = wallet.getPrivateKey();

    db.get('accounts').push({
        address: address
    }).write()
    db.get('principals').push({
        address:address,
        EncryptedKey:fromPrivateKeyBuffer.toString('hex')
    }).write()

    return address;
}

const getAccounts = () => {
    const low = require('lowdb')
    const FileSync = require('lowdb/adapters/FileSync')
    const adapter = new FileSync('account.json')
    const db = low(adapter)
    return db.get("accounts").map("address").value().map(address => {
        console.log(`  ` + `${chalk.green(address)}`)
    }); 
}

const getAccount = index => {
    const low = require('lowdb')
    const FileSync = require('lowdb/adapters/FileSync')
    const adapter = new FileSync('account.json')
    const db = low(adapter)
    let address = db.get("accounts").map("address").value();
    return address[index]
}

const clear = () => {  
    console.log("Not yet")
    // lowdb.get("accounts")
    // .remove({address:address})
    // .write();
}

module.exports = {
    createAccount,
    getAccounts,
    getAccount,
    clear
}