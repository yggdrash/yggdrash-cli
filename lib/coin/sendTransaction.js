'use strict'

const chalk = require('chalk')
const Yggdrash = require("ygg")

const fromTransfer = (branchId, from, to, amount, net, timestamp) => {
    const ygg = new Yggdrash(new Yggdrash.providers.HttpProvider(net ? `http://${net}` : 'http://localhost:8080'));

    const low = require('lowdb')
    const FileSync = require('lowdb/adapters/FileSync')
    const adapter = new FileSync('account.json')
    const db = low(adapter)

    var Break = new Error('Break')

    try {
        db.get("accounts").map("address").value().map(addr => {
            if(addr === from){
                let privatekeyEncryptedKey = db.get("principals").find({address:from}).value().EncryptedKey
                const body = ygg.client.transfer(to, amount);
                let bodyJson = ygg.utils.dataToJson(body)
                
                const tx = new ygg.tx(txHeader(branchId, timestamp, bodyJson, ygg));
                tx.sign(new Buffer(privatekeyEncryptedKey, 'hex'));

                let serialize = tx.serialize(body, branchId);
                console.log(serialize)
                ygg.client.sendTransaction(serialize).then((result) => {
                    console.log(`  ` + `==> Transaction Hash : ${chalk.yellow(result)}`)
                })   
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
    fromTransfer
}