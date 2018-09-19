'use strict'

const jayson = require('jayson')

var sendTx = params => {
    let client  = jayson.client.http(`http://localhost:8080/api/transaction`)
    api().then(client => {
        client.request('sendTransaction', {tx: params}, (err, res) => {
            if(err) throw err
            return console.log(res)
        });
    });
 }

 var api = () => {
    return new Promise(resolve => {
        let client  = jayson.client.http(`http://localhost:8080/api/transaction`)    
        resolve(client)
    });
 }
 
 module.exports = {
    sendTx
}