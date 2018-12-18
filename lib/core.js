const { create, 
        importAccount, 
        exportAccount, 
        getAccounts, 
        getAccount, 
        getAdmin,
        setAdmin,
        adminVerify, 
        clear } = require('./wallet/account')
const { build } = require('./branch/build')
const { init } = require('./branch/init')
const { seed } = require('./branch/seedFormat')
const { deploy } = require('./branch/deploy')
const { get, set, status } = require('./branch/config')
const { transferFrom, transfer, approve } = require('./rawTx/sendTransaction')
const { sendTransaction } = require('./tx/sendTransaction')
const { getBalance, specification, totalSupply, allowance } = require('./query/index')
const { nodeBuild, start, restart, nodeStatus, stop, setConfig } = require('./node/index')


const account = {
    create: password => create(password),
    importAccount: (pk, pass) => importAccount(pk, pass),
    exportAccount: (addr, pass, type) => exportAccount(addr, pass, type),
    getAccounts: () => getAccounts(),
    getAccount: index => getAccount(index),
    getAdmin: () => getAdmin(),
    setAdmin: owner => setAdmin(owner),
    adminVerify: (addr, password) => adminVerify(addr, password),
    clear: () => clear()   
}

const node = {
    build: node => nodeBuild(node),
    start: (password, node) => start(password, node),
    restart: (node, password) => restart(node, password),
    status: () => nodeStatus(),
    stop: () => stop(),
    setConfig: (port, log, net) => setConfig(port, log, net)
}

const branch = {
    seed: (name, symbol, property, description, frontier, totalSupply) => 
            seed(name, symbol, property, description, frontier, totalSupply),
    init: seed => init(seed),
    build: (owner, password) => build(owner, password),
    deploy: net => deploy(net),
    getBranch: select => get(select),
    setBranch: branch => set(branch),
    status: () => status()
}

const query = {
    getBalance: (address, ygg) => getBalance(address, ygg),
    specification: ygg => specification(ygg),
    totalSupply: ygg => totalSupply(ygg),
    allowance: (owner, spender, ygg) => allowance(owner, spender, ygg)
}

const rawTx = {
    transferFrom: (from, to, amount, password, ygg) => transferFrom(from, to, amount, password, ygg),
    transfer: (to, amount, password, ygg) => transfer(to, amount, password, ygg),
    approve: (spender, amount, password, ygg) => approve(spender, amount, password, ygg)
}

const tx = {
    sendTransaction: (methodName, fromAddress, address, value) => sendTransaction(methodName, fromAddress, address, value)
}

module.exports = {
    account: account,
    node: node,
    branch,
    query,
    rawTx,
    tx
}
