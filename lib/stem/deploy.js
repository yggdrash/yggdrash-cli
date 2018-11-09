const chalk = require('chalk')
const fs = require("fs")
const path = require("path")

const deploy = (branchFilePath) => {
    const branch = JSON.parse(fs.readFileSync(branchFilePath, 'utf8'))
    console.log(branch)
 }

 module.exports = {
    deploy
}