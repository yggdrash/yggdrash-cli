'use strict'

const { branchId } = require('./txBranchId')
const { dataToJson } = require('../../utils');

const { name,
        symbol,
        property,
        type,
        description,
        tag,
        version,
        reference_address,
        reserve_address, } = require('../../seed/GenesisStemData')

const bodyData = (getTimestamp, author) => {
    const body = {
        "method":"create",
        "params":[
            { 
            "branchId":branchId(getTimestamp), 
            "branch": {
                    "name": name,
                    "symbol":symbol,
                    "property":property,
                    "type":type,
                    "description":description,
                    "tag":tag,
                    "version":version,
                    "reference_address":reference_address,
                    "reserve_address":reserve_address,
                    "owner":author,
                    "timestamp":getTimestamp,
                    "version_history":["0xeeabcaf6cf907e0fd27a0d1f305313e9c1069c5d7f8729d227110012c9b37025"]
                }
            }
        ]
    }
    let bodyJson = dataToJson(body);
    return bodyJson;
}

module.exports = {
    bodyData
}