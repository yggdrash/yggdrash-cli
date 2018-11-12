const chalk = require('chalk')
const fs = require("fs")
const path = require("path")
const exec = require('child_process').exec

const deploy = (branchFilePath, nodeFilePath) => {
    const branch = JSON.parse(fs.readFileSync(branchFilePath, 'utf8'))
    const branchID = branch.signature.substring(0,40)
    const contractID = branch.version
    const charOfContractId = contractID.substring(0,2)

    const classFile = "class"

    // const branchLocation = path.join(__dirname, `../../branch/${seed.symbol.toLowerCase()}.branch.json`);

    exec(`mkdir -p ${nodeFilePath}/.yggdrash;mkdir ${nodeFilePath}/.yggdrash/branch;mkdir ${nodeFilePath}/.yggdrash/branch/${branchID};cp -r ${branchFilePath} ${nodeFilePath}/.yggdrash/branch/${branchID}/branch.json`, (error, stdout, stderr) =>{
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });

    exec(`mkdir -p ${nodeFilePath}/.yggdrash;mkdir ${nodeFilePath}/.yggdrash/contract;mkdir ${nodeFilePath}/.yggdrash/contract/${charOfContractId};cp -r ${branchFilePath} ${nodeFilePath}/.yggdrash/contract/${charOfContractId}/contractID.class`, (error, stdout, stderr) =>{
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
 }

 module.exports = {
    deploy
}