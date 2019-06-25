const chalk = require('chalk')
const Buffer = require('safe-buffer').Buffer
const { db } = require('../db')
const { decryption } = require('../crypto')
const { Transaction, Ygg } = require('@yggdrash/sdk')

 /**
 * Transactions occur at node
 * network is optional.
 *
 * @method sendTransactionV2
 * @param {String} privatekey The private key of the account to which the transaction will be sent.
 * @param {String} body
 * @param {String} ygg
 * @returns {String} 
*/

 const sendTransaction = (methodName, fromAddress, address, value) => {
    // check wallet
     let account = db().get("accounts")
    consosle.log(account)

    let branch = db().get('currentBranch').value()[0]
    // const branch = '61dcf9cf6ed382f39f56a1094e2de4d9aa54bf94'
    
    let params
    switch (methodName) {
        case 'transferFrom':
        params = {
            from: fromAddress,
            to: address,
            value, value
        }
        _tx(branch, methodName, params)
        return

        case 'transfer':
        params = {
            to: address,
            value, value
        }
        _tx(branch, methodName, params)
        return

        case 'approve':
        params = {
            spender: address,
            value, value
        }
        _tx(branch, methodName, params)
        return
    }
 }

 // TODO change network
 // TODO change signature
const _tx = async (branch, methodName, params) => {
    let ygg = new Ygg(new Ygg.providers.HttpProvider("http://localhost:8080"))
    tx = new Transaction(branch, methodName, params)
    // TODO get wallet
    await tx.sign('310d08df73d4bc989ea82a7002ceb6f60896ebc80feeeb80c04b6a27f9b4985e')

    ygg.client.sendTransaction(tx).then(res => {
        console.log(res)
    })


    tx.send().then(res => {
        console.log(res)
    })
}

module.exports = {
    sendTransaction
}