const { db } = require('../db')
const Yggdrash = require("@yggdrash/sdk")
const { coinbase } = require('../wallet/account')
const Buffer = require('safe-buffer').Buffer
const chalk = require('chalk')
const mkdirp = require('mkdirp')
const getHomePath = require('home-path')

/**
 * Start node with admin account
 *
 * @method start
 * @param {String} net (option)
 * @returns {String} 
*/

const start = net => {
    admin()
}

/**
 * Restart node with admin account
 *
 * @method restart
 * @param {String} net (option)
 * @returns {String} 
*/

const restart = net => {
    admin()
    // let ygg = api(net)
    // let body = ygg.client.nodeRestart()
    // node(body, ygg)
}

/**
 * Change node configuration settings
 *
 * @method setConfig
 * @param {String} port
 * @param {String} log
 * @param {String} net (option)
 * @returns {String} 
*/

const setConfig = (port, log, net) => {
    admin()
    // let ygg = api(net)
    // let body = ygg.client.nodeSetConfig(Number(port), log)
    // node(body, ygg)
}
const node = (body, ygg) => {
    let timestamp = new Date().getTime()
    let nonceBody = ygg.client.nodeHello();
    let bodyJson = ygg.utils.dataToJson(nonceBody)

    const rawTx = {
        "timeStamp":`0x${ygg.utils.decimalToHex(timestamp)}`,
        "nonce":`0x${ygg.utils.nonce()}`,
        "bodyHash":`0x${ygg.utils.bodyHashHex(bodyJson)}`,    
        "bodyLength":`0x${ygg.utils.decimalToHex(bodyJson.length)}`
    };

    let tx = new ygg.tx(rawTx);

    if (db().get("accounts").find({address:coinbase()}).value() == null) {
        console.log(`  ` + `${chalk.red("Please create a coinbase account.")}`)
    } else {
        const privatekeyEncryptedKey = db().get("accounts").find({address:coinbase()}).value().encryptedKey
        tx.sign(Buffer.from(privatekeyEncryptedKey, 'hex'));
        let serialize = tx.serialize(nonceBody);  
        console.log("pubkey", tx.getSenderPublicKey().toString('hex'))
        ygg.client.getNonce(serialize).then((result) => {
            // console.log("nonce", result)  
            let bodyJson = ygg.utils.dataToJson(body)

            const rawTx = {
                "timeStamp":`0x${ygg.utils.decimalToHex(timestamp)}`,
                "nonce":`0x${ygg.utils.nonce(result)}`,
                "bodyHash":`0x${ygg.utils.bodyHashHex(bodyJson)}`,    
                "bodyLength":`0x${ygg.utils.decimalToHex(bodyJson.length)}`
            };

            let tx = new ygg.tx(rawTx);
            tx.sign(Buffer.from(privatekeyEncryptedKey, 'hex'));
            let serialize = tx.serialize(body);
            ygg.client.requestCommand(serialize).then((result) => {
                console.log(`  ` + `Nonce - ${chalk.green(result)}`)    
            })
        })   
    }
 }

 const admin = () => {
    mkdirp.sync(`${getHomePath}/.yggdrash/keystore/`)
    let address = db().get("accounts").map("address").value()[0]
    let encryptedKey = db().get("accounts").find({address: `${address}`}).value().encryptedKey
    let iv = db().get("accounts").find({address: `${address}`}).value().iv
    let priKey = Buffer.concat([Buffer.from(iv, 'hex'), 
                                Buffer.from(encryptedKey, 'hex')])
    return priKey
 }
const api = net => {
    return new Yggdrash(new Yggdrash.providers.HttpProvider(net ? `http://${net}` : 'http://localhost:8080'));
}

 module.exports = {
    start,
    restart,
    setConfig
}