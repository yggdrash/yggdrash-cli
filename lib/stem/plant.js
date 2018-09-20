'use strict'

const chalk = require('chalk')
const { fromPrivateKey } = require('../wallet')
const { dataToJson, sha3, toBuffer } = require('../../utils')
const { numberToHex, decimalToHex, hexString } = require('../../utils/txUtil')
const { bodyData } = require('./txBody')
const { txHeaderData } = require('./txHeader')
const Tx = require("../transaction")
const fs = require("fs")
const path = require("path")

const chain = hexString("fe7b7c93dd23f78e12ad42650595bc0f874c88f7")
const version = hexString("0000000000000000")
const type = hexString("0000000000000000")

const contractVersion = "0xcc9612ff91ff844938acdb6608e58506a2f21b8a5d77e88726c0897e8d1d02c0"
const reference_address= ""
const reserve_address = "0xcee3d4755e47055b530deeba062c5bd0c17eb00f"
const plant = (author, seedFilePath, timestamp) => {
    var Break = new Error('Break')
    
    const low = require('lowdb')
    const FileSync = require('lowdb/adapters/FileSync')
    const adapter = new FileSync('account.json')
    const db = low(adapter)

    const fileDir = path.dirname(seedFilePath)
    let branchData = JSON.parse(fs.readFileSync(seedFilePath, 'utf8'))

    try {
        db.get("accounts").map("address").value().map(addr => {
            if(addr === author){
                let privatekeyEncryptedKey = db.get("principals").find({address:author}).value().EncryptedKey
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
                const tx = new Tx(txHeader(timestamp, bodyJson));
                const signature = tx.sign(toBuffer(`0x${privatekeyEncryptedKey}`));
                let vrs = vrsData(signature);
                let txHash = txHashData(tx, vrs);

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

                fs.writeFile(`${fileDir}/${branchData.name.toLowerCase()}.branch.json`,
                JSON.stringify(branch, undefined, 2), err => {
                    if (err) throw err;
                    console.log(`  ` + chalk.green(`${fileDir}/${branchData.name.toLowerCase()}.branch.json `) + `saved.`)
                })
                info(branch);
                throw Break;
            }
        });
    } catch (e) {
        if (e!== Break) {
            console.log(`  ` + chalk.red(`Invalid transaction data format`))
            throw Break;
        }
    }  
 }

 const txHeader = (timestamp, bodyJson) => {
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

 const info = info => {
    setTimeout(() => {
      console.log()
      console.log(`  ` + `CREATOR - ${chalk.green(info.author)}`)
    }, 100)
    setTimeout(() => {
        console.log(`  ` + `Branch Name - ${chalk.green(info.branch.name)}`)
    }, 150)
    setTimeout(() => {
        console.log(`  ` + `Branch Symbol - ${chalk.green(info.branch.symbol)}`)
    }, 200)
    setTimeout(() => {
        console.log(`  ` + `Branch type - ${chalk.green(info.branch.type)}`)
    }, 250)
    setTimeout(() => {
        console.log(`  ` + `Branch Property- ${chalk.green(info.branch.property)}`)
    }, 300)
    setTimeout(() => {
        console.log(`  ` + `Branch Description- ${chalk.green(info.branch.description)}`)
        console.log(`  ` + "...")
        console.log(`  ` + "...")
    }, 350)
    setTimeout(() => {
        console.log(`  ` + `Branch Version ${chalk.green(info.branch.version)}`)
    }, 400)
    setTimeout(() => {
        console.log()
        console.log(`  ` + `==> Branch ID : ${chalk.yellow(info.branchId)}`)
    }, 450)
 }

 module.exports = {
  plant
}