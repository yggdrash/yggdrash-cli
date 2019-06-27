const { newAccount, 
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
const { getContracts } = require('./contract')
const { list, setBranch, status } = require('./branch/config')
const { transferFrom, transfer, approve, create } = require('./rawTx/sendTransaction')
const { invoke } = require('./invoke')
const { sendTransaction } = require('./tx/sendTransaction')
const { getBalance, specification, totalSupply, allowance, feeState } = require('./query')
const { nodeBuild, start, restart, nodeStatus, stop, setConfig, remoteSet, remoteStatus} = require('./node')
const { Ygg } = require("@yggdrash/sdk")
const { db, config } = require('./db')

let nodeUrl = undefined

if (db().get("remote").value()) {
    nodeUrl = db().get("remote").get("address").value()
} else {
    let host = config().get("node").value()[0].host
    let port = config().get("node").value()[0].port
    nodeUrl = `http://${host}:${port}`
}

let ygg = new Ygg(new Ygg.providers.HttpProvider(nodeUrl))

const account = {
    newAccount: (password, opts )=> newAccount(password, opts, ygg),
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
    setConfig,
    remoteSet: (url) => remoteSet(url),
    remoteStatus: () => remoteStatus()
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
    allowance: (owner, spender) => allowance(owner, spender, ygg),
    feeState: () => feeState(ygg)
}

const rawTx = {
    transferFrom: (from, to, amount, password) => transferFrom(from, to, amount, password, ygg),
    transfer: (to, amount, password) => transfer(to, amount, password, ygg),
    approve: (spender, amount, password) => approve(spender, amount, password, ygg),
    create: (password) => create(password, ygg)
}

const invokeTx = {
    invoke: (password, contractName, method, params) => invoke(password, contractName, method, params, ygg)
}

const contract = {
    getContracts:() => getContracts(ygg)
}

module.exports = {
    account,
    node,
    branch,
    query,
    rawTx,
    contract,
    invokeTx
}
