const chalk = require('chalk')

/**
 * It shows the account balance in detail.
 *
 * @method getBalance
 * @param {String} address
 * @returns {String} 
*/
const getContracts = (ygg) => {
    //let id = "fe0c0627858f17b268455ceb89d37dcdc27d1ca6"
    // TODO fix getContracts
    ygg.client.getContracts()

}

 module.exports = {
    getContracts
}