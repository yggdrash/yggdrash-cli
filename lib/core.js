const chalk = require('chalk')
const { create, importAccount, getAccounts, getAccount, adminAccount, adminVerify, clear } = require('./wallet/account')
const { build } = require('./branch/build')
const { init } = require('./branch/init')
const { seed } = require('./branch/seedFormat')
const { deploy } = require('./branch/deploy')
const { get, set, status } = require('./branch/config')
const { transferFrom, transfer } = require('./tx/sendTransaction')
const { getBalance } = require('./query/getBalance')
const { nodeBuild, start, restart, nodeStatus, stop, setConfig } = require('./node/index')


const account = {
    create: () => {
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
    importAccount: (pk, pass) => {
        return importAccount(pk, pass)
    },
    getAccounts: () => {
        return getAccounts()
    },
    getAccount: index => {
        return getAccount(index)
    },
    adminAccount: (owner) => {
        return console.log(`  ` + `Admin - ${chalk.green(adminAccount(owner))}`)
    },
    adminVerify: (admin, password) => {
        return adminVerify(admin, password)
    },
    clear: () => {
        return clear()
    }   
}

const node = {
    build: (node) => {
        return nodeBuild(node)
    },
    start: (node, password) => {
        return start(node, password)
    },
    restart: (node, password) => {
        return restart(node, password)
    },
    status: () => {
        return nodeStatus()
    },
    stop: () => {
        return stop()
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
