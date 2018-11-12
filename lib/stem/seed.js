const chalk = require('chalk')
const fs = require("fs")
const exec = require('child_process').exec

const seed = (name, owner, symbol, property, type, description, tag, totalSupply) => {
    if (property === "currency") {
        let seed = {
            "name": name || "metacoin",
            "owner": owner.substring(2),
            "symbol": symbol.toUpperCase() || "MCO",
            "property": property,
            "type": type,
            "description": description,
            "contractId":  "",
            "genesis": {
                "alloc":{}
            }
        }

        seed.genesis.alloc[owner.substring(2)] = {
            "balance": totalSupply
        }

        exec("git clone git@bitbucket.org:r2v/contract-template.git", (error, stdout, stderr) => {
            if (stderr.indexOf("fatal") == 0) {
                console.log()
                console.log(`    ` + chalk.red(`${stderr}`))
            } else {
                console.log(`    ` + chalk.green(`Cloning into 'contract-template'...`))
                exec("pwd", (error, pwd, stderr) => {    
                    // try { 
                    //     fs.mkdirSync(`${stdout.trim()}/seed`); 
                    // } catch (e) { 
                    //     if ( e.code != 'EEXIST' ) throw e; 
                    // }
        
                    // fs.writeFile(`${stdout.trim()}/seed/${seed.symbol.toLowerCase()}.seed.json`,
                    // JSON.stringify(seed, undefined, '\t'), err => {
                    //     if (err) throw err;
                    //     console.log()
                    //     console.log(`    ` + chalk.green(`${stdout.trim()}/seed/${seed.symbol.toLowerCase()}.seed.json`) + ` saved.`)
                    //     console.log()
                    // })
                    fs.writeFile(`${pwd.trim()}/${seed.symbol.toLowerCase()}.seed.json`,
                    JSON.stringify(seed, undefined, '\t'), err => {
                        if (err) throw err;
                        console.log()
                        console.log(`    ` + chalk.green(`✨ ${pwd.trim()}/${seed.symbol.toLowerCase()}.seed.json`) + ` saved`)
                        console.log()
                    })
                })
            }
        })
      }
 }

 module.exports = {
    seed
}