const { db } = require('../db')
const chalk = require('chalk')
const fs = require("fs")
const Yggdrash = require("@yggdrash/sdk")
const exec = require('child_process').exec
var Buffer = require('safe-buffer').Buffer

const build = (owner) => {
    const ygg = new Yggdrash()
    const timestamp = ygg.utils.decimalToHex(new Date().getTime())

    exec(`find . -name "*.seed.json"`, (error, seedFile, stderr) => {
        if (!seedFile.trim()) {
            console.log()
            console.log(`  ` + chalk.red(`Seed file not found. Generate a seed file at the current location.`))
            console.log()
        } else {
            console.log()
            console.log(' > Building contract...')
            const seed = JSON.parse(fs.readFileSync(seedFile.trim(), 'utf8'))
            if (seed.contractId) {
                format(seed, ygg, timestamp, owner)
            } else {
                exec("pwd", (error, pwd, stderr) => {
                    var contractID
                    exec(`cd ${pwd.trim()}/contract;./gradlew clean build`, (error, build, stderr) =>{
                        if(build){
                            exec(`cd ${pwd.trim()}/contract/build/classes/java/main;ls`, (error, classFile, stderr) =>{
                                if(classFile){
                                    const contractByte = fs.readFileSync(`${pwd.trim()}/contract/build/classes/java/main/${classFile.trim()}`, 'binary')
                                    contractID = ygg.utils.sha1(contractByte)        
                                    format(seed, ygg, timestamp, owner, contractID)
                                }
                                if (error !== null) console.log('exec error: ' + error)
                            })
                        }
                        if (error !== null) console.log('exec error: ' + error)
                    })
                    if (error !== null) console.log('exec error: ' + error)
                })
            }
        }
    })
}

const format = (seed, ygg, timestamp, owner, contractID) => {
    let Break = new Error('Break')
    try {
        db().get("accounts").map("address").value().map(addr => {
            if(addr === `${owner}`){
                let privatekeyEncryptedKey = db().get("principals").find({address: `${owner}`}).value().EncryptedKey
                let data = {
                    'seed': `0x${ygg.utils.keccak(ygg.utils.dataToJsonNonArray(seed)).toString('hex')}`
                }

                let genesis = new ygg.genesis(data)
                genesis.sign(Buffer.from(privatekeyEncryptedKey, 'hex'))
                let signature = genesis.vrs()

                branchFormat(seed, contractID, signature, timestamp, ygg, owner)
                throw Break;
            }
        })
    } catch (e) {
        if (e!== Break) {
            console.log()
            console.log(`  ` + chalk.red(`Invalid transaction data format`))
            console.log()
            throw Break;
        }
    }
}

const branchFormat = (seed, contractID, signature, timestamp, ygg, owner) => {
    const branch = {
        "name": seed.name,
        "symbol": seed.symbol,
        "property": seed.property,
        "description": seed.description,
        "contractId": seed.contractId || contractID,
        "genesis": {
            "alloc": seed.genesis.alloc
        },
        "timestamp": timestamp,
        "owner": owner.substring(2),
        "signature": signature
    }

    const branchId = ygg.utils.keccak(ygg.utils.dataToJsonNonArray(branch)).toString('hex').substring(0,40)

    exec("pwd", (error, pwd, stderr) => {
        fs.writeFile(`${pwd.trim()}/${branch.symbol.toLowerCase()}.branch.json`,
        JSON.stringify(branch, undefined, '\t'), err => { if (err) throw err; })
        info(pwd, branch, branchId)
    })
}


 const info = (pwd, info, branchId) => {
    setTimeout(() => {
      console.log()
      console.log(`    ` + `CREATOR - ${chalk.green(info.owner)}`)
    }, 100)
    setTimeout(() => {
        console.log(`    ` + `Branch Name - ${chalk.green(info.name)}`)
    }, 150)
    setTimeout(() => {
        console.log(`    ` + `Branch Symbol - ${chalk.green(info.symbol)}`)
    }, 200)
    setTimeout(() => {
        console.log(`    ` + `Branch Property- ${chalk.green(info.property)}`)
    }, 250)
    setTimeout(() => {
        console.log(`    ` + `Branch Description- ${chalk.green(info.description)}`)
        console.log(`    ` + "...")
    }, 300)
    setTimeout(() => {
        console.log(`    ` + `Contract ID - ${chalk.green(info.contractId)}`)
    }, 350)
    setTimeout(() => {
        console.log()
        console.log(`    ` + `👉 Branch ID : ${chalk.yellow(branchId)}`)
    }, 400)
    setTimeout(() => {
        console.log()
        console.log(`    ` + chalk.green(`✨ ${pwd.trim()}/${info.symbol.toLowerCase()}.branch.json `) + `saved`)
        console.log()
    }, 450)
 }

 module.exports = {
    build
}