const chalk = require('chalk')

const seed = (name, symbol, property, description, frontier, totalSupply) => {
    var seed
    if (property === "currency") {
        seed = {
            "name": name,
            "symbol": symbol.toUpperCase(),
            "property": property,
            "description": description,
            "contractId":  "",
            "genesis": {
                "alloc":{}
            }
        }

        seed.genesis.alloc[frontier.substring(2)] = {
            "balance": totalSupply || 100000000
        }

        console.log()
        console.log(chalk.green(`${JSON.stringify(seed,undefined,2)}`))
        console.log()
        console.log()
      } else {
        seed = {
            "name": name,
            "symbol": symbol.toUpperCase(),
            "property": property,
            "description": description,
            "contractId":  ""
        }

        console.log()
        console.log(chalk.green(`${JSON.stringify(seed,undefined,2)}`))
        console.log()
        console.log()
      }

      return seed
 }

 module.exports = {
    seed
}