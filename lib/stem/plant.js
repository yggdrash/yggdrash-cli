'use strict'

const jayson = require('jayson')

var plantToStem = params => {
    let client  = jayson.client.http(`http://localhost:8080/api/transaction`)
    client.request('sendTransaction', {tx: params}, (err, res) => {
        if(err) throw err
        return console.log(res)
    });
 }

 module.exports = {
    plantToStem
}