const chalk = require('chalk')
const Buffer = require('safe-buffer').Buffer
const { db, config } = require('../db')
const { decryption } = require('../crypto')

let admin = db().get("accounts").map("address").value()[0]

const branch = db().get('remote').get('branch').value()
const branchId = branch ? Object.keys(branch)[0] : ""

const yeedContract =  branch => {
    let contractVersion = undefined
    let contacts = branch[branchId].contracts
    for (var i in contacts) {
        if (contacts[i].name == "YEED") {
            contractVersion = contacts[i].contractVersion;
            break;
        }
    }
    return contractVersion;
}

const contracts =  branch => {
    return branch[branchId].contracts.reduce((m, c) => {
        m[c.name] = c.contractVersion;
        return m;
    },{})
}


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

const transferFrom = (from, to, amount, password, ygg) => {
    //TODO: from의 잔고 확인
    if (db().get("accounts").find({address: admin}).value() == null) {
        console.log(`  ` + `${chalk.red("\nPlease create a admin account.\n")}`)
    } else {
        let privatekey = decryption(admin, password).toString('hex')
        const body = ygg.client.transferFromBody(from, to, amount)
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
 * @param {String} ygg network option
 * @returns {String} 
*/

 const transfer = (to, amount, password, ygg) => {
    if (db().get("accounts").find({address: admin}).value() == null) {
        console.log(`  ` + `${chalk.red("\nPlease create a admin account.\n")}`)
    } else {
        let privatekey = decryption(admin, password).toString('hex')   
        let contractVersion = yeedContract(branch);
        const body = ygg.client.transferBody(contractVersion, to, amount)
        sendTransaction(privatekey, body, ygg)
    }
 }

 /**
 * Register a branch in the stem contract
 *
const create = (spender, amount, password, ygg) => {
 * @method approve
 * @param {String} spender spender address
 * @param {String} amount to amount
 * @param {String} password password of admin account
 * @param {String} ygg network option
 * @returns {String} 
*/

const create = (password, ygg) => {
    if (db().get("accounts").find({address: admin}).value() == null) {
        console.log(`  ` + `${chalk.red("\nPlease create a admin account.\n")}`)
    } else {
        let privatekey = decryption(admin, password).toString('hex')
        const createBody = {
            method: "create",
            contractVersion: "system-stem-contract-1.0.0.jar",
            params: {
                "branch": {
                    "name": "metacoin",
                    "symbol": "MCO",
                    "property": "currency",
                    "description": "The Basis of the YGGDRASH Ecosystem. It is also an aggregate and a blockchain containing information of all Branch Chains.",
                    
                    "contracts": [
                    {
                        "contractVersion": "system-stem-contract-1.0.1.jar",
                        "init": {
                        
                        },
                        "description": "some description",
                        "name": "MCO",
                        "isSystem": true
                    }
                    ],
                    "timestamp": "00000166c837f0c9",
                    "validator": [
                    "bce86430ffa71703749ea50f4f2a1a1cd3b33d36"
                    ]
                },
                "fee": 100
            }
        }
        const body = ygg.utils.jsonToArrayString(createBody); 
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

const approve = (spender, amount, password, ygg) => {
    if (db().get("accounts").find({address: admin}).value() == null) {
        console.log(`  ` + `${chalk.red("\nPlease create a admin account.\n")}`)
    } else {
        let privatekey = decryption(admin, password).toString('hex')
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
    transferFrom,
    transfer,
    approve,
    create
}