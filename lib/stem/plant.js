'use strict'

const chalk = require('chalk')
const fs = require("fs")
const path = require("path")
const Yggdrash = require("ygg")
const ygg = new Yggdrash(new Yggdrash.providers.HttpProvider('http://localhost:8080'));

const contractVersion = "0xcc9612ff91ff844938acdb6608e58506a2f21b8a5d77e88726c0897e8d1d02c0"
const reference_address= ""
const reserve_address = "0xcee3d4755e47055b530deeba062c5bd0c17eb00f"
const plant = (author, seedFilePath) => {
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
                
                const seed = {
                    "name": branchData.name,
                    "symbol":branchData.symbol,
                    "property":branchData.property,
                    "type":branchData.type,
                    "description":branchData.description,
                    "tag":branchData.tag,
                    "version":contractVersion,
                    "reference_address":reference_address,
                    "reserve_address":reserve_address,
                    "owner":author,
                    "version_history":[contractVersion]
                }

                const body = ygg.client.branch(seed);
                let bodyJson = ygg.utils.dataToJson(body);  

                const tx = new ygg.tx(txHeader(body.params[0].branch.timestamp, bodyJson));
                tx.sign(new Buffer(privatekeyEncryptedKey, 'hex'));

                let serialize = tx.serialize(body);
                ygg.client.register(serialize);

                branchFile(branchData, fileDir, body, author, tx, bodyJson);
                
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
        "chain":`0xfe7b7c93dd23f78e12ad42650595bc0f874c88f7`,
        "version":`0x0000000000000000`,
        "type":`0x0000000000000000`,
        "timeStamp":`0x${ygg.utils.decimalToHex(timestamp)}`,
        "bodyHash":`0x${ygg.utils.bodyHashHex(bodyJson)}`,
        "bodyLength":`0x${ygg.utils.decimalToHex(bodyJson.length)}`
      };
    return txHeaderData;
 }

 const branchFile = (branchData, fileDir, body, author, tx, bodyJson) => {
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
    info(branch);
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