const { db } = require('../db')
const Yggdrash = require("@yggdrash/sdk")
const { adminAccount } = require('../wallet/account')
const Buffer = require('safe-buffer').Buffer
const chalk = require('chalk')
const mkdirp = require('mkdirp')
const getHomePath = require('home-path')
const fs = require("fs")
const exec = require('child_process').exec

/**
 * Start node with admin account
 *
 * @method start
 * @param {String} net (option)
 * @returns {String} 
*/

const start = node => {
    console.log('start')
    nodePri()
    // console.log('nodePrikey', nodePrikey.length)

    // exec(`cd ${node};SPRING_PROFILES_ACTIVE=prod ./gradlew`, (err, stdout, stderr) =>{
    //     console.log(err)
    //     console.log(stdout)
    //     console.log(stderr)
    // })
}

/**
 * Restart node with admin account
 *
 * @method restart
 * @param {String} net (option)
 * @returns {String} 
*/

const restart = node => {
    console.log('restart')
    nodePri()
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

const setConfig = (port, log, node) => {
    nodePri()
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

    if (db().get("accounts").find({address:adminAccount()}).value() == null) {
        console.log(`  ` + `${chalk.red("Please create a admin account.")}`)
    } else {
        const privatekeyEncryptedKey = db().get("accounts").find({address:adminAccount()}).value().encryptedKey
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

 const nodePri = () => {
    mkdirp.sync(`${getHomePath}/.yggdrash/keystore/`)
    let address = db().get("accounts").map("address").value()[0]
    let encryptedKey = db().get("accounts").find({address: `${address}`}).value().encryptedKey
    let iv = db().get("accounts").find({address: `${address}`}).value().iv
    let priKey = Buffer.concat([Buffer.from(iv, 'hex'), 
                                Buffer.from(encryptedKey, 'hex')])

    // if (fs.existsSync(`${getHomePath}/.yggdrash/keystore/nodePri.key`)) {
    //     return
    // }

    exec(`rm -rf ${getHomePath}/.yggdrash/keystore/nodePri.key`, () =>{
        fs.writeFileSync(`${getHomePath}/.yggdrash/keystore/nodePri.key`, priKey)
        exec(`chmod 400 ${getHomePath}/.yggdrash/keystore/nodePri.key`, () =>{})
    })
    //pubkey : cdb1d46ea266c8f39b41148e4bcdc852d80fe3532db09a8fd51ba03befb6095bf0f5f9705e7a12da4fc82ef9c2693459decc6a4b604758d743b53626c42459f4
    // Aa1234567890!
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