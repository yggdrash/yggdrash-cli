'use strict'

const { sha3 } = require('../../utils');

const branchId = (name, 
                    property, 
                    type, 
                    timestamp, 
                    version, 
                    reference_address, 
                    reserve_address) => {

    let nameBuf = Buffer.from(name);
    let propertyBuf = Buffer.from(property);
    let typeBuf = Buffer.from(type);
    let timestampBuf = Buffer.from(timestamp.toString());
    let versionBuf = Buffer.from(version);
    let referenceAddressBuf = Buffer.from(reference_address);
    let reserveAddressBuf = Buffer.from(reserve_address);

    let branchIdHex = nameBuf.toString() + propertyBuf.toString() + typeBuf.toString() + timestampBuf.toString() 
                        + versionBuf.toString() + referenceAddressBuf.toString() + reserveAddressBuf.toString();
                        
    let branchIdByte = Buffer.from(branchIdHex)
    let branchId = sha3(branchIdByte);
    return branchId.toString("hex").substring(24,64);
}

module.exports = {
    branchId
}