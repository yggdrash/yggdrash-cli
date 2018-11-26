const { db } = require('../db')
const bip39 = require('bip39')
const chalk = require('chalk')
const Yggdrash = require("@yggdrash/sdk")

const create = password => {
    const ygg = new Yggdrash()
    db().defaults({ accounts: [] }).write()

    let mnemonic = bip39.generateMnemonic()
    const hdkey = ygg.hdwallet.fromMasterSeed(bip39.mnemonicToSeed(mnemonic))
    const wallet = hdkey.derivePath('m/44\'/60\'/0\'/0/0').getWallet()
    const address = wallet.getAddressString().slice(2)
    const fromPrivateKeyBuffer = wallet.getPrivateKey()

    // const { address, keystoreData } = ygg.wallet.create(password)
    // const fromPrivateKeyBuffer = ygg.wallet.getPrivateKey(keystoreData, password);
    // console.log(fromPrivateKeyBuffer)

    db().get('accounts').push({
        address: address,
        encryptedPass: '', 
        encryptedKey:fromPrivateKeyBuffer.toString('hex')
    }).write()
    
    return address;
}

const getAccounts = () => {
    return db().get("accounts").map("address").value().map(address => {
        console.log(`  ` + `${chalk.green(address)}`)
    }); 
}

const getAccount = index => {
    let address = db().get("accounts").map("address").value()
    return address[index]
}

const coinbase = (owner) => {
    let address = db().get("accounts").map("address").value()
    
    if(!owner){
        return address[0]
    } else {
        if(typeof owner !== "string"){
            console.log()
            console.log(`  ` + `${chalk.red("The type does not match. Enter the string.")}`)
        } else {
            db.get("accounts").find({address:address[0]}).assign({address:owner}).write()
            console.log(`  ` + `${chalk.green("** Complete Updtae **")}`)
            let update = db.get("accounts").map("address").value()
            return update[0]
        }
    }
}

const clear = () => {  
    const inquirer = require('inquirer')
    inquirer.prompt([{
        name: 'ok',
        type: 'confirm',
        message: 'Do you really want to clear it?',
      }]).then((answers) => {
          if (answers.ok) {
            db().get("accounts").map("address").value().map(address => {
                db().get("accounts").remove({address:address}).write();
            }); 
            let accountsResult = db().get("accounts").map("address").value()
            if (accountsResult[0] == null) {
                console.log()
                console.log(`  ` + `${chalk.green("** Complete clear accounts **")}`)
                console.log()
            } else {
                console.log(`  ` + `${chalk.red("db error")}`)
            }
          } else {
            console.log()
            console.log(`    ` + chalk.red(`Aborted.`))
            console.log()
            console.log()
          }
      })
}

module.exports = {
    create,
    getAccounts,
    getAccount,
    coinbase,
    clear
}