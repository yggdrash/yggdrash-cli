const chalk = require('chalk')
const Yggdrash = require("@yggdrash/sdk")

 const getBalance = (address, net) => {
    let branch = db().get('currentBranch').value()[0].id
    const ygg = new Yggdrash(new Yggdrash.providers.HttpProvider(net ? `http://${net}` : 'http://localhost:8080'))
    let val = ygg.client.getBalance(branch, address);
    console.log(`  ` + `==> Balance : ${chalk.yellow(val)}`)
    
 }

 module.exports = {
    getBalance
}