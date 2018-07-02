const jayson = require('jayson')

let client  = jayson.client.http('http://localhost:8080/transaction')

module.exports = {
    sendTransaction: (params) => {
        client.request('sendTransaction', {tx: JSON.stringify(params)}, (err, res) => {
            if(err) throw err
            console.log(res)
        })
    }
}