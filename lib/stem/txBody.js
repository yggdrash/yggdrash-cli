'use strict'

const { branchId } = require('./txBranchId')

const bodyData = (author, 
                    name, 
                    symbol, 
                    property, 
                    type, 
                    description, 
                    tag, 
                    version, 
                    reference_address, 
                    reserve_address, 
                    timestamp) => {
                        
    const body = {
        "method":"create",
        "params":[
            { 
            "branchId":branchId(name, property, type, timestamp, version, reference_address, reserve_address), 
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
                    "timestamp":timestamp,
                    "version_history":[version]
                }
            }
        ]
    }
    return body;
}

module.exports = {
    bodyData
}