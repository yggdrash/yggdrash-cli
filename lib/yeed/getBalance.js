'use strict'

const jayson = require('jayson')
const chalk = require('chalk')
const { dataToJson } = require('../../utils');
 
 const getBalance = (branchId, address) => {
    let fromAddress = address.substring(2);
    const balanceParamsdata = {
        "address":branchId,
        "method":"balanceOf",
        "params":[
        { 
            address :fromAddress
        }
        ]
    }
    let balanceParamsbodyJson = dataToJson(balanceParamsdata)
    return getBalanceQry(balanceParamsbodyJson);
 }

  var getBalanceQry = (balanceParamsbodyJson) => {
    api().then(client => {
        client.request('balanceOf', {data: balanceParamsbodyJson}, (err, res) => {
            if(err) throw err
            return console.log(`  ` + `==> Balance : ${chalk.yellow(res.result)}`)
        })
    });
  }

  const api = () => {
    return new Promise(resolve => {
        let client  = jayson.client.http(`http://localhost:8080/api/account`)    
        resolve(client)
    });
 }

 module.exports = {
    getBalance
}