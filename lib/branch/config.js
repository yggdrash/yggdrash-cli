const { db } = require('../db')
const chalk = require('chalk')
const Yggdrash = require("@yggdrash/sdk")

const get = () => {
    let id = db().get('branches').map('id').value()
    let symbol = db().get('branches').map('symbol').value()
    for (let i in id)  {
        console.log(`  ` + `Symbol: ${chalk.green(symbol[i])}, Branch ID: ${chalk.green(id[i])}`)
    }   
}

const set = branch => {
    db().defaults({ currentBranch: [] }).write()
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