const chalk = require('chalk')
const { create, getAccounts, getAccount, coinbase, clear } = require('./wallet/account')
const { build } = require('./branch/build')
const { init } = require('./branch/init')
const { seed } = require('./branch/seedFormat')
const { deploy } = require('./branch/deploy')
const { transferFrom, transfer } = require('./tx/sendTransaction')
const { getBalance } = require('./query/getBalance')
const { restart, setConfig } = require('./admin/index')


const account = {
    create: () => {
        const address = create()
        console.log(`  ` + `Address - ${chalk.green(address)}`)
        // const inquirer = require('inquirer')

        // inquirer.prompt([{
        //     name: 'password',
        //     type: 'password',
        //     message: 'Password:'
        //   }]).then((answers) => {
        //         const address = create(answers.password);
        //         console.log(`  ` + `Address - ${chalk.green(address)}`)
        //   })
        
    },
    getAccounts: () => {
        return getAccounts();
    },
    getAccount: index => {
        return getAccount(index);
    },
    coinbase: (owner) => {
        console.log(`  ` + `Coinbase - ${chalk.green(coinbase(owner))}`)
    },
    clear: () => {
        return clear()
    }   
}

const node = {
    restart: (net) => {
        return restart(net)
    },
    setConfig: (port, log, net) => {
        return setConfig(port, log, net)
    }
}

const branch = {
    seed: (name, symbol, property, description, frontier, totalSupply) => {
        return seed(name, symbol, property, description, frontier, totalSupply)
    },
    init: (seed) => {
        init(seed)
    },
    build: (owner) => {
        build(owner)
    },
    deploy: (net) => {
        deploy(net)
    }
}

module.exports = {
    account: account,
    node: node,
    branch,
    transferFrom: (branchId, from, to, amount, net) => {
        return transferFrom(branchId, from, to, amount, net)
    },
    transfer: (branchId, to, amount, net) => {
        return transfer(branchId, to, amount, net)
    },
    getBalance: (branchId, address, net) => {
        return getBalance(branchId, address, net)
    }
}