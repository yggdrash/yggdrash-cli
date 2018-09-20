'use strict'

const jayson = require('jayson')
const chalk = require('chalk')

var sendTx = (params, net) => {
    api(net).then(client => {
        client.request('sendTransaction', {tx: params}, (err, res) => {
            if(err) throw err
            return console.log(`  ` + `==> TX ID : ${chalk.yellow(res.result)}`)
        });
    });
 }

 var api = (net) => {
    return new Promise(resolve => {
        let client  = jayson.client.http(`http://${net}/api/transaction`)    
        resolve(client)
    });
 }
 
 module.exports = {
    sendTx
}