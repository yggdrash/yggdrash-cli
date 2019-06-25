const chalk = require('chalk')
const { db, config } = require('../db')

const branch = db().get('remote').get('branch').value()

const branchId = Object.keys(branch)[0]

const yeedContract =  branch => {
    let contractVersion = undefined
    let contacts = branch[branchId].contracts
    for (var i in contacts) {
        if (contacts[i].name == "YEED") {
            contractVersion = contacts[i].contractVersion;
            break;
        }
    }
    return contractVersion;
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
    let contractVersion = yeedContract(branch)
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
    branchVerify(ygg).then(result => {
        if (result) {
            ygg.client.specification(branchId, contractVersion)
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
    contractVersion = yeedContract(branch)
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
    branchVerify(ygg).then(result => {
        if (result) {
            ygg.client.allowance(branchId, owner, spender)
            .then(result => {
                console.log(`  ` + `==> allowance : ${chalk.yellow(result)}`)
            })
        }
    })
}

const feeState = (ygg) => {
    // branch b198173cb2a8ce1260669dc892d3a0ddaf8bdb3e
    const contractVersion = "system-stem-contract-1.0.0.jar"
    branchVerify(ygg).then(result => {
        if (result) {
            ygg.client.feeState(branchId, contractVersion)
            .then(result => {
                console.log(`  ` + `==> fee : ${chalk.yellow(result)}`)
            })
        }
    })
}

 module.exports = {
    getBalance,
    specification,
    totalSupply,
    allowance,
    feeState
}