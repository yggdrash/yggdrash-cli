'use strict'

const chalk = require('chalk')
const Yggdrash = require("ygg")

const fromTransfer = (branchId, from, to, amount, net, timestamp) => {
    const ygg = new Yggdrash(new Yggdrash.providers.HttpProvider(net ? `http://${net}` : 'http://localhost:8080'));
    const chain = ygg.utils.hexString(branchId)
    var Break = new Error('Break')

    const low = require('lowdb')
    const FileSync = require('lowdb/adapters/FileSync')
    const adapter = new FileSync('account.json')
    const db = low(adapter)

    try {
        db.get("accounts").map("address").value().map(addr => {
            if(addr === from){
                let privatekeyEncryptedKey = db.get("principals").find({address:from}).value().EncryptedKey
                const body = ygg.client.transfer(to, amount);
                let bodyJson = ygg.utils.dataToJson(body)
                
                const tx = new ygg.tx(txHeader(chain, timestamp, bodyJson, ygg));
                tx.sign(new Buffer(privatekeyEncryptedKey, 'hex'));

                let serialize = tx.serialize(body, branchId);
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

 const txHeader = (chain, timestamp, bodyJson, ygg) => {
    const version = ygg.utils.hexString("0000000000000000")
    const type = ygg.utils.hexString("0000000000000000")

    const rawTx = {
        "chain":`0x${chain}`,
        "version":`0x${version}`,
        "type":`0x${type}`,
        "timeStamp":`0x${ygg.utils.decimalToHex(timestamp)}`,
        "bodyHash":`0x${ygg.utils.bodyHashHex(bodyJson)}`,
        "bodyLength":`0x${ygg.utils.decimalToHex(bodyJson.length)}`
      };
    return rawTx;
 }

module.exports = {
    fromTransfer
}