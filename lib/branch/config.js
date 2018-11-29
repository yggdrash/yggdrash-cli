const { db } = require('../db')
const chalk = require('chalk')
const Yggdrash = require("@yggdrash/sdk")

const get = select => {
    if (select === 'Local') {
        let id = db().get('branches').map('id').value()
        let symbol = db().get('branches').map('symbol').value()
        for (let i in id)  {
            console.log()
            console.log(`  ` + `Symbol: ${chalk.green(symbol[i])}, Branch ID: ${chalk.green(id[i])}`)
            console.log()
        }   
    } else {
        let ygg = new Yggdrash(new Yggdrash.providers.HttpProvider("http://localhost:8080"))
        ygg.client.getBranchId().then(all => {
            //TODO: symbol
            console.log()
            console.log(`  ` + `Branch ID: ${chalk.green(all)}`)
            console.log()
        })
    }
}

const set = branch => {
    if (db().get("currentBranch").value()[0].id === branch ||
         db().get("currentBranch").value()[0].id === branch.split(',')[1].split(':')[1]) {
        console.log()
        console.log(`  ` + `${chalk.red('This is an existing branch id.')}`)
        console.log()
        return false
    }

    db().defaults({ currentBranch: [] }).write()

    if (db().get('currentBranch').value().length === 0) {
        if (branch.split(',').length === 2) {
            db().get('currentBranch').push({
                id: branch.split(',')[1].split(':')[1],
                symbol: branch.split(',')[0].split(':')[1]
            }).write()
            info(branch.split(',')[0].split(':')[1], branch.split(',')[1].split(':')[1])
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
                            .assign({id: branch.split(',')[1].split(':')[1]}).write()

            db().get("currentBranch").find({symbol: db().get('currentBranch').value()[0].symbol})
                            .assign({symbol: branch.split(',')[0].split(':')[1]}).write()
            info(branch.split(',')[0].split(':')[1], branch.split(',')[1].split(':')[1])
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

const status = () => {
    let branch = db().get('currentBranch').value()
    console.log()
    console.log(`  ` + `On branch ${chalk.green(branch[0].symbol)}, Branch ID: ${chalk.green(branch[0].id)}`)
    console.log(`  ` + `Your branch is up to date with '${branch[0].symbol}'.`)
    console.log()
}

const info = (symbol, id) => {
    console.log()
    console.log(`  ` + `On branch ${chalk.green(symbol)}`)
    console.log(`  ` + `Branch ID: ${chalk.green(id)}`)
    console.log()
}

 module.exports = {
    get,
    set,
    status
}