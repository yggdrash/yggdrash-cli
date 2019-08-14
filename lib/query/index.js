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


const query = async (contractName, method, params, ygg) => {
    if (contractName) {
        contractName = "YEED"
    }
    let contractVersion = contracts(branch)[contractName];
    if (contractVersion) {
        let body = {
            branchId,
            contractVersion: contractVersion,
            method,
            params
        }
        let result = await ygg.client.query(body)
        console.log(`  ==> ${method}`  +  ` : ${chalk.yellow(result)}`)
    } else {
        console.log("contract is not exist")
    }
}

/**
 * It shows the account balance in detail.
 *
 * @method getBalance
 * @param {String} address
 * @returns {String}
 */
// const getBalance = (address, ygg) => {
//     if (!ygg.utils.isAddress(address)) {
//         console.log(`\n  ` + chalk.red(`Invalid address\n`))
//         return false
//     }
//     let contractVersion = contracts(branch)["YEED"]
//     ygg.client.getBalance(branchId, contractVersion, address)
//         .then(result => {
//             console.log(`  ` + `==> Balance : ${chalk.yellow(result)}`)
//         })
// }


/**
 * @method curIndex
 * @returns {String}
 */
const curIndex = ygg => {
    ygg.client.curIndex(branchId)
        .then(result => {
            console.log(`  ` + `==> curIndex : ${chalk.yellow(result)}`)
        })
}


/**
 * @method blockNumber
 * @returns {String}
 */
const blockNumber = ygg => {
    ygg.client.blockNumber(branchId)
        .then(result => {
            console.log(`  ` + `==> blockNumber : ${chalk.yellow(result)}`)
        })
}

/**
 * @method newPendingTransactionFilter
 * @returns {String}
 */
const newPendingTransactionFilter = ygg => {
    ygg.client.newPendingTransactionFilter(branchId)
        .then(result => {
            console.log(`  ` + `==> newPendingTransactionFilter : ${chalk.yellow(result)}`)
        })
}


/**
 * @method getPendingTransactionList
 * @returns {String}
 */
const getPendingTransactionList = ygg => {
    ygg.client.getPendingTransactionList(branchId)
        .then(result => {
            console.log(`  ` + `==> getPendingTransactionList : ${chalk.yellow(result)}`)
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

const proposeSatatus = (ygg, proposeId) => {
    let contractVersion = contracts(branch)["YEED"]
    ygg.client.queryPropose(branchId, contractVersion, proposeId)
        .then(result => {
            console.log(`  ` + `==> status : ${chalk.yellow(JSON.stringify(result))}`)
        })
}


const transactionConfirmStatus = (ygg, txConfirmId) => {
    let contractVersion = contracts(branch)["YEED"]
    ygg.client.queryTransactionConfirm(branchId, contractVersion, txConfirmId)
        .then(result => {
            console.log(`  ` + `==> status : ${chalk.yellow(JSON.stringify(result))}`)

            
        })
}



 module.exports = {
    // getBalance,
    // specification,
    // totalSupply,
    // allowance,
    // feeState,
    // proposeSatatus,
    // transactionConfirmStatus,
    //  getPendingTransactionList,
    //  newPendingTransactionFilter,
    //  blockNumber,
    //  curIndex
     query
}