'use strict'

const chalk = require('chalk')
const { sha3, toBuffer } = require('../../utils');
const { numberToHex, decimalToHex, hexString } = require('../../utils/txUtil');
const { bodyData } = require('./txBody');
const { txHeaderData } = require('./txHeader');
const Tx = require("../transaction");
const { sendTx } = require("./sendTx");

const version = hexString("0000000000000000")
const type = hexString("0000000000000000")

const fromTransfer = (branchId, from, to, amount, timestamp) => {
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
                let vrs = vrsData(signature);
                let txHash = txHashData(tx, vrs);
                let txData = {
                    "timestamp":timestamp,
                    "bodyLength":bodyJson.length,
                    "body":bodyJson,
                    "author":from.substring(2),
                    "hash":txHash,
                    "chain":chain,
                    "type":type,
                    "version":version,
                    "bodyHash":sha3(Buffer.from(bodyJson)).toString("hex"),
                    "signature":vrs,
                }
                return sendTx(txData);
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
    return txHeaderData(chain, version, type, decimalToHex(timestamp), 
                        sha3(Buffer.from(bodyJson)).toString("hex"), decimalToHex(bodyJson.length));
 }

 const txHashData = (tx, vrs) => {
    const txHeaderHash = tx.headerHash();
    const txHashHex = txHeaderHash + vrs;
    return sha3(Buffer.from(txHashHex, 'hex')).toString("hex");
 }

 const vrsData = signature => {
    return numberToHex(signature.v).substring(2,4) 
            + signature.r.toString("hex") + signature.s.toString("hex");
 }

module.exports = {
    fromTransfer
}