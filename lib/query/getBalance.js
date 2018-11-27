const chalk = require('chalk')
const { db } = require('../db')
const Yggdrash = require("@yggdrash/sdk")

 const getBalance = (address, net) => {
    let branch = db().get('currentBranch').value()[0]
    const ygg = new Yggdrash(new Yggdrash.providers.HttpProvider(net ? `http://${net}` : 'http://localhost:8080'))
    ygg.client.getBalance(branch.id.trim(), address)
    .then(result => {
        console.log(`  ` + `==> Balance : ${chalk.yellow(result)}`)
    })
 }

 module.exports = {
    getBalance
}