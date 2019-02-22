const chalk = require('chalk')
const { config } = require('../db')

const branch = config().get('node').value()[0].branch
const contractVersion = "892a821b74c86c6cd6adc6563fd9dbcd4e376419"
const branchVerify = ygg => {
    let status
    return new Promise((resolve, reject) => {
        ygg.client.getBranches().then(all => {
            for (const [key, value] of Object.entries(all)) {
                if (key === branch) {
                    status = true
                }
            }
            resolve(status)
        })
    })
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
    branchVerify(ygg).then(result => {
        if (result) {
            ygg.client.getBalance(branch, contractVersion, address)
            .then(result => {
                console.log(`  ` + `==> Balance : ${chalk.yellow(result)}`)
            })
        }
    })
}

/**
 * It shows the specification of the branch.
 *
 * @method specification
 * @returns {String} 
*/
const specification = ygg => {
    branchVerify(ygg).then(result => {
        if (result) {
            ygg.client.specification(branch, contractVersion)
            .then(result => {

                result.map(result => {
                    console.log(`  ` + `==> ${chalk.yellow(result)}`)
                })
            })
        }
    })
}

/**
 * Show the total supply of the branch.
 *
 * @method totalSupply
 * @returns {String} 
*/
const totalSupply = ygg => {
    branchVerify(ygg).then(result => {
        if (result) {
            ygg.client.totalSupply(branch, contractVersion)
            .then(result => {
                console.log(`  ` + `==> totalSupply : ${chalk.yellow(result)}`)
            })
        }
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
    branchVerify(ygg).then(result => {
        if (result) {
            ygg.client.allowance(branch.trim(), owner, spender)
            .then(result => {
                console.log(`  ` + `==> allowance : ${chalk.yellow(result)}`)
            })
        }
    })
}

 module.exports = {
    getBalance,
    specification,
    totalSupply,
    allowance
}