const { db } = require('../db')
const chalk = require('chalk')
const { Ygg } = require("@yggdrash/sdk")

/**
 * You can query the branch you created and all the branches.
 *
 * @method get
 * @param {String} select 
*/
const getBranch = select => {
    if (select === 'Local') {
        let id = db().get('branches').map('id').value()
        let symbol = db().get('branches').map('symbol').value()
        for (let i in id)  {
            console.log(`\n  ` + `Symbol: ${chalk.green(symbol[i])}, Branch ID: ${chalk.green(id[i])}\n`)
        }   
    } else {
        let ygg = new Ygg(new Ygg.providers.HttpProvider("http://localhost:8080"))
        ygg.client.getBranchId().then(all => {
            //TODO: symbol
            console.log(`\n  ` + `Branch ID: ${chalk.green(all)}\n`)
        })
    }
}

/**
 * Select all the branches you have created or registered on the node
 *
 * @method set
 * @param {String} branch 
*/
const setBranch = branch => {
    let id = branch.split(',')[1].split(':')[1]
    let symbol = branch.split(',')[0].split(':')[1]

    if (db().get("currentBranch").find({id: `${id}`}).value() ||
        db().get("currentBranch").find({id: `${branch}`}).value()) {
        console.log(`\n  ` + `${chalk.red('This is an existing branch id.')}\n`)
        return false
    }

    db().defaults({ currentBranch: [] }).write()

    if (db().get('currentBranch').value().length === 0) {
        if (branch.split(',').length === 2) {
            db().get('currentBranch').push({
                id: id,
                symbol: symbol
            }).write()
            info(symbol, id)
        } else {
            //node TODO: symbol
            db().get('currentBranch').push({
                id: branch,
                symbol: ''
            }).write()
            info('', branch)
        }
    } else {
        if (branch.split(',').length === 2) {
            db().get("currentBranch").find({id: db().get('currentBranch').value()[0].id})
                            .assign({id: id}).write()

            db().get("currentBranch").find({symbol: db().get('currentBranch').value()[0].symbol})
                            .assign({symbol: symbol}).write()
            info(symbol, id)
        } else {
            //node TODO: symbol
            db().get("currentBranch").find({id: db().get('currentBranch').value()[0].id})
                            .assign({id: branch}).write()
            db().get("currentBranch").find({symbol: db().get('currentBranch').value()[0].symbol})
                            .assign({symbol: ''}).write()
            info('', branch)
        }
    }
}

/**
 * View currently set branch
 *
 * @method status
*/
const status = () => {
    let branch = db().get('currentBranch').value()
    console.log(`\n  ` + `On branch ${chalk.green(branch[0].symbol)}, Branch ID: ${chalk.green(branch[0].id)}`)
    console.log(`  ` + `Your branch is up to date with '${branch[0].symbol}'.\n`)
}

const info = (symbol, id) => {
    console.log(`\n  ` + `On branch ${chalk.green(symbol)}`)
    console.log(`  ` + `Branch ID: ${chalk.green(id)}\n`)
}

 module.exports = {
    getBranch,
    setBranch,
    status
}
