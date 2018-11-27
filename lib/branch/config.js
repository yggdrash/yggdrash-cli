const { db } = require('../db')
const chalk = require('chalk')
const Yggdrash = require("@yggdrash/sdk")
const exec = require('child_process').exec
const Buffer = require('safe-buffer').Buffer
db().defaults({ currentBranch: [] }).write()

const get = () => {
    console.log(db().get("branches").value())
}

const set = branch => {
    //있으면 셋 없으면 추가
    db().get('currentBranch').push({
        id: branchId,
        symbol: symbol
    }).write()
}

 module.exports = {
    get,
    set
}