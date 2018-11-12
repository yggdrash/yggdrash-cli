const getHomePath = require('home-path')
const fs = require("fs")
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

    const db = () => {
        try { 
            fs.mkdirSync(`${getHomePath}/.yggdrash/`); 
        } catch (e) { 
            if ( e.code != 'EEXIST' ) throw e; 
        }

        const adapter = new FileSync(`${getHomePath}/.yggdrash/account.json`)
        const lowdb = low(adapter)
        return lowdb
    }
    
module.exports = {
    db
}