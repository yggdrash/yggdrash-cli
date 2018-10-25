'use strict'

const { db } = require('../db')
const chalk = require('chalk')
const fs = require("fs")
const path = require("path")
const Yggdrash = require("ygg")

const contractVersion = "0xcc9612ff91ff844938acdb6608e58506a2f21b8a5d77e88726c0897e8d1d02c0"
const reference_address= ""
const nodeWalletAccount = "0xf09e6313f6e5d835bb13d8cbf2e39829083b5d03"
const plant = (author, seedFilePath, net) => {
    const ygg = new Yggdrash(new Yggdrash.providers.HttpProvider(net ? `http://${net}` : 'http://localhost:8080'));
    let timestamp = new Date().getTime()

    const fileDir = path.dirname(seedFilePath)
    let branchData = JSON.parse(fs.readFileSync(seedFilePath, 'utf8'))
    let seed = seedFormat(author, branchData)
    var Break = new Error('Break')

    try {
        db().get("accounts").map("address").value().map(addr => {
            if(addr === author){
                let privatekeyEncryptedKey = db().get("principals").find({address:author}).value().EncryptedKey

                const body = ygg.client.branch(seed);
                let bodyJson = ygg.utils.dataToJson(body);  

                const tx = new ygg.tx(txHeader(ygg, timestamp, bodyJson));
                tx.sign(new Buffer(privatekeyEncryptedKey, 'hex'));
                let serialize = tx.serialize(body);
                
                ygg.client.plant(serialize).then((result) => {
                    branchFile(ygg, branchData, fileDir, body, author, tx, bodyJson, result);
                })
                
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

 const txHeader = (ygg, timestamp, bodyJson) => {
    const rawTx = {
        "chain":`0xfe7b7c93dd23f78e12ad42650595bc0f874c88f7`,
        "version":`0x0000000000000000`,
        "type":`0x0000000000000000`,
        "timeStamp":`0x${ygg.utils.decimalToHex(timestamp)}`,
        "bodyHash":`0x${ygg.utils.bodyHashHex(bodyJson)}`,
        "bodyLength":`0x${ygg.utils.decimalToHex(bodyJson.length)}`
      };
    return rawTx;
 }

 const seedFormat = (author, branchData) => {
    const seed = {
        "name": branchData.name,
        "symbol":branchData.symbol,
        "property":branchData.property,
        "type":branchData.type,
        "description":branchData.description,
        "tag":branchData.tag,
        "version":contractVersion,
        "reference_address":reference_address,
        "reserve_address": nodeWalletAccount,
        "owner":author,
        "version_history":[contractVersion]
    }
    return seed
 }

 const branchFile = (ygg, branchData, fileDir, body, author, tx, bodyJson, result) => {
    let branch = {
        "branchId":body.params[0].branchId,
        "branch":body.params[0].branch,
        "author":author,
        "transactionHash":tx.getTxHash(),
        "chain":"fe7b7c93dd23f78e12ad42650595bc0f874c88f7",
        "blockType":"0000000000000000",
        "blockVersion": "0000000000000000",
        "blockBodyHash": ygg.utils.bodyHashHex(bodyJson),
        "signature":tx.vrs(),
    }

    fs.writeFile(`${fileDir}/${branchData.symbol.toLowerCase()}.branch.json`,
    JSON.stringify(branch, undefined, 2), err => {
        if (err) throw err;
        console.log(`  ` + chalk.green(`${fileDir}/${branchData.name.toLowerCase()}.branch.json `) + `saved.`)
    })
    info(branch, result);
 }

 const info = (info, result) => {
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
    setTimeout(() => {
        console.log(`  ` + `==> Transaction Hash : ${chalk.yellow(result)}`)
    }, 450)
 }

 module.exports = {
  plant
}