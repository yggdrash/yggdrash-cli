const { db, config } = require('../db')
const chalk = require('chalk')
const inquirer = require('inquirer')

/**
 * You can query the branch you created and all the branches.
 *
 * @method list
 * @param {String} select 
*/
const list = (action, ygg) => {
    let branchId = []
    let symbol = []
    ygg.client.getBranches().then(all => {
        for (const [key, value] of Object.entries(all)) {
            action === 'list' ? console.log(`  ` + `Symbol: ${chalk.green(value.symbol)}, Branch ID: ${chalk.green(key)}`) : null
            branchId.push(key)
            symbol.push(value.symbol)
        }
        if (action === 'list') return
        if (action === 'set') {
            setBranch(branchId, symbol)
        }
    })
}

/**
 * Select all the branches you have created or registered on the node
 *
 * @method setBranch
 * @param {String} branch 
*/
const setBranch = (allBranchId, allSymbol) => {
    let list = []
    for (let i in allBranchId)  {
        list[i] = `Symbol: ${allSymbol[i]}, ID: ${allBranchId[i]}`
    }

    inquirer.prompt([{
        name: 'branch',
        type: 'list',
        message: 'branch',
        choices: list,
        default: 0
        }]).then((answers) => {
            let id = answers.branch.split(',')[1].split(':')[1]
            let symbol = answers.branch.split(',')[0].split(':')[1]
            if (db().get("currentBranch").find({id: `${answers.branch}`}).value()) {
                console.log(`\n  ` + `${chalk.red('This is an existing branch id.')}\n`)
                return false
            }
            
            db().defaults({ currentBranch: [] }).write()

            if (db().get('currentBranch').value().length === 0) {
                db().get('currentBranch').push({
                    id: id
                }).write()
                config().get('node').push({
                    branch: id
                }).write()
                info(symbol, id)
            } else {
                db().get("currentBranch").find({id: db().get('currentBranch').value()[0].id})
                                .assign({id: id}).write()
                config().get("node").find({branch: config().get('node').value()[0].branch})
                                .assign({branch: id}).write()
                info(symbol, id)
            }
        })
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
    list,
    setBranch,
    status
}
