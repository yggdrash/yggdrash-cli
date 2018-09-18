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
                    "version_history":["0xcc9612ff91ff844938acdb6608e58506a2f21b8a5d77e88726c0897e8d1d02c0"]
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