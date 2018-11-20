const { coinbase } = require('../wallet/account')
const { db } = require('../db')
const Yggdrash = require("@yggdrash/sdk")
const chalk = require('chalk')


const restart = net => {
    let ygg = api(net)
    let body = ygg.client.nodeRestart()
    admin(body, ygg)
}

const setConfig = (port, log, net) => {
    let ygg = api(net)
    let body = ygg.client.nodeSetConfig(Number(port), log)
    admin(body, ygg)
}
const admin = (body, ygg) => {
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
        tx.sign(new Buffer(privatekeyEncryptedKey, 'hex'));
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
            tx.sign(new Buffer(privatekeyEncryptedKey, 'hex'));
            let serialize = tx.serialize(body);
            ygg.client.requestCommand(serialize).then((result) => {
                console.log(`  ` + `Nonce - ${chalk.green(result)}`)    
            })
        })   
    }
 }

const api = net => {
    return new Yggdrash(new Yggdrash.providers.HttpProvider(net ? `http://${net}` : 'http://localhost:8080'));
}

 module.exports = {
    restart,
    setConfig
}