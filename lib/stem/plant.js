'use strict'

const chalk = require('chalk')
const { dataToJson, sha3, toBuffer, decimalToHex, hexString } = require('../../utils')
const { bodyData } = require('./txBody')
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
                let body= bodyData(author.substring(2),
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
                const vrs = tx.vrs(signature);

                let branch = {
                    "branchId":body.params[0].branchId,
                    "branch":body.params[0].branch,
                    "author":author,
                    "transactionHash":tx.getTxHash(signature),
                    "chain":"fe7b7c93dd23f78e12ad42650595bc0f874c88f7",
                    "blockType":type,
                    "blockVersion": version,
                    "blockBodyHash":sha3(Buffer.from(bodyJson)).toString("hex"),
                    "signature":vrs,
                }

                fs.writeFile(`${fileDir}/${branchData.symbol.toLowerCase()}.branch.json`,
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
            console.log()
            console.log(`  ` + chalk.red(`Invalid transaction data format`))
            console.log()
            throw Break;
        }
    }  
 }

 const txHeader = (timestamp, bodyJson) => {
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