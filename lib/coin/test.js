const jayson = require('jayson')

let client  = jayson.client.http('http://localhost:8080/transaction')

const tx = async (action, options = {}) => {
    console.log('action', action)
    console.log('option', options.branch)
    console.log('option', options.to)
    // client.request('sendTransaction', {tx: JSON.stringify(options)}, (err, res) => {
    //     if(err) throw err
    //     console.log(res)
    // })
}

module.exports = (...args) => {
    return tx(...args).catch(err => {
        console.log(err)
        process.exit(1)
    })
}