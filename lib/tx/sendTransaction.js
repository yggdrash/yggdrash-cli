const { adminAccount } = require('../wallet/account')
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
    // let branch = db().get('currentBranch').value()[0]
    const branch = '118eaa393958caf8e8c103fa9d78b5d2ded53109'
    
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

const _tx = (branch, methodName, params) => {
    const ygg = new Ygg(new Ygg.providers.HttpProvider("http://localhost:8080"))
    tx = new Transaction(branch, methodName, params)
    tx.sign('310d08df73d4bc989ea82a7002ceb6f60896ebc80feeeb80c04b6a27f9b4985e')
    ygg.client.sendTransaction(tx).then((result) => {
        console.log(`  ` + `==> Transaction Hash : ${chalk.yellow(result)}`)
    })
}

module.exports = {
    sendTransaction
}