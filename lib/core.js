const chalk = require('chalk')
const { create, importAccount, exportAccount, getAccounts, getAccount, adminAccount, adminVerify, clear } = require('./wallet/account')
const { build } = require('./branch/build')
const { init } = require('./branch/init')
const { seed } = require('./branch/seedFormat')
const { deploy } = require('./branch/deploy')
const { get, set, status } = require('./branch/config')
const { transferFrom, transfer } = require('./tx/sendTransaction')
const { getBalance } = require('./query/getBalance')
const { nodeBuild, start, restart, nodeStatus, stop, setConfig } = require('./node/index')


const account = {
    create: password => console.log(`  ` + `Address - ${chalk.green(create(password))}`),
    importAccount: (pk, pass) => console.log(`  ` + `Address - ${chalk.green(importAccount(pk, pass))}`),
    exportAccount: (addr, pass, type) => exportAccount(addr, pass, type),
    getAccounts: () => getAccounts(),
    getAccount: index => getAccount(index),
    adminAccount: owner => console.log(`  ` + `Admin - ${chalk.green(adminAccount(owner))}`),
    adminVerify: (admin, password) => adminVerify(admin, password),
    clear: () => clear()   
}

const node = {
    build: node => nodeBuild(node),
    start: (node, password) => start(node, password),
    restart: (node, password) => restart(node, password),
    status: () => nodeStatus(),
    stop: () => stop(),
    setConfig: (port, log, net) => setConfig(port, log, net)
}

const branch = {
    seed: (name, symbol, property, description, frontier, totalSupply) => seed(name, symbol, property, description, frontier, totalSupply),
    init: (seed) => init(seed),
    build: (owner, password) => build(owner, password),
    deploy: (net) => deploy(net),
    getBranch: select => get(select),
    setBranch: branch => set(branch),
    status: () => status()
}

module.exports = {
    account: account,
    node: node,
    branch,
    transferFrom: (from, to, amount, password, net) => transferFrom(from, to, amount, password, net),
    transfer: (to, amount, password, net) => transfer(to, amount, password, net),
    getBalance: (address, net) => getBalance(address, net)
}
