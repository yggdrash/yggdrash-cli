'use strict'

const bip39 = require('bip39')
const HDkey = require('yggjs-wallet/hdkey')
const ksHelper = require('./generation')
const chalk = require('chalk')

const HDpath = "m/44'/60'/0'/0/0";


const createAccount = () => {
    const low = require('lowdb')
    const FileSync = require('lowdb/adapters/FileSync')
    const adapter = new FileSync('account.json')
    const db = low(adapter)
    db.defaults({ accounts: [], principals:[] }).write()


    let mnemonic = bip39.generateMnemonic();
    const hdwallet =  HDkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
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

    // const keystoreData = JSON.stringify(wallet.toV3("password", 4096));
    // console.log(keystoreData)

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

const coinbase = (owner) => {
    const low = require('lowdb')
    const FileSync = require('lowdb/adapters/FileSync')
    const adapter = new FileSync('account.json')
    const db = low(adapter)
    let address = db.get("accounts").map("address").value();
    
    if(!owner){
        return address[0]
    } else {
        if(typeof owner !== "string"){
            console.log()
            console.log(`  ` + `${chalk.red("The type does not match. Enter the string.")}`)
        } else {
            db.get("accounts").find({address:address[0]}).assign({address:owner}).write()
            console.log(`  ` + `${chalk.green("complete updtae")}`)
            let update = db.get("accounts").map("address").value();
            return update[0]
        }
    }
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
    coinbase,
    clear
}