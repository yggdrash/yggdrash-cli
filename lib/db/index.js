const getHomePath = require('home-path')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const mkdirp = require('mkdirp')
const path = require("path")
const fs = require("fs")

const db = () => {
    mkdirp.sync(`${getHomePath}/.yggdrash/cli`)
    let adapter = new FileSync(`${getHomePath}/.yggdrash/cli/db.json`)
    let lowdb = low(adapter)
    return lowdb
}

const config = () => {
    const config = path.join(__dirname, "../../config.json")
    let adapter = new FileSync(config)
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

const config2 = () => {
    // const config = path.join(__dirname, "../../test.json")
    // fs.writeFileSync(privateKeyLocation, 'hello')
}
    
module.exports = {
    db,
    config,
    config2
}