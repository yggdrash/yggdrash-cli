const repl = require('repl')
const chalk = require('chalk')
const core = require('./core')

const yggRepl = async (flags = {}) => {
    displayIntro();
    const account = {
        create: core.account.create,
        importAccount: core.account.importAccount,
        getAccounts: core.account.getAccounts,
        getAccount: core.account.getAccount,
        getAdmin: core.account.getAdmin,
        clear: core.account.clear
    }
    const node = {
        build: core.node.build,
        start: core.node.start,
        status: core.node.status,
        stop: core.node.stop
    }
    const query = {
        getBalance: core.query.getBalance,
        specification: core.query.specification,
        totalSupply: core.query.totalSupply,
        allowance: core.query.allowance
    }
    const tx = {
        transferFrom: core.tx.transferFrom,
        transfer: core.tx.transfer,
        approve: core.tx.approve
    }

    const cons = {
        account: account,
        node: node,
        branch: branch,
        query: query,
        tx: tx,
    }
    const r = repl.start('ygg> ').context.ygg = cons
}

const displayIntro = () => {
    const intro = [
    '                           __                __  ',
    '    __  ______ _____ _____/ /________ ______/ /_ ',
    '   / / / / __ `/ __ `/ __  / ___/ __ `/ ___/ __ \\',
    '  / /_/ / /_/ / /_/ / /_/ / /  / /_/ (__  ) / / /',
    '  \\__, /\\__, /\\__, /\\__,_/_/   \\__,_/____/_/ /_/ ',
    ' /____//____//____/        ','',''
    ].join('\n')
    console.log(chalk.green(intro))
}

module.exports = (...args) => {
    return yggRepl(...args).catch(err => {
        console.error(err)
        process.exit(1)
    })
}