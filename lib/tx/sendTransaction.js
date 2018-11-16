'use strict'

const { coinbase } = require('../wallet/account')
const chalk = require('chalk')
const { db } = require('../db')
const Yggdrash = require("@yggdrash/sdk")

const transferFrom = (branchId, from, to, amount, net) => {
    var Break = new Error('Break')
    try {
        db().get("accounts").map("address").value().map(addr => {
            if (addr === from) {
                let privatekeyEncryptedKey = db().get("principals").find({address:from}).value().EncryptedKey
                sendTransaction(privatekeyEncryptedKey, branchId, to, amount, net) 

                throw Break;
            }
        });
    } catch (e) {
        if (e!== Break) {
            console.log()
            console.log(`  ` + chalk.red(`Invalid transaction data format`))
            console.log()
            throw Break;
        }
    }  
 }

 const transfer = (branchId, to, amount, net) => {
    if (db().get("principals").find({address:coinbase()}).value() == null) {
        console.log()
        console.log(`  ` + `${chalk.red("Please create a coinbase account.")}`)
    } else {
        const privatekeyEncryptedKey = db().get("principals").find({address:coinbase()}).value().EncryptedKey    
        sendTransaction(privatekeyEncryptedKey, branchId, to, amount, net)
    }
 }

 const sendTransaction = (privatekeyEncryptedKey, branchId, to, amount, net) => {
    const ygg = new Yggdrash(new Yggdrash.providers.HttpProvider(net ? `http://${net}` : 'http://localhost:8080'));
    let timestamp = new Date().getTime()

    const body = ygg.client.transfer(to, amount);
    let bodyJson = ygg.utils.dataToJson(body)
    
    const tx = new ygg.tx(txHeader(branchId, timestamp, bodyJson, ygg));
    tx.sign(new Buffer(privatekeyEncryptedKey, 'hex'));
    let serialize = tx.serialize(body, branchId);

    ygg.client.sendTransaction(serialize).then((result) => {
        console.log(`  ` + `==> Transaction Hash : ${chalk.yellow(result)}`)
    })   
 }

 const txHeader = (branchId, timestamp, bodyJson, ygg) => {
    const rawTx = {
        "chain":`0x${branchId}`,
        "version":`0x0000000000000000`,
        "type":`0x0000000000000000`,
        "timeStamp":`0x${ygg.utils.decimalToHex(timestamp)}`,
        "bodyHash":`0x${ygg.utils.bodyHashHex(bodyJson)}`,
        "bodyLength":`0x${ygg.utils.decimalToHex(bodyJson.length)}`
      };
    return rawTx;
 }

module.exports = {
    transferFrom,
    transfer
}