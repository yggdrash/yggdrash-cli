const chalk = require('chalk')
const { db, config } = require('../db')

const branch = db().get('remote').get('branch').value()
const branchId = branch ? Object.keys(branch)[0] : ""


/**
 * @method getLogs
 * @returns {String}
 */
const getLogs = (ygg) => {
    ygg.client.getLogs(branchId, 1, 100).then(res => {
        console.log(JSON.stringify(res, null, " "))
    });
}


/**
 * @method curIndex
 * @returns {String}
 */
const curIndex = ygg => {
    ygg.client.curIndex(branchId)
        .then(result => {
            console.log(`  ` + `==> curIndex : ${chalk.yellow(result)}`)
        })
}

module.exports = {
    getLogs,
    curIndex
}