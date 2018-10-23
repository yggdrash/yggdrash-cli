const Yggdrash = require("ygg")
const chalk = require('chalk')

 const nodeRestart = (branchId, address, net) => {
    const ygg = new Yggdrash(new Yggdrash.providers.HttpProvider(net ? `http://${net}` : 'http://localhost:8080'));
    let body = ygg.client.nodeHello();
    let bodyJson = ygg.utils.dataToJson(body)

    const rawTx = {
        "timeStamp":`0x${ygg.utils.decimalToHex(timestamp)}`,
        "nonce":`0x${ygg.utils.nonce()}`,
        "bodyHash":`0x${ygg.utils.bodyHashHex(bodyJson)}`,    
        "bodyLength":`0x${ygg.utils.decimalToHex(bodyJson.length)}`
    };

    let tx = new ygg.tx(rawTx);

    tx.sign(new Buffer('3D8A58EA7FA6EF7E038791F3B837FA7BC62DC38CAAFE67AFC4D4567A64D4966E', 'hex'));

    let serialize = tx.serialize(body);
    // console.log("serialize", serialize)    
    // console.log("pubkey", tx.getSenderPublicKey().toString('hex'))

    ygg.client.getNonce(serialize).then((result) => {
        // console.log("nonce", result)  
        
        // let body = ygg.client.nodeRestart();
        let body = ygg.client.nodeSetConfig(32921,"info");
        let bodyJson = ygg.utils.dataToJson(body)

        const rawTx = {
            "timeStamp":`0x${ygg.utils.decimalToHex(timestamp)}`,
            "nonce":`0x${ygg.utils.nonce(result)}`,
            "bodyHash":`0x${ygg.utils.bodyHashHex(bodyJson)}`,    
            "bodyLength":`0x${ygg.utils.decimalToHex(bodyJson.length)}`
        };

        let tx = new ygg.tx(rawTx);

        tx.sign(new Buffer('3D8A58EA7FA6EF7E038791F3B837FA7BC62DC38CAAFE67AFC4D4567A64D4966E', 'hex'));

        let serialize = tx.serialize(body);
        console.log("serialize", serialize) 

        ygg.client.requestCommand(serialize).then((result) => {
            console.log("result", result)    
        })
    })

    console.log(`  ` + `==> Balance : ${chalk.yellow(val)}`)
    
 }

 module.exports = {
    nodeRestart
}