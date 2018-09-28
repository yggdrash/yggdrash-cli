'use strict'

const chalk = require('chalk')
const { sha3, toBuffer, decimalToHex, hexString } = require('../../utils');
const { bodyData } = require('./txBody');
const Tx = require("../transaction");
const { sendTx } = require("./sendTx");

const version = hexString("0000000000000000")
const type = hexString("0000000000000000")

const fromTransfer = (branchId, from, to, amount, net, timestamp) => {
    const chain = hexString(branchId)
    var Break = new Error('Break')

    const low = require('lowdb')
    const FileSync = require('lowdb/adapters/FileSync')
    const adapter = new FileSync('account.json')
    const db = low(adapter)

    try {
        db.get("accounts").map("address").value().map(addr => {
            if(addr === from){
                let privatekeyEncryptedKey = db.get("principals").find({address:from}).value().EncryptedKey
                let bodyJson = "["+bodyData(to, amount)+"]";
                
                const tx = new Tx(txHeader(chain, timestamp, bodyJson));
                const signature = tx.sign(toBuffer(`0x${privatekeyEncryptedKey}`));
                const vrs = tx.vrs(signature);

                let txData = {
                    "timestamp":timestamp,
                    "bodyLength":bodyJson.length,
                    "body":bodyJson,
                    "author":from.substring(2),
                    "hash":tx.getTxHash(signature),
                    "chain":chain,
                    "type":type,
                    "version":version,
                    "bodyHash":sha3(Buffer.from(bodyJson)).toString("hex"),
                    "signature":vrs,
                }
                if (net == null) {
                    let local = "localhost:8080"
                    return sendTx(txData, local);
                } else {
                    return sendTx(txData, net);
                }
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

 const txHeader = (chain, timestamp, bodyJson) => {
    const txHeaderData = {
        "chain":`0x${chain}`,
        "version":`0x${version}`,
        "type":`0x${type}`,
        "timeStamp":`0x${decimalToHex(timestamp)}`,
        "bodyHashHex":`0x${sha3(Buffer.from(bodyJson)).toString("hex")}`,
        "bodyLength":`0x${decimalToHex(bodyJson.length)}`
      };
    return txHeaderData;
 }

module.exports = {
    fromTransfer
}