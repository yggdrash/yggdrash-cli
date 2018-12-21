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
const { list, setBranch, status } = require('./branch/config')
const { transferFrom, transfer, approve } = require('./rawTx/sendTransaction')
const { sendTransaction } = require('./tx/sendTransaction')
const { getBalance, specification, totalSupply, allowance } = require('./query')
const { nodeBuild, start, restart, nodeStatus, stop, setConfig } = require('./node')
const { Ygg } = require("@yggdrash/sdk")
const { config } = require('./db')

let host = config().get("node").value()[0].host
let port = config().get("node").value()[0].port

let ygg = new Ygg(new Ygg.providers.HttpProvider(`http://${host}:${port}`))

const account = {
    create: password => create(password, ygg),
    importAccount: (pk, pass) => importAccount(pk, pass, ygg),
    exportAccount,
    getAccounts,
    getAccount,
    getAdmin,
    setAdmin: owner => setAdmin(owner, ygg),
    adminVerify: (addr, password) => adminVerify(addr, password, ygg),
    clear
}

const node = {
    build: node => nodeBuild(node),
    start: (pass, path) => start(pass, path, ygg),
    restart,
    status: () => nodeStatus(),
    stop,
    setConfig
}

const branch = {
    seed,
    init,
    build: (owner, password) => build(owner, password, ygg),
    deploy: () => deploy(ygg),
    list: (action) => list(action, ygg),
    setBranch,
    status
}

const query = {
    getBalance: (address) => getBalance(address, ygg),
    specification: () => specification(ygg),
    totalSupply: () => totalSupply(ygg),
    allowance: (owner, spender) => allowance(owner, spender, ygg)
}

const rawTx = {
    transferFrom: (from, to, amount, password) => transferFrom(from, to, amount, password, ygg),
    transfer: (to, amount, password) => transfer(to, amount, password, ygg),
    approve: (spender, amount, password) => approve(spender, amount, password, ygg)
}

const tx = {
    sendTransaction
}

module.exports = {
    account: account,
    node: node,
    branch,
    query,
    rawTx,
    tx
}
