const { adminAccount } = require('../wallet/account')
const chalk = require('chalk')
const Buffer = require('safe-buffer').Buffer
const { db } = require('../db')
const Yggdrash = require("@yggdrash/sdk")
const { decryption } = require('../crypto')

/**
 * Enter the address of the account to send to generate the transaction
 *
 * @method transferFrom
 * @param {String} from from address
 * @param {String} to to address
 * @param {String} amount to amount
 * @param {String} password password of from account
 * @param {String} net network option
 * @returns {String} 
*/

const transferFrom = (from, to, amount, password, net) => {
    //TODO: from의 잔고 확인
    const ygg = new Yggdrash(new Yggdrash.providers.HttpProvider(net ? `http://${net}` : 'http://localhost:8080'))
    let Break = new Error('Break')
    try {
        db().get("accounts").map("address").value().map(addr => {
            if (addr === from) {
                let privatekey = decryption(from, password).toString('hex')
                const body = ygg.client.transferFromBody(from, to, amount)
                sendTransaction(privatekey, body, ygg) 

                throw Break
            }
        });
    } catch (e) {
        if (e!== Break) {
            console.log(`  ` + chalk.red(`\nInvalid transaction data format\n`))
            throw Break
        }
    }
 }

 /**
 * A transaction is generated without entering the address of the account to be sent.
 * The address of from is the admin account by default.
 *
 * @method transfer
 * @param {String} to to address
 * @param {String} amount to amount
 * @param {String} password password of admin account
 * @param {String} net network option
 * @returns {String} 
*/

 const transfer = (to, amount, password, net) => {
    const ygg = new Yggdrash(new Yggdrash.providers.HttpProvider(net ? `http://${net}` : 'http://localhost:8080'))
    if (db().get("accounts").find({address:adminAccount()}).value() == null) {
        console.log(`  ` + `${chalk.red("\nPlease create a admin account.\n")}`)
    } else {
        let privatekey = decryption(adminAccount(), password).toString('hex')
        const body = ygg.client.transferBody(to, amount)
        sendTransaction(privatekey, body, ygg)
    }
 }

 /**
 * A transaction is generated without entering the address of the account to be sent.
 * The address of from is the admin account by default.
 *
 * @method transfer
 * @param {String} to to address
 * @param {String} amount to amount
 * @param {String} password password of admin account
 * @param {String} net network option
 * @returns {String} 
*/

const approve = (spender, amount, password, net) => {
    const ygg = new Yggdrash(new Yggdrash.providers.HttpProvider(net ? `http://${net}` : 'http://localhost:8080'))
    if (db().get("accounts").find({address:adminAccount()}).value() == null) {
        console.log(`  ` + `${chalk.red("\nPlease create a admin account.\n")}`)
    } else {
        let privatekey = decryption(adminAccount(), password).toString('hex')
        const body = ygg.client.approveBody(spender, amount)
        sendTransaction(privatekey, body, ygg)
    }
 }

 /**
 * Transactions occur at node
 * network is optional.
 *
 * @method sendTransaction
 * @param {String} privatekey The private key of the account to which the transaction will be sent.
 * @param {String} to to address
 * @param {String} amount
 * @param {String} net
 * @returns {String} 
*/

 const sendTransaction = (privatekey, body, ygg) => {
    let timestamp = new Date().getTime()
    let branch = db().get('currentBranch').value()[0]

    const tx = new ygg.tx(txHeader(branch.id, timestamp, body, ygg))
    tx.sign(Buffer.from(privatekey, 'hex'))
    let serialize = tx.serialize(body)
    // console.log("pubkey", tx.getSenderPublicKey().toString('hex'))

    ygg.client.sendTransaction(serialize).then((result) => {
        console.log(`  ` + `==> Transaction Hash : ${chalk.yellow(result)}`)
    })
 }

 /**
 * Transaction header data required when a transaction occurs
 * It consists of a hex string.
 * 
 * @method txHeader
 * @param {String} branch Network ID
 * @param {String} timestamp Time when transaction occurred
 * @param {String} bodyJson Transaction body serialized value
 * @param {String} ygg Use ygg utils to fit three in hex string format(timestamp, body hash, body length )
 * @returns {String} 
*/

 const txHeader = (branch, timestamp, bodyJson, ygg) => {
    const rawTx = {
        "chain":`0x${branch.trim()}`,
        "version":`0x0000000000000000`,
        "type":`0x0000000000000000`,
        "timeStamp":`0x${ygg.utils.decimalToHex(timestamp)}`,
        "bodyHash":`0x${ygg.utils.bodyHashHex(bodyJson)}`,
        "bodyLength":`0x${ygg.utils.decimalToHex(bodyJson.length)}`
      };
    return rawTx
 }

module.exports = {
    transferFrom,
    transfer,
    approve
}