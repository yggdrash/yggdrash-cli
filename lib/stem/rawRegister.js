'use strict'

const jayson = require('jayson')

var rawRegister = params => {

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
    rawRegister
}