const Yggdrash = require("@yggdrash/sdk")
const { db } = require('../db')
const bip39 = require('bip39')
const chalk = require('chalk')
const { decryption } = require('../crypto')

/**
 * Create a local account
 *
 * @method create
 * @param {String} password The password used to encrypt the account private key
 * @returns {String} 
*/

const create = password => {
    // passVerify(password)
    const ygg = new Yggdrash()
    db().defaults({ accounts: [] }).write()
    const { address, keystoreData } = ygg.wallet.create(password)

    db().get('accounts').push({
        address: address,
        crypto: keystoreData.crypto
    }).write()

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
        console.log(`\n  ` + `${chalk.red('Private key does not satisfy the curve requirements (ie. it is invalid)\n')}`)
        return false
    }

    db().defaults({ accounts: [] }).write()
    const { address, keystoreData } = ygg.wallet.import(privateKey, password)
    
    if (db().get("accounts").find({address: `${address}`}).value()) {
        console.log(`\n  ` + `${chalk.red('It is an existing address.\n')}`)
        return false
    }

    db().get('accounts').push({
        address: address,
        encryptedKey: keystoreData.crypto.ciphertext,
        nonce: keystoreData.crypto.cipherparams.iv,
        kdfParams: keystoreData.crypto.kdfparams
    }).write()
    console.log(`\n  ` + `Address: ${chalk.green(address)}`)
    console.log(`  ` + `${chalk.green('You have successfully imported.\n')}`)
}

/**
 * export accounts
 *
 * @method exportAccount
 * @param {String} password The password used to encrypt the account private key
 * @returns {String} 
*/

const exportAccount = password => {
    // pk

    // key store
    
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

/**
 * Setter and Getter the admin account
 *
 * @method adminAccount
 * @param {String} owner Setting the admin account address
 * @returns {String} 
*/
const adminAccount = (owner) => {
    let address = db().get("accounts").map("address").value()[0]
    if(!owner){
        return address
    } else {
        if(typeof owner !== "string"){
            console.log()
            console.log(`\n  ` + `${chalk.red("The type does not match. Enter the string.\n")}`)
        } else {
            const ygg = new Yggdrash()
    
            if (!ygg.utils.isAddress(owner)) {
                console.log(`\n  ` + `${chalk.red('Address is invalid\n')}`)
                return false
            }

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

            console.log(`\n  ` + `${chalk.green("** Complete Updtae **")}`)
            let update = db().get("accounts").map("address").value()[0]
            return update
        }
    }
}

/**
 * Verifying your admin
 *
 * @method adminVerify
 * @returns {Boolean} 
*/
const adminVerify = (admin, password) => {  
    let privatekey
    try {
        privatekey = decryption(admin, password).toString('hex')
    } catch {
        throw console.log(`\n  ` + `${chalk.red('Invalid password\n')}`)
    }
    const ygg = new Yggdrash()
    const account = ygg.wallet.fromPrivateKey(ygg.utils.toBuffer(`0x${privatekey}`))
    const adminAddress = account.getAddressString().slice(2)

    if (!(adminAddress.toLocaleLowerCase() === admin.toLocaleLowerCase())) {
        throw console.log(`\n  ` + `${chalk.red('Invalid password\n')}`)
    }
    return true
}

/**
 * Verifying your account password
 *
 * @method passVerify
 * @returns {Boolean} 
*/
const passVerify = password => {  
    if (password.length > 32 || password.length < 12) {
        //todo: change from static password length to config properties
        return false;
    }

    // check valid character
    if (!/[A-Za-z0-9\\x21-\\x2F\\x3A-\\x40\\x5B-\\x60\\x7B-\\x7E]+/.test(password)) {
        return false;
    }

    // 1 more Upper case
    if (!/(.*[A-Z].*)/.test(password)) {
        return false;
    }

    // 1 more lower case
    if (!/(.*[a-z].*)/.test(password)) {
        return false;
    }

    // 1 more number
    if (!/(.*[0-9].*)/.test(password)) {
        return false;
    }

    // 1 more special symbol(ASCII character)
    return /(.*[\\x21-\\x2F\\x3A-\\x40\\x5B-\\x60\\x7B-\\x7E].*$)/.test(password)
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
        console.log(`\n  ` + `${chalk.green("** Complete clear accounts **\n")}`)
    }else {
        console.log(`\n  ` + `${chalk.red("db error")}`)
    }
}

module.exports = {
    create,
    importAccount,
    getAccounts,
    getAccount,
    adminAccount,
    adminVerify,
    clear
}
