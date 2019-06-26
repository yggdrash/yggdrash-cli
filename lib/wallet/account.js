const { db } = require('../db')
const bip39 = require('bip39')
const chalk = require('chalk')
const { decryption } = require('../crypto')
const fs = require('fs')
const getHomePath = require('home-path')
const exec = require('child_process').exec

/**
 * Create a local account
 *
 * @method create
 * @param {String} password The password used to encrypt the account private key
 * @returns {String} 
*/

const newAccount = (password, opts, ygg) => {
    if (!passVerify(password)) {
        console.log(`  ` + `${chalk.red('The password is weak.')}`)
        return false
    }
    
    db().defaults({ accounts: [] }).write()
    const { address, keystoreData } = ygg.wallet.create(password, opts)

    db().get('accounts').push({
        address: address.toLocaleLowerCase(),
        crypto: keystoreData.crypto
    }).write()
    console.log(`  ` + `${chalk.green(address)}`)
    return address
}

/**
 * Create a local HD wallet account
 *
 * @method hdCreate
 * @returns {String} 
*/

const hdCreate = ygg => {
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

const importAccount = (privateKey, password, ygg) => {
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
        crypto: keystoreData.crypto
    }).write()
    
    console.log(`  ` + `Address - ${chalk.green(address)}`)
    console.log(`  ` + `${chalk.green('You have successfully imported.\n')}`)
    
    return address
}

/**
 * export accounts
 *
 * @method exportAccount
 * @param {String} password The password used to encrypt the account private key
 * @returns {String} 
*/

const exportAccount = (address, password, type) => {
    if (type == 'privatekey') {
        let pk = decryption(address, password)
        console.log(`\n  ` + `Private key: ${chalk.green(pk.toString('hex'))}\n`)
    } else if (type == 'keystore') {
        let crypto = db().get("accounts").find({address: `${address}`}).value().crypto

        let priKey = { address: address, crypto: crypto }

        if (fs.existsSync(`${getHomePath}/Downloads/${address}.key`)) {
            console.log(`    ` + chalk.red(`It is already stored.`))
            return false
        }

        fs.writeFileSync(`${getHomePath}/Downloads/${address}.key`, JSON.stringify(priKey))
        exec(`chmod 400 ${getHomePath}/Downloads/${address}.key`, () =>{})

        console.log(`\n    ` + chalk.green(`✨ ${getHomePath}/Downloads/${address}.key`) + ` saved\n`)
    } else {
        console.log(`    ` + chalk.red(`Please select type`))
    }
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
 * Getter the admin account
 *
 * @method admin
 * @returns {String} 
*/
const getAdmin = () => {
    let address = db().get("accounts").map("address").value()[0]
    return address
}

/**
 * Setter the admin account
 *
 * @method admin
 * @param {String} owner Setting the admin account address
 * @returns {String} 
*/
const setAdmin = (owner, ygg) => {
    let address = db().get("accounts").map("address").value()[0]
    if(typeof owner !== "string"){
        console.log()
        console.log(`\n  ` + `${chalk.red("The type does not match. Enter the string.\n")}`)
    } else {
        if (!ygg.utils.isAddress(owner)) {
            console.log(`\n  ` + `${chalk.red('Address is invalid\n')}`)
            return false
        }

        let crypto = db().get("accounts").find({address: `${address}`}).value().crypto
        let updateCrypto = db().get("accounts").find({address: `${owner}`}).value().crypto
        db().get("accounts").find({crypto: crypto}).assign({crypto: updateCrypto}).write()

        db().get("accounts").remove({address:owner}).write()
        db().get("accounts").find({address: address}).assign({address: owner}).write()

        db().get('accounts').push({
            address: address,
            crypto: crypto
        }).write()

        console.log(`\n  ` + `${chalk.green("** Complete Updtae **")}`)
        let update = db().get("accounts").map("address").value()[0]
        return console.log(`  ` + `Admin - ${chalk.green(update)}`)
    }
}

/**
 * Verifying your admin
 *
 * @method adminVerify
 * @returns {Boolean} 
*/
const adminVerify = (admin, password, ygg) => {  
    let privatekey
    try {
        privatekey = decryption(admin, password).toString('hex')
    } catch {
        throw console.log(`\n  ` + `${chalk.red('Invalid password\n')}`)
    }
    
    const wallet = ygg.wallet.fromPrivateKey(privatekey)
    const adminAddress = wallet.getAddressString()

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
    var pass = true

    if (password.length > 32 || password.length < 10) {
        console.log(`  ` + `${chalk.red('Password length is 10 more and 32 less')}`)
        pass &= false
    }

    if (!/[A-Za-z0-9\\x21-\\x2F\\x3A-\\x40\\x5B-\\x60\\x7B-\\x7E]+/.test(password)) {
        console.log(`  ` + `${chalk.red('check valid character')}`)
        pass &= false
    }

    if (!/(.*[A-Z].*)/.test(password)) {
        console.log(`  ` + `${chalk.red('1 more Upper case')}`)
        pass &= false
    }

    if (!/(.*[a-z].*)/.test(password)) {
        console.log(`  ` + `${chalk.red('1 more lower case')}`)
        pass &= false
    }

    if (!/(.*[0-9].*)/.test(password)) {
        console.log(`  ` + `${chalk.red('1 more number')}`)
        pass &= false
    }

    if (!/(.*[\\x21-\\x2F\\x3A-\\x40\\x5B-\\x60\\x7B-\\x7E].*$)/.test(password)) {
        console.log(`  ` + `${chalk.red('1 more special symbol(ASCII character)')}`)
        pass &=  false
    }

    return pass
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
    newAccount,
    importAccount,
    exportAccount,
    getAccounts,
    getAccount,
    getAdmin,
    setAdmin,
    adminVerify,
    clear
}
