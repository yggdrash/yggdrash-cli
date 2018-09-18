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
    api().then(client => {
        client.request('balanceOf', {data: balanceParamsbodyJson}, (err, res) => {
            if(err) throw err
            return console.log(res)
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
    getYeedBalance
}