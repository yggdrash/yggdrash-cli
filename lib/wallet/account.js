const { db } = require('../db')
const bip39 = require('bip39')
const chalk = require('chalk')
const Yggdrash = require("@yggdrash/sdk")

/**
 * Create a local account
 *
 * @method create
 * @param {String} password The password used to encrypt the account private key
 * @returns {String} 
*/

const create = password => {
    const ygg = new Yggdrash()
    db().defaults({ accounts: [] }).write()
    const { address, keystoreData } = ygg.wallet.create(password)

    db().get('accounts').push({
        address: address,
        encryptedKey: keystoreData.crypto.ciphertext,
        iv: keystoreData.crypto.cipherparams.iv,
        kdfParams: keystoreData.crypto.kdfparams
    }).write()

    //TODO:
    // admin key path 지정
    // fs .key
    let priKey = Buffer.concat([Buffer.from(keystoreData.crypto.cipherparams.iv, 'hex'), 
                                Buffer.from(keystoreData.crypto.ciphertext, 'hex')])

    
    return address
}

/**
 * Create a local HD wallet account
 *
 * @method hdCreate
 * @returns {String} 
*/

const hdCreate = () => {
    const ygg = new Yggdrash()
    db().defaults({ accounts: [] }).write()

    let mnemonic = bip39.generateMnemonic()
    const hdkey = ygg.hdwallet.fromMasterSeed(bip39.mnemonicToSeed(mnemonic))
    const wallet = hdkey.derivePath('m/44\'/60\'/0\'/0/0').getWallet()
    
    /* child */
    // const wallet = hdkey.deriveChild(0).getWallet()
    // const fromPrivateKeyBuffer = wallet.getPrivateKey()

    const address = wallet.getAddressString().slice(2)
    const fromPrivateKeyBuffer = wallet.getPrivateKey()
    
    return address
}

/**
 * List of accounts created locally
 *
 * @method getAccounts
 * @returns {String} 
*/

const getAccounts = () => {
    return db().get("accounts").map("address").value().map(address => {
        console.log(`  ` + `${chalk.green(address)}`)
    }); 
}

/**
 * Get the address of a specific account
 *
 * @method getAccount
 * @returns {String} 
*/

const getAccount = index => {
    let address = db().get("accounts").map("address").value()
    return address[index]
}

const adminAccount = (owner) => {
    let address = db().get("accounts").map("address").value()[0]
    if(!owner){
        return address
    } else {
        if(typeof owner !== "string"){
            console.log()
            console.log(`  ` + `${chalk.red("The type does not match. Enter the string.")}`)
        } else {
            const ygg = new Yggdrash()
    
            if (!ygg.utils.isAddress(owner)) {
                console.log()
                console.log(`  ` + `${chalk.red('it is invalid')}`)
                console.log()
                return false
            }
            //TODO:
            // require password

            let encryptedKey = db().get("accounts").find({address: `${address}`}).value().encryptedKey
            let updateEncryptedKey = db().get("accounts").find({address: `${owner}`}).value().encryptedKey
            db().get("accounts").find({encryptedKey: encryptedKey}).assign({encryptedKey: updateEncryptedKey}).write()
            
            let iv = db().get("accounts").find({address: `${address}`}).value().iv
            let updateIv = db().get("accounts").find({address: `${owner}`}).value().iv
            db().get("accounts").find({iv: iv}).assign({iv: updateIv}).write()

            let kdfParams = db().get("accounts").find({address: `${address}`}).value().kdfParams
            let updateKdfParams = db().get("accounts").find({address: `${owner}`}).value().kdfParams
            db().get("accounts").find({kdfParams: kdfParams}).assign({kdfParams: updateKdfParams}).write()

            db().get("accounts").remove({address:owner}).write()
            db().get("accounts").find({address: address}).assign({address: owner}).write()


            db().get('accounts').push({
                address: address,
                encryptedKey: encryptedKey,
                iv: iv,
                kdfParams: kdfParams
            }).write()

            console.log(`  ` + `${chalk.green("** Complete Updtae **")}`)
            let update = db().get("accounts").map("address").value()[0]
            return update
        }
    }
}

/**
 * Import externally generated accounts
 *
 * @method importAccount
 * @param {String} privateKey Externally generated account private key
 * @param {String} password The password used to encrypt the account private key
 * @returns {String} 
*/

const importAccount = (privateKey, password) => {
    const ygg = new Yggdrash()
    
    if (!ygg.utils.isValidPrivate(Buffer.from(privateKey, 'hex'))) {
        console.log()
        console.log(`  ` + `${chalk.red('Private key does not satisfy the curve requirements (ie. it is invalid)')}`)
        console.log()
        return false
    }

    db().defaults({ accounts: [] }).write()
    const { address, keystoreData } = ygg.wallet.import(privateKey, password)
    
    if (db().get("accounts").find({address: `${address}`}).value()) {
        console.log()
        console.log(`  ` + `${chalk.red('It is an existing address.')}`)
        console.log()
        return false
    }

    db().get('accounts').push({
        address: address,
        encryptedKey: keystoreData.crypto.ciphertext,
        nonce: keystoreData.crypto.cipherparams.iv,
        kdfParams: keystoreData.crypto.kdfparams
    }).write()
    console.log()
    console.log(`  ` + `Address: ${chalk.green(address)}`)
    console.log(`  ` + `${chalk.green('You have successfully imported.')}`)
    console.log()
}

/**
 * Reset locally created accounts
 *
 * @method clear
*/
const clear = () => {  
    db().get("accounts").map("address").value().map(address => {
        db().get("accounts").remove({address:address}).write()
    })
    let accountsResult = db().get("accounts").map("address").value()
    if(accountsResult[0] == null){
        console.log(`  ` + `${chalk.green("** Complete clear accounts **")}`)
    }else {
        console.log(`  ` + `${chalk.red("db error")}`)
    }
}

module.exports = {
    create,
    getAccounts,
    getAccount,
    adminAccount,
    importAccount,
    clear
}