const { db } = require('../db')
const chalk = require('chalk')
const fs = require("fs")
const Yggdrash = require("@yggdrash/sdk")
const exec = require('child_process').exec

const plant = (seedFilePath) => {
    const ygg = new Yggdrash()
    const timestamp = ygg.utils.decimalToHex(new Date().getTime())
    // const seed = JSON.parse(fs.readFileSync(seedFilePath, 'utf8'))
    exec(`find . -name "*.seed.json"`, (error, seedFile, stderr) => {
        if (!seedFile.trim()) {
            console.log()
            console.log(`  ` + chalk.red(`Seed file not found. Generate a seed file at the current location.`))
            console.log()
        } else {
            const seed = JSON.parse(fs.readFileSync(seedFile.trim(), 'utf8'))
            if (seed.contractId) {
                format(seed, ygg, timestamp)
            } else {
                exec("pwd", (error, pwd, stderr) => {
                    var contractID
                    exec(`cd ${pwd.trim()}/contract-template;./gradlew`, (error, build, stderr) =>{
                        if(build){
                            exec(`cd ${pwd.trim()}/contract-template/build/classes/java/main; ls`, (error, classFile, stderr) =>{
                                if(classFile){
                                    const contractByte = fs.readFileSync(`${pwd.trim()}/contract-template/build/classes/java/main/${classFile.trim()}`, 'binary')
                                    contractID = ygg.utils.sha1(contractByte)        
                                    format(seed, ygg, timestamp, contractID)
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

const format = (seed, ygg, timestamp, contractID) => {
    let Break = new Error('Break')
    try {
        db().get("accounts").map("address").value().map(addr => {
            if(addr === `0x${seed.owner}`){
                let privatekeyEncryptedKey = db().get("principals").find({address: `0x${seed.owner}`}).value().EncryptedKey
                let data = {
                    'seed': `0x${ygg.utils.keccak(ygg.utils.dataToJsonNonArray(seed)).toString('hex')}`
                }
                let genesis = new ygg.genesis(data)
                genesis.sign(new Buffer(privatekeyEncryptedKey, 'hex'))     
                let signature = genesis.vrs()

                branchFormat(seed, contractID, signature, timestamp, ygg)

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

const branchFormat = (seed, contractID, signature, timestamp, ygg) => {
    const branch = {
        "name": seed.name,
        "owner": seed.owner,
        "symbol": seed.symbol,
        "property": seed.property,
        "type": seed.type,
        "timestamp": timestamp,
        "description": seed.description,
        "contractId": seed.contractId || contractID,
        "genesis": {
            "alloc": seed.genesis.alloc
        },
        "signature": signature
    }

    const branchId = ygg.utils.keccak(ygg.utils.dataToJsonNonArray(branch)).toString('hex').substring(0,40)

    exec("pwd", (error, pwd, stderr) => {
        // try { 
        //     fs.mkdirSync(`${stdout.trim()}/branch`); 
        // } catch (e) { 
        //     if ( e.code != 'EEXIST' ) throw e;
        // }

        // fs.writeFile(`${stdout.trim()}/branch/${branch.symbol.toLowerCase()}.branch.json`,
        // JSON.stringify(branch, undefined, '\t'), err => {
        //     if (err) throw err;
        //     console.log()
        //     console.log(`  ` + chalk.green(`${stdout.trim()}/branch/${branch.symbol.toLowerCase()}.branch.json `) + `saved.`)
        // })
        fs.writeFile(`${pwd.trim()}/${branch.symbol.toLowerCase()}.branch.json`,
        JSON.stringify(branch, undefined, '\t'), err => {
            if (err) throw err;
            console.log()
            console.log(`  ` + chalk.green(`✨ ${pwd.trim()}/${branch.symbol.toLowerCase()}.branch.json `) + `saved`)
        })
        info(branch, branchId)
    })
}


 const info = (info, branchId) => {
    setTimeout(() => {
      console.log()
      console.log(`  ` + `CREATOR - ${chalk.green(info.owner)}`)
    }, 100)
    setTimeout(() => {
        console.log(`  ` + `Branch Name - ${chalk.green(info.name)}`)
    }, 150)
    setTimeout(() => {
        console.log(`  ` + `Branch Symbol - ${chalk.green(info.symbol)}`)
    }, 200)
    setTimeout(() => {
        console.log(`  ` + `Branch type - ${chalk.green(info.type)}`)
    }, 250)
    setTimeout(() => {
        console.log(`  ` + `Branch Property- ${chalk.green(info.property)}`)
    }, 300)
    setTimeout(() => {
        console.log(`  ` + `Branch Description- ${chalk.green(info.description)}`)
        console.log(`  ` + "...")
    }, 350)
    setTimeout(() => {
        console.log(`  ` + `Contract ID - ${chalk.green(info.contractId)}`)
    }, 400)
    setTimeout(() => {
        console.log()
        console.log(`  ` + `==> Branch ID : ${chalk.yellow(branchId)}`)
    }, 450)
 }

 module.exports = {
  plant
}