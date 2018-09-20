'use strict'

const chalk = require('chalk')
const jayson = require('jayson')
const fs = require('fs')
const { dataToJson } = require('../../utils');

const register = (branchFilePath, net)=> {
    let branchData = JSON.parse(fs.readFileSync(branchFilePath, 'utf8'));
    let params = paramsData(branchData);
    
    if (net == null) {
        let local = "localhost:8080"
        api(local).then(client => {
            client.request('sendTransaction', {tx: params}, (err, res) => {
                if(err) throw err
                return console.log(`  ` + `==> TX ID : ${chalk.yellow(res.result)}`)
            });
        });
    } else {
        api(net).then(client => {
            client.request('sendTransaction', {tx: params}, (err, res) => {
                if(err) throw err
                return console.log(`  ` + `==> TX ID : ${chalk.yellow(res.result)}`)
            });
        });
    }
 }

 const api = net => {
    return new Promise(resolve => {
        let client  = jayson.client.http(`http://${net}/api/transaction`)    
        resolve(client)
    });
 }

 const paramsData = branchData => {
    let body = bodyData(branchData);
    let bodyJson = "["+dataToJson(body)+"]";   

    if (!branchData) {
        return console.log("Invalid json file")
     } else if (!branchData.branch.timestamp
                || !bodyJson.length
                || !bodyJson
                || !branchData.author
                || !branchData.transactionHash
                || !branchData.blockType
                || !branchData.blockVersion
                || !branchData.blockBodyHash
                || !branchData.signature
            ) {
        return console.log("Invalid json file")
     } else {
        const txData = {
            "timestamp":branchData.branch.timestamp,
            "bodyLength":bodyJson.length,
            "body":bodyJson,
            "author":branchData.author.substring(2),
            "hash":branchData.transactionHash,
            "chain":"fe7b7c93dd23f78e12ad42650595bc0f874c88f7",
            "type":branchData.blockType,
            "version":branchData.blockVersion,
            "bodyHash":branchData.blockBodyHash,
            "signature":branchData.signature,
          }
        return txData;
     }
 }

const bodyData = (branchData) => {
    if (!branchData) {
        return console.log("Invalid json file")
     } else if (!branchData.branchId) {
        return console.log("Invalid json file")
     } else {
        const body = {
            "method":"create",
            "params":[
                { 
                    "branchId":branchData.branchId,
                    "branch": {
                        "name": branchData.branch.name,
                        "symbol":branchData.branch.symbol,
                        "property":branchData.branch.property,
                        "type":branchData.branch.type,
                        "description":branchData.branch.description,
                        "tag":branchData.branch.tag,
                        "version":branchData.branch.version,
                        "reference_address":branchData.branch.reference_address,
                        "reserve_address":branchData.branch.reserve_address,
                        "owner":branchData.branch.owner,
                        "timestamp":branchData.branch.timestamp,
                        "version_history":[branchData.branch.version]
                    }
                }
            ]
        }
        return body;
     }
}

 module.exports = {
    register
}