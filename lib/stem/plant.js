'use strict'

const { dataToJson, sha3 } = require('../../utils');
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

const contractVersion = "0xcc9612ff91ff844938acdb6608e58506a2f21b8a5d77e88726c0897e8d1d02c0"
const reference_address= ""
const reserve_address = "0xcee3d4755e47055b530deeba062c5bd0c17eb00f"

const plant = (author, seedFile, timestamp) => {
    let branchData = require( `${seedFile}` );
    let body= bodyData(author,
                      branchData.name,
                      branchData.symbol,
                      branchData.property,
                      branchData.type,
                      branchData.description,
                      branchData.tag,
                      contractVersion,
                      reference_address,
                      reserve_address,
                      timestamp);
    
    let bodyJson = "["+dataToJson(body)+"]";        
 
    let index = yggAddress.findIndex(addr => addr === author);

    const tx = new Tx(txHeader(timestamp, bodyJson));
    const signature = tx.sign(privateKeyBuffer[index]);
    let vrs = vrsData(signature);
    let txHash = txHashData(timestamp, bodyJson, vrs);
    
    // let txData = {
    //   "timestamp":timestamp,
    //   "bodyLength":bodyJson.length,
    //   "body":bodyJson,
    //   "author":author.substring(2),
    //   "hash":txHash,
    //   "chain":"fe7b7c93dd23f78e12ad42650595bc0f874c88f7",
    //   "type":type,
    //   "version":version,
    //   "bodyHash":sha3(Buffer.from(bodyJson)).toString("hex"),
    //   "signature":vrs,
    // }

    let branch = {
      "branchId":body.params[0].branchId,
      "branch":body.params[0].branch,
      "author":author,
      "transactionHash":txHash,
      "chain":"fe7b7c93dd23f78e12ad42650595bc0f874c88f7",
      "blockType":type,
      "blockVersion": version,
      "blockBodyHash":sha3(Buffer.from(bodyJson)).toString("hex"),
      "signature":vrs,
    }
    
    const branchLocation = path.join(__dirname, `../../branch/${branchData.name}.branch.json`);
    fs.writeFile(branchLocation, JSON.stringify(branch, undefined, 2), err => {
        if (err) throw err;
        console.log(`/branch/${branchData.name}.branch.json saved.`)
    })
    return branch;
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