const chalk = require('chalk')
const { db, config } = require('../db')
const { decryption } = require('../crypto')

const branch = db().get('remote').get('branch').value()
const branchId = branch ? Object.keys(branch)[0] : ""

let admin = db().get("accounts").map("address").value()[0]

const contracts =  branch => {
    return branch[branchId].contracts.reduce((m, c) => {
        m[c.name] = c.contractVersion;
        return m;
    },{})
}

// {"contractVersion":"19b9710dc8f0442d09a1b5e632f7200afe751d60","method":"faucet","params":{}}
// {"method":"faucet","contractVersion":"19b9710dc8f0442d09a1b5e632f7200afe751d60","params":{}}

const invoke = (password, contractName, method, params, ygg) => {
    if (db().get("accounts").find({address: admin}).value() == null) {
        console.log(`  ` + `${chalk.red("\nPlease create a account.\n")}`)
    } else {
        let privatekey = decryption(admin, password).toString('hex')
        if (contractName) {
            contractName = "YEED"
        }
        let contractVersion = contracts(branch)[contractName];
        if (contractVersion) {
            let body = {
                contractVersion: contractVersion,
                method: method,
                params: params
            }
            body = JSON.stringify(body)
            sendTransaction(privatekey, body, ygg)
        } else {
            console.log("contract is not exist")
        }
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
    const txHeaders = txHeader(body, ygg)
    const tx = new ygg.tx(txHeaders)
    tx.sign(privatekey)
    let serialize = tx.serialize(body)
    ygg.client.sendTransaction(serialize).then((result, error) => {
        if (!error) {
            if (result.status) {
                console.log(` ==> Transaction Hash : ${chalk.yellow(result.txHash)}`)
            } else {
                console.log(` ==> Transaction Error : ${chalk.red(JSON.stringify(result.logs))}`)
            }
        } else {
            console.log(error)
        }
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
    let timestamp = ygg.utils.decimalToHex(new Date().getTime());
    const header = {
        "chain":`0x${branchId}`,
        "version":`0x0000000000000000`,
        "type":`0x0000000000000000`,
        "timeStamp":`0x${timestamp}`,
        "bodyHash":`0x${ygg.utils.bodyHashHex(body)}`,
        "bodyLength":`0x${ygg.utils.decimalToHex(body.length)}`
    }
    return header
}


module.exports = {
    invoke
}