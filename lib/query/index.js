const chalk = require('chalk')
const { db } = require('../db')

const branch = db().get('currentBranch').value()[0]
// const branch = {
//     id: '118eaa393958caf8e8c103fa9d78b5d2ded53109'
// }
/**
 * It shows the account balance in detail.
 *
 * @method getBalance
 * @param {String} address
 * @returns {String} 
*/
const getBalance = (address, ygg) => {
    ygg.client.getBalance(branch.id.trim(), address)
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
    ygg.client.specification(branch.id.trim())
    .then(result => {
        console.log(`  ` + `==> specification : ${chalk.yellow(result)}`)
    })
}

/**
 * Shhow the total supply of the branch.
 *
 * @method totalSupply
 * @returns {String} 
*/
const totalSupply = ygg => {
    ygg.client.totalSupply(branch.id.trim())
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
    ygg.client.allowance(branch.id.trim(), owner, spender)
    .then(result => {
        console.log(`  ` + `==> allowance : ${chalk.yellow(result)}`)
    })
}

 module.exports = {
    getBalance,
    specification,
    totalSupply,
    allowance
}