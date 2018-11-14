const getHomePath = require('home-path')
const chalk = require('chalk')
const fs = require("fs")
const exec = require('child_process').exec
const Yggdrash = require("@yggdrash/sdk")

const deploy = net => {
    const ygg = new Yggdrash(new Yggdrash.providers.HttpProvider(net ? `http://${net}` : 'http://localhost:8080'))
    exec(`find . -name "*.branch.json"`, (error, branchFile, stderr) => {
        if (!branchFile.trim()) {
            console.log()
            console.log(`  ` + chalk.red(`Branch file not found. Generate a branch file at the current location.`))
            console.log()
        } else {
            const branch = JSON.parse(fs.readFileSync(branchFile.trim(), 'utf8'))
            const branchID = ygg.utils.keccak(ygg.utils.dataToJsonNonArray(branch)).toString('hex').substring(0,40)
            const contractID = branch.contractId
            const charOfContractId = contractID.substring(0,2)

            exec(`mkdir -p ${getHomePath}/.yggdrash;
                  mkdir -p ${getHomePath}/.yggdrash/branch;
                  mkdir -p ${getHomePath}/.yggdrash/branch/${branchID};
                  cp -r ${branchFile.trim()} ${getHomePath}/.yggdrash/branch/${branchID}/branch.json`, (error, stdout, stderr) =>{
                  if (error !== null) {
                      console.log('exec error: ' + error)
                  }
            })

            exec("pwd", (error, pwd, stderr) => {
                exec(`cd ${pwd.trim()}/contract/build/classes/java/main;ls`, (error, contract, stderr) => {
                    exec(`mkdir -p ${getHomePath}/.yggdrash/contract;
                          mkdir -p ${getHomePath}/.yggdrash/contract/${charOfContractId};
                          cp -r ${pwd.trim()}/contract/build/classes/java/main/${contract.trim()} ${getHomePath}/.yggdrash/contract/${charOfContractId}/${contractID}.class`, (error, stdout, stderr) =>{
  
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