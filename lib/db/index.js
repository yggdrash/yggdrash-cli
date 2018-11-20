const getHomePath = require('home-path')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const mkdirp = require('mkdirp')

    const db = () => {
        mkdirp.sync(`${getHomePath}/.yggdrash/cli`)

        const adapter = new FileSync(`${getHomePath}/.yggdrash/cli/account.json`)
        const lowdb = low(adapter)
        return lowdb
    }
    
module.exports = {
    db
}