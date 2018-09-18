'use strict'

const jayson = require('jayson')
const { dataToJson } = require('../../utils');
 
 const getYeedBalance = address => {
     let fromAddress = address.substring(2);
    const balanceParamsdata = {
        "address":"a08ee962cd8b2bd0edbfee989c1a9f7884d26532",
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
    let client  = jayson.client.http(`http://localhost:8080/api/account`)
      client.request('balanceOf', {data: balanceParamsbodyJson}, (err, res) => {
        if(err) throw err
        return console.log(res)
    })
  }

 module.exports = {
    getYeedBalance
}