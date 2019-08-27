const chalk = require('chalk')
const { db, config } = require('../db')
const { decryption } = require('../crypto')

const branch = db().get('remote').get('branch').value()
const branchId = branch ? Object.keys(branch)[0] : ""

let admin = db().get("accounts").map("address").value()[0]

const contracts =  branch => {
    return branch[branchId].contracts.reduce((m, c) => {
        m[c.name] = c.contractVersion;
        return m;
    },{})
}
const getAllActivePeer = (ygg) => {
    ygg.client.getAllActivePeer().then(r => {
        console.log(r)
    })
}


module.exports = {
    getAllActivePeer
}