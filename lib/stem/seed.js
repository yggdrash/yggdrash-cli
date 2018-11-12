const chalk = require('chalk')
const fs = require("fs")
const path = require("path")

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

        try { 
            fs.mkdirSync('seed'); 
        } catch (e) { 
            if ( e.code != 'EEXIST' ) throw e; // 존재할경우 패스처리함. 
        }

        const seedLocation = path.join(__dirname, `../../seed/${seed.symbol.toLowerCase()}.seed.json`);
        fs.writeFile(seedLocation,
        JSON.stringify(seed, undefined, '\t'), err => {
            if (err) throw err;
            console.log()
            console.log(`    ` + chalk.green(`yggdrash-cli/seed/${seed.symbol.toLowerCase()}.seed.json`) + ` saved.`)
            console.log()
        })
      }
 }

 module.exports = {
    seed
}