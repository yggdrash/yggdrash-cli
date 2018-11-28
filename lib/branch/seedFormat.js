const chalk = require('chalk')

/**
 * Set seed data format for branch creation
 * Seed format changed for each property
 * 
 * @method seed
 * @param {String} name branch name
 * @param {String} symbol branch symbol
 * @param {String} property branch property
 * @param {String} description branch description
 * @param {String} frontier Set frontier when property is currency
 * @param {String} totalSupply Set totalSupply when property is currency
 * @returns {Object}
*/
const seed = (name, symbol, property, description, frontier, totalSupply) => {
    let seed
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

        seed.genesis.alloc[frontier] = {
            "balance": totalSupply || 100000000
        }
        info(seed)
      } else {
        seed = {
            "name": name,
            "symbol": symbol.toUpperCase(),
            "property": property,
            "description": description,
            "contractId":  ""
        }
        info(seed)
      }

      return seed
 }

 const info = seed => {
    console.log()
    console.log(chalk.green(`${JSON.stringify(seed,undefined,2)}`))
    console.log()
    console.log()
 }

 module.exports = {
    seed
}