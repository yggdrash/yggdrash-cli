const { coinbase } = require('../wallet/account')
const { db } = require('../db')
const Yggdrash = require("ygg")
const chalk = require('chalk')

 const admin = (action, port, log, net) => {
    const ygg = new Yggdrash(new Yggdrash.providers.HttpProvider(net ? `http://${net}` : 'http://localhost:8080'));
    let timestamp = new Date().getTime()

    let body = ygg.client.nodeHello();
    let bodyJson = ygg.utils.dataToJson(body)

    const rawTx = {
        "timeStamp":`0x${ygg.utils.decimalToHex(timestamp)}`,
        "nonce":`0x${ygg.utils.nonce()}`,
        "bodyHash":`0x${ygg.utils.bodyHashHex(bodyJson)}`,    
        "bodyLength":`0x${ygg.utils.decimalToHex(bodyJson.length)}`
    };

    let tx = new ygg.tx(rawTx);

    if (db().get("principals").find({address:coinbase()}).value() == null) {
        console.log(`  ` + `${chalk.red("Please create a coinbase account.")}`)
    } else {
        const privatekeyEncryptedKey = db().get("principals").find({address:coinbase()}).value().EncryptedKey    
        tx.sign(new Buffer(privatekeyEncryptedKey, 'hex'));
        let serialize = tx.serialize(body);  
        console.log("pubkey", tx.getSenderPublicKey().toString('hex'))
        ygg.client.getNonce(serialize).then((result) => {
            // console.log("nonce", result)  
            let body = action === "restart" ? ygg.client.nodeRestart() : ygg.client.nodeSetConfig(port, log)
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

 module.exports = {
    admin
}