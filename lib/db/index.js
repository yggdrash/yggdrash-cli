const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

    const db = () => {
        const adapter = new FileSync('account.json')
        const lowdb = low(adapter)
        return lowdb
    }
    
module.exports = {
    db
}