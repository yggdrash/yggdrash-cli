const getHomePath = require('home-path')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const mkdirp = require('mkdirp')

const db = () => {
    mkdirp.sync(`${getHomePath}/.yggdrash/cli`)
    let adapter = new FileSync(`${getHomePath}/.yggdrash/cli/db.json`)
    let lowdb = low(adapter)
    return lowdb
}

const config = () => {
    let adapter = new FileSync(`config.json`)
    let lowdb = low(adapter)
    lowdb.defaults({ node: [], branch: [] }).write()

    if (!lowdb.get('node').value()[0]) {
        lowdb.get('node').push({
            path: `${getHomePath}/.yggdrash/yggdrash`,
            host: `localhost`,
            port: 8080
        }).write()
    }

    if (!lowdb.get('branch').value()[0]) {
        lowdb.get('branch').push({
            id: '61dcf9cf6ed382f39f56a1094e2de4d9aa54bf94'
        }).write()
    }

    return lowdb
}
    
module.exports = {
    db,
    config
}