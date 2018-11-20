const chalk = require('chalk')
const fs = require("fs")
const exec = require('child_process').exec

const init = (seed) => {
        exec("git clone https://git@bitbucket.org:r2v/contracts.git", (error, stdout, stderr) => {
            if (stderr.indexOf("fatal") == 0) {
                console.log()
                console.log(`    ` + chalk.red(`${stderr}`))
            } else {
                exec("pwd", (error, pwd, stderr) => {    
                    fs.writeFile(`${pwd.trim()}/${seed.symbol.toLowerCase()}.seed.json`,
                    JSON.stringify(seed, undefined, '\t'), err => {
                        if (err) throw err;
                        console.log()
                        console.log(`    ` + `👉  Enter additional information in ${seed.symbol.toLowerCase()}.seed.json. Then create a contract using the contract template.`)
                        console.log(`    ` + `    Example) frontier, total supply, contract id ...`)
                        console.log()
                        console.log(`    ` + chalk.green(`✨ ${pwd.trim()}/${seed.symbol.toLowerCase()}.seed.json`) + ` saved`)
                        console.log()
                    })
                })
            }
        })
 }

 module.exports = {
    init
}