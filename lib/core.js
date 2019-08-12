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
    getLogs,
    versioning
} = require('./rawTx')
const { invoke } = require('./invoke')
const { getBalance, specification, totalSupply, allowance,
    feeState, proposeSatatus, transactionConfirmStatus,
    getPendingTransactionList,
    newPendingTransactionFilter,
    blockNumber,
    curIndex
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

const query = {
    getBalance: (address) => getBalance(address, ygg),
    specification: () => specification(ygg),
    totalSupply: () => totalSupply(ygg),
    allowance: (owner, spender) => allowance(owner, spender, ygg),
    feeState: () => feeState(ygg),
    proposeSatatus: (proposeId) => proposeSatatus(ygg, proposeId),
    transactionConfirmStatus: (txConfirmId) => transactionConfirmStatus(ygg, txConfirmId),
    getPendingTransactionList: () => getPendingTransactionList(ygg),
    newPendingTransactionFilter: () => newPendingTransactionFilter(ygg),
    blockNumber: () => blockNumber(ygg),
    curIndex: () => curIndex(ygg)
}

const rawTx = {
    transferFrom: (from, to, amount, password) => transferFrom(from, to, amount, password, ygg),
    transfer: (to, amount, password) => transfer(to, amount, password, ygg),
    approve: (spender, amount, password) => approve(spender, amount, password, ygg),
    create: (password) => create(password, ygg),
    getTransaction: (txId) => getTransaction(txId, ygg),
    getTransactionReceipt: (txId) => getTransactionReceipt(txId, ygg),
    getLogs: () => getLogs(ygg),
    versioning: (password) => versioning(password, ygg),
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
    invokeTx,
}
