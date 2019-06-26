const chalk = require('chalk')
const { db, config } = require('../db')

const branch = db().get('remote').get('branch').value()
const branchId = branch ? Object.keys(branch)[0] : ""

const contracts =  branch => {
    return branch[branchId].contracts.reduce((m, c) => {
        m[c.name] = c.contractVersion;
        return m;
    },{})
}

/**
 * It shows the account balance in detail.
 *
 * @method getBalance
 * @param {String} address
 * @returns {String} 
*/
const getBalance = (address, ygg) => {
    if (!ygg.utils.isAddress(address)) {
        console.log(`\n  ` + chalk.red(`Invalid address\n`))
        return false
    }
    let contractVersion = contracts(branch)["YEED"]
    ygg.client.getBalance(branchId, contractVersion, address)
        .then(result => {
            console.log(`  ` + `==> Balance : ${chalk.yellow(result)}`)
        })

}

/**
 * It shows the specification of the branch.
 *
 * @method specification
 * @returns {String} 
*/
const specification = ygg => {
    // TODO check specification
    ygg.client.specification(branchId, contractVersion)
        .then(result => {

            result.map(result => {
                console.log(`  ` + `==> ${chalk.yellow(result)}`)
            })
        })
}

/**
 * Show the total supply of the branch.
 *
 * @method totalSupply
 * @returns {String} 
*/
const totalSupply = ygg => {
    let contractVersion = contracts(branch)["YEED"]
    ygg.client.totalSupply(branchId, contractVersion)
    .then(result => {
        console.log(`  ` + `==> totalSupply : ${chalk.yellow(result)}`)
    })
}

/**
 * It is possible to see how much the owner gave the quota to a particular address.
 *
 * @method allowance
 * @param {String} owner
 * @param {String} spender
 * @returns {String} 
*/
const allowance = (owner, spender, ygg) => {
    if (!ygg.utils.isAddress(owner) || !ygg.utils.isAddress(spender)) {
        console.log(`\n  ` + chalk.red(`Invalid address\n`))
        return false
    }
    // TODO fix contract Version
    ygg.client.allowance(branchId, owner, spender)
        .then(result => {
            console.log(`  ` + `==> allowance : ${chalk.yellow(result)}`)
        })
}

const feeState = (ygg) => {
    let contractVersion = contracts(branch)["YEED"]
    ygg.client.feeState(branchId, contractVersion)
        .then(result => {
            console.log(`  ` + `==> fee : ${chalk.yellow(result)}`)
        })
}

 module.exports = {
    getBalance,
    specification,
    totalSupply,
    allowance,
    feeState
}