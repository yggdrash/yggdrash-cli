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
const { getBranch, setBranch, status } = require('./branch/config')
const { transferFrom, transfer, approve } = require('./rawTx/sendTransaction')
const { sendTransaction } = require('./tx/sendTransaction')
const { getBalance, specification, totalSupply, allowance } = require('./query/index')
const { nodeBuild, start, restart, nodeStatus, stop, setConfig } = require('./node/index')
const { Ygg } = require("@yggdrash/sdk")
const { config } = require('./db')

let host = config().get("node").value()[0].host
let port = config().get("node").value()[0].port

let sdk = new Ygg(new Ygg.providers.HttpProvider(`http://${host}:${port}`))

const account = {
    create: password => create(password, sdk),
    importAccount: (pk, pass) => importAccount(pk, pass, sdk),
    exportAccount,
    getAccounts,
    getAccount,
    getAdmin,
    setAdmin: owner => setAdmin(owner, sdk),
    adminVerify: (addr, password) => adminVerify(addr, password, sdk),
    clear
}

const node = {
    build: node => nodeBuild(node),
    start,
    restart,
    status: () => nodeStatus(),
    stop,
    setConfig
}

const branch = {
    seed,
    init,
    build,
    deploy,
    getBranch,
    setBranch,
    status
}

const query = {
    getBalance: (address) => getBalance(address, sdk),
    specification: () => specification(sdk),
    totalSupply: () => totalSupply(sdk),
    allowance: (owner, spender) => allowance(owner, spender, sdk)
}

const rawTx = {
    transferFrom: (from, to, amount, password) => transferFrom(from, to, amount, password, sdk),
    transfer: (to, amount, password) => transfer(to, amount, password, sdk),
    approve: (spender, amount, password) => approve(spender, amount, password, sdk)
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
