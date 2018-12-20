const chalk = require('chalk')
const { config } = require('../db')

const branch = config().get('node').value()[0].defaults.branch

/**
 * It shows the account balance in detail.
 *
 * @method getBalance
 * @param {String} address
 * @returns {String} 
*/
const getBalance = (address, ygg) => {
    ygg.client.getBalance(branch, address)
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
    ygg.client.specification(branch)
    .then(result => {
        console.log(`  ` + `==> specification : ${chalk.yellow(result)}`)
    })
}

/**
 * Show the total supply of the branch.
 *
 * @method totalSupply
 * @returns {String} 
*/
const totalSupply = ygg => {
    ygg.client.totalSupply(branch)
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
    ygg.client.allowance(branch, owner, spender)
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