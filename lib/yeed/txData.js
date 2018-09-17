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

const getTimestamp = Math.round(new Date().getTime() / 1000);

const createBranch = author => {
    // let body = bodyData(getTimestamp, author);
    // let bodyJson = dataToJson(body);

    // // const account = fromPrivateKey(toBuffer(`0x3D8A58EA7FA6EF7E038791F3B837FA7BC62DC38CAAFE67AFC4D4567A64D4966E`));
    // // const fromAddress = account.getAddressString();
    // // const fromPrivateKeyBuffer = account.getPrivateKey();

    // const tx = new Tx(txHeader(getTimestamp, bodyJson));
    // const signature = tx.sign(privateKeyBuffer[0]);
    // let vrs = vrsData(signature);
    // let txHash = txHashData(getTimestamp, bodyJson, vrs);

    // let txData = {
    //   "timestamp":getTimestamp,
    //   "bodyLength":bodyJson.length,
    //   "body":"["+bodyJson+"]",
    //   "author":author.substring(2),
    //   "hash":txHash,
    //   "chain":"fe7b7c93dd23f78e12ad42650595bc0f874c88f7",
    //   "type":type,
    //   "version":version,
    //   "bodyHash":sha3(bodyJson).toString("hex"),
    //   "signature":vrs,
    // }
    // return txData;

    let index = yggAddress.findIndex(addr => addr.value === author);
    console.log("Asdf")
    return index
 }

 const txHeader = (getTimestamp, bodyJson) => {
    return txHeaderData(chain, version, type, decimalToHex(getTimestamp), 
                        sha3(bodyJson).toString("hex"), decimalToHex(bodyJson.length));
 }

 const txHashData = (getTimestamp, bodyJson, vrs) => {
    let txHashHex = chain + version + type + decimalToHex(getTimestamp) 
                    + sha3(bodyJson).toString("hex") + decimalToHex(bodyJson.length) + vrs
    
    return sha3(Buffer.from(txHashHex)).toString("hex");

 }

 const vrsData = signature => {
  return numberToHex(signature.v).substring(2,4) 
          + signature.r.toString("hex") + signature.s.toString("hex");
 }

 module.exports = {
    createBranch
}