const chalk = require('chalk')
const fs = require("fs")
const exec = require('child_process').exec


/**
 * It automatically generates seed data and contract template for branch creation.
 *
 * @method init
 * @param {Object} seed
*/
const init = (seed) => {
        exec("git clone https://git@bitbucket.org/r2v/contracts.git", (stderr) => {
            if (stderr) {
                console.log(`\n    ` + chalk.red(`${stderr}`))
            } else {
                exec("pwd", (error, pwd, stderr) => {
                    fs.writeFile(`${pwd.trim()}/${seed.symbol.toLowerCase()}.seed.json`,
                    JSON.stringify(seed, undefined, '\t'), err => {
                        if (err) throw err;
                        console.log(`\n    ` + `👉  Enter additional information in ${seed.symbol.toLowerCase()}.seed.json. Then create a contract using the contract template.`)
                        console.log(`    ` + `    Example) frontier, total supply, contract id ...`)
                        console.log(`\n    ` + chalk.green(`✨ ${pwd.trim()}/${seed.symbol.toLowerCase()}.seed.json`) + ` saved\n`)
                    })
                })
            }
        })
 }

 module.exports = {
    init
}