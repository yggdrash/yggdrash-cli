'use strict'

const { sha3 } = require('../../utils');
const { numberToHex, decimalToHex } = require('../../utils/txUtil');
const { bodyData } = require('./txBody');
const { txHeaderData } = require('./txHeader');
const Tx = require("../transaction");
const { sendTx } = require("./sendTx");
const { privateKeyBuffer, yggAddress } = require('../wallet/create')

const chain = Buffer.from("a08ee962cd8b2bd0edbfee989c1a9f7884d26532", 'hex').toString('hex');
const version = Buffer.from("0000000000000000", 'hex').toString('hex');
const type = Buffer.from("0000000000000000", 'hex').toString('hex');

const fromYeedTransfer = (from, to, amount, timestamp) => {
    let params = txData(from, to, amount, timestamp);
    return sendTx(params);
 }
 
 const txData = (from, to, amount, timestamp) => {
    let bodyJson = bodyData(to, amount);

    let index = yggAddress.findIndex(addr => addr === from);

    const tx = new Tx(txHeader(timestamp, bodyJson));
    const signature = tx.sign(privateKeyBuffer[index]);
    let vrs = vrsData(signature);
    let txHash = txHashData(timestamp, bodyJson, vrs);

    let txData = {
      "timestamp":timestamp,
      "bodyLength":bodyJson.length + 2,
      "body":"["+bodyJson+"]",
      "author":from.substring(2),
      "hash":txHash,
      "chain":"a08ee962cd8b2bd0edbfee989c1a9f7884d26532",
      "type":type,
      "version":version,
      "bodyHash":sha3(Buffer.from("["+bodyJson+"]")).toString("hex"),
      "signature":vrs,
    }
    return txData;
 }

 const txHeader = (timestamp, bodyJson) => {
    return txHeaderData(chain, version, type, decimalToHex(timestamp), 
                        sha3(Buffer.from("["+bodyJson+"]")).toString("hex"), decimalToHex(bodyJson.length));
 }

 const txHashData = (timestamp, bodyJson, vrs) => {
    let txHashHex = chain + version + type + decimalToHex(timestamp) 
                    + sha3(bodyJson).toString("hex") + decimalToHex(bodyJson.length) + vrs
    
    return sha3(Buffer.from(txHashHex)).toString("hex");

 }

 const vrsData = signature => {
    return numberToHex(signature.v).substring(2,4) 
            + signature.r.toString("hex") + signature.s.toString("hex");
 }

module.exports = {
    fromYeedTransfer
}