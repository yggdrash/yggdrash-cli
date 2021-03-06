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
    // const config = path.join(__dirname, "../../config.json")
    // let adapter = new FileSync(config)
    let adapter = new FileSync(`${getHomePath}/.yggdrash/cli/config.json`)
    let lowdb = low(adapter)
    lowdb.defaults({ node: [] }).write()

    if (!lowdb.get('node').value()[0]) {
        lowdb.get('node').push({
            path: `${getHomePath}/.yggdrash/yggdrash`,
            host: `localhost`,
            port: 8080,
            branch: ''
        }).write()
    }

    return lowdb
}
    
module.exports = {
    db,
    config
}