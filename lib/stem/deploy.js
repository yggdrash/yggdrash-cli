const chalk = require('chalk')
const fs = require("fs")
const exec = require('child_process').exec

const deploy = (branchFilePath, nodeFilePath) => {
    const branch = JSON.parse(fs.readFileSync(branchFilePath, 'utf8'))

    const branchID = branch.signature.substring(0,40)
    const contractID = branch.contractId
    const charOfContractId = contractID.substring(0,2)

    exec(`mkdir -p ${nodeFilePath}/.yggdrash;
          mkdir ${nodeFilePath}/.yggdrash/branch;
          mkdir ${nodeFilePath}/.yggdrash/branch/${branchID};
          cp -r ${branchFilePath} ${nodeFilePath}/.yggdrash/branch/${branchID}/branch.json`, (error, stdout, stderr) =>{
        if (error !== null) {
            console.log('exec error: ' + error)
        }
    })

    exec("pwd", (error, pwd, stderr) => {
        exec(`cd ${pwd.trim()}/contract-template/src/main/java;ls`, (error, contract, stderr) => {
            exec(`mkdir -p ${nodeFilePath}/.yggdrash;
            mkdir ${nodeFilePath}/.yggdrash/contract;
            mkdir ${nodeFilePath}/.yggdrash/contract/${charOfContractId};
            cp -r ${pwd.trim()}/contract-template/src/main/java/${contract.trim()} ${nodeFilePath}/.yggdrash/contract/${charOfContractId}/${contractID}.class`, (error, stdout, stderr) =>{

            console.log()
            console.log(`   ✨ Successed Deploy`)
            console.log(`  ` + chalk.green(`${nodeFilePath}/.yggdrash/branch/${branchID}/branch.json `) + `saved.`)
            console.log(`  ` + chalk.green(`${nodeFilePath}/.yggdrash/contract/${charOfContractId}/${contractID}.class `) + `saved ✨`)
            console.log()
            if (error !== null) {
                console.log('exec error: ' + error)
            }
        })
        })
    })
 }

 module.exports = {
    deploy
}