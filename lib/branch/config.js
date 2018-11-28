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
        // const Ygg = new Yggdrash(new Yggdrash.providers.HttpProvider(net ? `http://${net}` : 'http://localhost:8080'))
        let ygg = new Yggdrash(new Yggdrash.providers.HttpProvider("http://localhost:8080"));
        ygg.client.getBranchId().then(all => {
            console.log()
            console.log(`  ` + `Symbol: Branch ID: ${chalk.green(all)}`)
            console.log()
        })
    }
}

const set = branch => {
    db().defaults({ currentBranch: [] }).write()
    //있으면 셋 없으면 추가 node에 있는 브랜치 검증

    if (db().get('currentBranch').value().length === 0) {
        if (branch.split(',').length === 2) {
            db().get('currentBranch').push({
                id: branch.split(',')[1].split(':')[1],
                symbol: branch.split(',')[0].split(':')[1]
            }).write()
            info(branch.split(',')[0].split(':')[1], branch.split(',')[1].split(':')[1])
        } else {
            // branch id로 node에서 심볼 찾아 push

            // db().get('currentBranch').push({
            //     id: branch,
            //     symbol: branch.split(',')[0].split(':')[1]
            // }).write()
        }
    } else {
        if (branch.split(',').length === 2) {
            db().get("currentBranch").find({id: db().get('currentBranch').value()[0].id})
                            .assign({id: branch.split(',')[1].split(':')[1]}).write()

            db().get("currentBranch").find({symbol: db().get('currentBranch').value()[0].symbol})
                            .assign({symbol: branch.split(',')[0].split(':')[1]}).write()
            info(branch.split(',')[0].split(':')[1], branch.split(',')[1].split(':')[1])
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