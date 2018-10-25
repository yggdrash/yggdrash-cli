'use strict'

const { db } = require('../db')
const bip39 = require('bip39')
const HDkey = require('yggjs-wallet/hdkey')
const ksHelper = require('./generation')
const chalk = require('chalk')

const HDpath = "m/44'/60'/0'/0/0";


const create = () => {
    db().defaults({ accounts: [], principals:[] }).write()

    let mnemonic = bip39.generateMnemonic();
    const hdwallet =  HDkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
    const wallet = hdwallet.derivePath(HDpath).getWallet();
    const address = wallet.getAddressString();
    const fromPrivateKeyBuffer = wallet.getPrivateKey();
    
    db().get('accounts').push({
        address: address
    }).write()
    db().get('principals').push({
        address:address,
        EncryptedKey:fromPrivateKeyBuffer.toString('hex')
    }).write()

    // const keystoreData = JSON.stringify(wallet.toV3("password", 4096));
    // console.log(keystoreData)

    return address;
}

const getAccounts = () => {
    return db().get("accounts").map("address").value().map(address => {
        console.log(`  ` + `${chalk.green(address)}`)
    }); 
}

const getAccount = index => {
    let address = db().get("accounts").map("address").value();
    return address[index]
}

const coinbase = (owner) => {
    let address = db().get("accounts").map("address").value();
    
    if(!owner){
        return address[0]
    } else {
        if(typeof owner !== "string"){
            console.log()
            console.log(`  ` + `${chalk.red("The type does not match. Enter the string.")}`)
        } else {
            db.get("accounts").find({address:address[0]}).assign({address:owner}).write()
            console.log(`  ` + `${chalk.green("** Complete Updtae **")}`)
            let update = db.get("accounts").map("address").value();
            return update[0]
        }
    }
}

const clear = () => {  
    db().get("accounts").map("address").value().map(address => {
        db().get("accounts").remove({address:address}).write();
        db().get("principals").remove({address:address}).write();
    }); 
    let accountsResult = db().get("accounts").map("address").value()
    let principalsResult = db().get("principals").map("address").value()
    if(accountsResult[0] || principalsResult[0] == null){
        console.log(`  ` + `${chalk.green("** Complete clear accounts **")}`)
    }else {
        console.log(`  ` + `${chalk.red("db error")}`)
    }
}

module.exports = {
    create,
    getAccounts,
    getAccount,
    coinbase,
    clear
}