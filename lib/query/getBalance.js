'use strict'

const chalk = require('chalk')
const Yggdrash = require("@yggdrash/sdk")

 const getBalance = (branchId, address, net) => {
    const ygg = new Yggdrash(new Yggdrash.providers.HttpProvider(net ? `http://${net}` : 'http://localhost:8080'))
    let val = ygg.client.getBalance(branchId, address);
    console.log(`  ` + `==> Balance : ${chalk.yellow(val)}`)
    
 }

 module.exports = {
    getBalance
}