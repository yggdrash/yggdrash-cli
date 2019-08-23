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
const {
    transferFrom,
    transfer,
    approve,
    create,
    getTransaction,
    getTransactionReceipt,
    versioning,
    getPendingTransactionList,
    newPendingTransactionFilter
} = require('./rawTx')
const {
    getLogs,
    curIndex
} = require('./log')
const {
    getAllActivePeer
} = require('./peer')
const { invoke } = require('./invoke')
const { getBalance, specification, totalSupply, allowance,
    feeState, proposeSatatus, transactionConfirmStatus,
    blockNumber,
    query
} = require('./query')
const { nodeBuild, start, restart, nodeStatus, stop, setConfig, remoteSet, remoteStatus, sync} = require('./node')
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
    remoteStatus: () => remoteStatus(),
    sync
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

const queries = {
    // getBalance: (address) => getBalance(address, ygg),
    // specification: () => specification(ygg),
    // totalSupply: () => totalSupply(ygg),
    // allowance: (owner, spender) => allowance(owner, spender, ygg),
    // feeState: () => feeState(ygg),
    // proposeSatatus: (proposeId) => proposeSatatus(ygg, proposeId),
    // transactionConfirmStatus: (txConfirmId) => transactionConfirmStatus(ygg, txConfirmId),
    blockNumber: () => blockNumber(ygg),
    query: (contractName, method, params) => query(contractName, method, params, ygg)
}

const logs = {
    curIndex: () => curIndex(ygg),
    getLogs:() => getLogs(ygg),
}

const rawTx = {
    transferFrom: (from, to, amount, password) => transferFrom(from, to, amount, password, ygg),
    transfer: (to, amount, password) => transfer(to, amount, password, ygg),
    approve: (spender, amount, password) => approve(spender, amount, password, ygg),
    create: (password) => create(password, ygg),
    getTransaction: (txId) => getTransaction(txId, ygg),
    getTransactionReceipt: (txId) => getTransactionReceipt(txId, ygg),
    versioning: (password) => versioning(password, ygg),
    getPendingTransactionList: () => getPendingTransactionList(ygg),
    newPendingTransactionFilter: () => newPendingTransactionFilter(ygg)
}

const invokeTx = {
    invoke: (address, password, contractName, method, params) => invoke(address, password, contractName, method, params, ygg)
}

const contract = {
    getContracts:() => getContracts(ygg)
}

const peer = {
    getAllActivePeer:() => getAllActivePeer(ygg)
}

module.exports = {
    account,
    node,
    branch,
    queries,
    rawTx,
    contract,
    invokeTx,
    logs,
    peer
}
