'use strict'

const { dataToJson } = require('../../utils');

const bodyData = (to, amount) => {
    let toAddress = to.substring(2)
    const body = 
        {
            "method":"transfer",
            "params":
            [
                {
                    address :toAddress,
                    amount :amount
                }
            ]
        }    
    let bodyJson = dataToJson(body);
    return bodyJson
}

module.exports = {
    bodyData
}