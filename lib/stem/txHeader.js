'use strict'

var txHeaderData = (chain, version, type, timestamp, bodyHashHex, bodyLength) => {
    const txHeaderData = {
      "chain":`0x${chain}`,
      "version":`0x${version}`,
      "type":`0x${type}`,
      "timeStamp":`0x${timestamp}`,
      "bodyHashHex":`0x${bodyHashHex}`,
      "bodyLength":`0x${bodyLength}`
    };
    return txHeaderData
 }

module.exports = {
    txHeaderData
}