const getHomePath = require('home-path')
const chalk = require('chalk')
const fs = require("fs")
const exec = require('child_process').exec

const deploy = net => {
    exec(`find . -name "*.branch.json"`, (error, branchFile, stderr) => {
        if (!branchFile.trim()) {
            console.log()
            console.log(`  ` + chalk.red(`Branch file not found. Generate a branch file at the current location.`))
            console.log()
        } else {
            const branch = JSON.parse(fs.readFileSync(branchFile.trim(), 'utf8'))
            const branchID = branch.signature.substring(0,40)
            const contractID = branch.contractId
            const charOfContractId = contractID.substring(0,2)

            exec(`mkdir -p ${getHomePath}/.yggdrash/branch;
                  mkdir -p ${getHomePath}/.yggdrash/branch/${branchID};
                  cp -r ${branchFile.trim()} ${getHomePath}/.yggdrash/branch/${branchID}/branch.json`, (error, stdout, stderr) =>{
                  if (error !== null) {
                      console.log('exec error: ' + error)
                  }
            })

            exec("pwd", (error, pwd, stderr) => {
                exec(`cd ${pwd.trim()}/contract-template/src/main/java;ls`, (error, contract, stderr) => {
                    exec(`mkdir -p ${getHomePath}/.yggdrash/contract;
                          mkdir -p ${getHomePath}/.yggdrash/contract/${charOfContractId};
                          cp -r ${pwd.trim()}/contract-template/src/main/java/${contract.trim()} ${getHomePath}/.yggdrash/contract/${charOfContractId}/${contractID}.class`, (error, stdout, stderr) =>{
  
                          console.log()
                          console.log(`   Successful Deploy 😊`)
                          console.log()
                          console.log(`  ` + chalk.green(`✨ ${getHomePath}/.yggdrash/branch/${branchID}/branch.json `) + `saved`)
                          console.log(`  ` + chalk.green(`✨ ${getHomePath}/.yggdrash/contract/${charOfContractId}/${contractID}.class `) + `saved`)
                          console.log()
                          if (error !== null) {
                              console.log('exec error: ' + error)
                          }
                })
                })
            })
        }
    })
 }

 module.exports = {
    deploy
}