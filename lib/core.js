const chalk = require('chalk')
const { create, getAccounts, getAccount, adminAccount, clear, importAccount } = require('./wallet/account')
const { build } = require('./branch/build')
const { init } = require('./branch/init')
const { seed } = require('./branch/seedFormat')
const { deploy } = require('./branch/deploy')
const { get, set, status } = require('./branch/config')
const { transferFrom, transfer } = require('./tx/sendTransaction')
const { getBalance } = require('./query/getBalance')
const { restart, setConfig } = require('./admin/index')


const account = {
    create: () => {
        // const address = create()
        // console.log(`  ` + `Address - ${chalk.green(address)}`)
        const inquirer = require('inquirer')

        inquirer.prompt([{
            name: 'password',
            type: 'password',
            message: 'Password:'
          }]).then((answers) => {
                const address = create(answers.password);
                console.log(`  ` + `Address - ${chalk.green(address)}`)
          })
        
    },
    getAccounts: () => {
        return getAccounts()
    },
    getAccount: index => {
        return getAccount(index)
    },
    importAccount: (pk, pass) => {
        return importAccount(pk, pass)
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
    build: (owner, password) => {
        build(owner, password)
    },
    deploy: (net) => {
        deploy(net)
    },
    getBranch: select => {
        get(select)
    },
    setBranch: branch => {
        set(branch)
    },
    status: () => {
        status()
    }
}

module.exports = {
    account: account,
    node: node,
    branch,
    transferFrom: (from, to, amount, password, net) => {
        return transferFrom(from, to, amount, password, net)
    },
    transfer: (to, amount, password, net) => {
        return transfer(to, amount, password, net)
    },
    getBalance: (address, net) => {
        return getBalance(address, net)
    }
}