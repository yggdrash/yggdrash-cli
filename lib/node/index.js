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
 * @method build
 * @param {String} node (option)
 * @returns {String} 
*/

const nodeBuild = node => {
    console.log('building..')
    console.log('Compiling JAR:$JARFILE')
    nodePri()

    exec(`cd ${node};./gradlew -PspringProfiles=prod clean build`, (err, stdout, stderr) =>{
        console.log(err ? err : '')
        console.log(stdout)
        console.log(stderr)  
    })
}

/**
 * Start node with admin account
 *
 * @method start
 * @param {String} node (option)
 * @returns {String} 
*/

const start = (node, password) => {
    console.log('start')
    nodePri()

    //build
    // ./gradlew -PspringProfiles=prod clean build

    exec(`cd ${node};java "-Dkey.path=/Users/haewonwoo/.yggdrash/keystore/nodePri.key" -jar yggdrash-gateway/build/libs/yggdrash-gateway.jar`, (err, stdout, stderr) =>{
        console.log(err)
        console.log(stdout)
        console.log(stderr)
    })
    
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
 * @param {String} node (option)
 * @returns {String} 
*/

const restart = node => {
    console.log('restart')
    nodePri()

    //pid? start 되어있는지 확인
    
    exec(`cd ${node};java "-Dkey.path=/Users/haewonwoo/.yggdrash/keystore/nodePri.key" -jar yggdrash-gateway/build/libs/yggdrash-gateway.jar`, (err, stdout, stderr) =>{
        console.log(err)
        console.log(stdout)
        console.log(stderr)
    })

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
    
    return priKey
 }
const api = net => {
    return new Yggdrash(new Yggdrash.providers.HttpProvider(net ? `http://${net}` : 'http://localhost:8080'));
}

 module.exports = {
    nodeBuild,
    start,
    restart,
    setConfig
}