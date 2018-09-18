'use strict'

const jayson = require('jayson')
const { dataToJson } = require('../../utils');

const register = branch => {
    let branchData = require( `../../branch/${branch}` );
    let params = paramsData(branchData);
    api().then(client => {
        client.request('sendTransaction', {tx: params}, (err, res) => {
            if(err) throw err
            return console.log(res)
        });
    });
 }

 const api = () => {
    return new Promise(resolve => {
        let client  = jayson.client.http(`http://localhost:8080/api/transaction`)    
        resolve(client)
    });
 }

 const paramsData = branchData => {
    let body = bodyData(branchData);
    let bodyJson = "["+dataToJson(body)+"]";   

    let txData = {
        "timestamp":branchData.branch.timestamp,
        "bodyLength":bodyJson.length,
        "body":bodyJson,
        "author":branchData.author,
        "hash":branchData.hash,
        "chain":"fe7b7c93dd23f78e12ad42650595bc0f874c88f7",
        "type":branchData.type,
        "version":branchData.version,
        "bodyHash":branchData.bodyHash,
        "signature":branchData.signature,
      }
    return txData;
 }

const bodyData = (branchData) => {
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

 module.exports = {
    register
}