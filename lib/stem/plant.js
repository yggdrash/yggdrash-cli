'use strict'

const { sha3 } = require('../../utils');
const { numberToHex, decimalToHex } = require('../../utils/txUtil');
const { bodyData } = require('./txBody');
const { txHeaderData } = require('./txHeader');
const Tx = require("../transaction");
const fs = require("fs");
const path = require("path");
const { privateKeyBuffer, yggAddress } = require('../wallet/create')

const chain = Buffer.from("fe7b7c93dd23f78e12ad42650595bc0f874c88f7", 'hex').toString("hex");
const version = Buffer.from("0000000000000000", 'hex').toString("hex");
const type = Buffer.from("0000000000000000", 'hex').toString("hex");

const plant = (author, seedFile, timestamp) => {
    let branchData = require( `../../seed/${seedFile}` );
    let bodyJson = "["
                    + bodyData
                    (
                      author,
                      branchData.name,
                      branchData.symbol,
                      branchData.property,
                      branchData.type,
                      branchData.description,
                      branchData.tag,
                      branchData.version,
                      branchData.reference_address,
                      branchData.reserve_address,
                      timestamp
                    )
                    +"]";
    let index = yggAddress.findIndex(addr => addr === author);

    const tx = new Tx(txHeader(timestamp, bodyJson));
    const signature = tx.sign(privateKeyBuffer[index]);
    let vrs = vrsData(signature);
    let txHash = txHashData(timestamp, bodyJson, vrs);
    
    let txData = {
      "timestamp":timestamp,
      "bodyLength":bodyJson.length,
      "body":bodyJson,
      "author":author.substring(2),
      "hash":txHash,
      "chain":"fe7b7c93dd23f78e12ad42650595bc0f874c88f7",
      "type":type,
      "version":version,
      "bodyHash":sha3(Buffer.from(bodyJson)).toString("hex"),
      "signature":vrs,
    }
    
    const branchLocation = path.join(__dirname, `../../branch/${branchData.name}.json`);
    fs.writeFile(branchLocation, JSON.stringify(txData, undefined, 2), err => {
        if (err) throw err;
        console.log(`branch/${branchData.name} saved.`)
    })
    return txData;
 }

 const txHeader = (timestamp, bodyJson) => {
    return txHeaderData(chain, version, type, decimalToHex(timestamp), 
                        sha3(Buffer.from(bodyJson)).toString("hex"), decimalToHex(bodyJson.length));
 }

 const txHashData = (timestamp, bodyJson, vrs) => {
    let txHashHex = chain + version + type + Buffer.from(decimalToHex(timestamp), 'hex').toString('hex')
                    + sha3(Buffer.from(bodyJson)).toString("hex") 
                    + Buffer.from(decimalToHex(bodyJson.length), 'hex').toString('hex') + vrs;

    return sha3(Buffer.from(txHashHex, 'hex')).toString("hex");
 }

 const vrsData = signature => {
  return numberToHex(signature.v).substring(2,4) 
          + signature.r.toString("hex") + signature.s.toString("hex");
 }

 module.exports = {
  plant
}