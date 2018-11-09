const { db } = require('../db')
const chalk = require('chalk')
const fs = require("fs")
const path = require("path")
const Yggdrash = require("@yggdrash/sdk")

const plant = (seedFilePath) => {
    const ygg = new Yggdrash();
    const timestamp = new Date().getTime()
    const seed = JSON.parse(fs.readFileSync(seedFilePath, 'utf8'))
    const branchLocation = path.join(__dirname, `../../branch/${seed.symbol.toLowerCase()}.branch.json`);
    const Break = new Error('Break')
    var exec = require('child_process').exec

    var child = exec("cd template;ls", (error, stdout, stderr) =>{
        console.log(stdout);

        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });


    // try {
    //     db().get("accounts").map("address").value().map(addr => {
    //         if(addr === `0x${seed.owner}`){
    //             let privatekeyEncryptedKey = db().get("principals").find({address: `0x${seed.owner}`}).value().EncryptedKey

    //             let data = {
    //                 'owner': `0x${seed.owner}`,
    //                 'timeStamp': `0x${ygg.utils.decimalToHex(timestamp)}`
    //             }

    //             let tx = new ygg.tx(data)
    //             tx.sign(new Buffer(privatekeyEncryptedKey, 'hex'))                
    //             branchFormat(seed, tx, ygg.utils.decimalToHex(timestamp), branchLocation)

    //             throw Break;
    //         }
    //     });
    // } catch (e) {
    //     if (e!== Break) {
    //         console.log()
    //         console.log(`  ` + chalk.red(`Invalid transaction data format`))
    //         console.log()
    //         throw Break;
    //     }
    // }
}

const branchFormat= (seed, tx, timestamp, branchLocation) => {
    const branch = {
        "name": seed.name,
        "owner": seed.owner,
        "symbol": seed.symbol,
        "property": seed.property,
        "type": seed.type,
        "timestamp": timestamp,
        "description": seed.description,
        "tag": seed.tag,
        "version": seed.version,
        "reference_address": seed.reference_address,
        "reserve_address": seed.reserve_address,
        "genesis": {
            "alloc": seed.genesis.alloc
        },
        "signature": tx.vrs()
    }

    const branchId = tx.vrs().substring(0,39)

    try { 
        fs.mkdirSync('branch'); 
    } catch (e) { 
        if ( e.code != 'EEXIST' ) throw e;
    }

    fs.writeFile(branchLocation,
    JSON.stringify(branch, undefined, '\t'), err => {
        if (err) throw err;
        console.log(`  ` + chalk.green(`yggdrash-cli/branch/${branch.symbol.toLowerCase()}.branch.json `) + `saved.`)
    })
    info(branch, branchId);
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
        console.log(`  ` + `Branch Version ${chalk.green(info.version)}`)
    }, 400)
    setTimeout(() => {
        console.log()
        console.log(`  ` + `==> Branch ID : ${chalk.yellow(branchId)}`)
    }, 450)
 }

 module.exports = {
  plant
}