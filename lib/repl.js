const repl = require('repl')
const chalk = require('chalk')
const core = require('./core')

const yggRepl = async (flags = {}) => {
    displayIntro();
    const r = repl.start('ygg> ').context.ygg = core
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