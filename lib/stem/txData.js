'use strict'

const { dataToJson, sha3, toBuffer } = require('../../utils');
const { numberToHex, decimalToHex } = require('../../utils/txUtil');
const { bodyData } = require('./txBody');
const { txHeaderData } = require('./txHeader');
const { fromPrivateKey } = require('../wallet');
const Tx = require("../transaction");
const { privateKeyBuffer, yggAddress } = require('../wallet/create')

const chain = Buffer.from("fe7b7c93dd23f78e12ad42650595bc0f874c88f7", 'hex').toString('hex');
const version = Buffer.from("0000000000000000", 'hex').toString('hex');
const type = Buffer.from("0000000000000000", 'hex').toString('hex');

const createBranch = (author, timestamp) => {
    let body = bodyData(timestamp, author);
    let bodyJson = dataToJson(body);

    let index = yggAddress.findIndex(addr => addr === author);

    const tx = new Tx(txHeader(timestamp, bodyJson));
    const signature = tx.sign(privateKeyBuffer[index]);
    let vrs = vrsData(signature);
    let txHash = txHashData(timestamp, bodyJson, vrs);

    let txData = {
      "timestamp":timestamp,
      "bodyLength":bodyJson.length,
      "body":"["+bodyJson+"]",
      "author":author.substring(2),
      "hash":txHash,
      "chain":"fe7b7c93dd23f78e12ad42650595bc0f874c88f7",
      "type":type,
      "version":version,
      "bodyHash":sha3(bodyJson).toString("hex"),
      "signature":vrs,
    }
    return txData;
 }

 const txHeader = (timestamp, bodyJson) => {
    return txHeaderData(chain, version, type, decimalToHex(timestamp), 
                        sha3(bodyJson).toString("hex"), decimalToHex(bodyJson.length));
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

const plant = params => {
    return params
}

 module.exports = {
    createBranch,
    plant
}