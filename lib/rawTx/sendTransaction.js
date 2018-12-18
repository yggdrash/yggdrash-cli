const { getAdmin } = require('../wallet/account')
const chalk = require('chalk')
const Buffer = require('safe-buffer').Buffer
const { db } = require('../db')
const { decryption } = require('../crypto')
const { api } = require('../api')

let ygg


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
    ygg = api(net)
    let F = db().get("accounts").find({address: `${from}`}).value()
    if (!!F) {
        let privatekey = decryption(F.address, password).toString('hex')
        const body = ygg.client.transferFromBody(from, to, amount)
        sendTransaction(privatekey, body, ygg) 
    } else {
        console.log(`\n  ` + chalk.red(`There is no private key information in cli.\n`))
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
 * @param {String} ygg network option
 * @returns {String} 
*/

 const transfer = (to, amount, password, net) => {
    ygg = api(net)
    if (db().get("accounts").find({address:getAdmin()}).value() == null) {
        console.log(`  ` + `${chalk.red("\nPlease create a admin account.\n")}`)
    } else {
        let privatekey = decryption(getAdmin(), password).toString('hex')
        const body = ygg.client.transferBody(to, amount)
        sendTransaction(privatekey, body, ygg)
    }
 }

 /**
 * In my account, grant some rights to the amount of money available to a particular account.
 * The address of from is the admin account by default.
 *
 * @method approve
 * @param {String} spender spender address
 * @param {String} amount to amount
 * @param {String} password password of admin account
 * @param {String} ygg network option
 * @returns {String} 
*/

const approve = (spender, amount, password, net) => {
    ygg = api(net)
    if (db().get("accounts").find({address:getAdmin()}).value() == null) {
        console.log(`  ` + `${chalk.red("\nPlease create a admin account.\n")}`)
    } else {
        let privatekey = decryption(getAdmin(), password).toString('hex')
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
 * @param {String} body
 * @param {String} ygg
 * @returns {String} 
*/

 const sendTransaction = (privatekey, body, ygg) => {
    const tx = new ygg.tx(txHeader(body, ygg))
    tx.sign(Buffer.from(privatekey, 'hex'))
    let serialize = tx.serialize(body)

    ygg.client.sendTransaction(serialize).then((result) => {
        console.log(`  ` + `==> Transaction Hash : ${chalk.yellow(result)}`)
    })
 }

 /**
 * Transaction header data required when a transaction occurs
 * It consists of a hex string.
 * 
 * @method txHeader
 * @param {String} body Transaction body serialized value
 * @param {String} ygg Use ygg utils to fit three in hex string format(timestamp, body hash, body length )
 * @returns {String} 
*/

 const txHeader = (body, ygg) => {
    let timestamp = new Date().getTime()
    // let branch = db().get('currentBranch').value()[0]
    const branch = '61dcf9cf6ed382f39f56a1094e2de4d9aa54bf94'
    const rawTx = {
        "chain":`0x${branch.trim()}`,
        "version":`0x0000000000000000`,
        "type":`0x0000000000000000`,
        "timeStamp":`0x${ygg.utils.decimalToHex(timestamp)}`,
        "bodyHash":`0x${ygg.utils.bodyHashHex(body)}`,
        "bodyLength":`0x${ygg.utils.decimalToHex(body.length)}`
    }
    return rawTx
 }

module.exports = {
    transferFrom,
    transfer,
    approve
}