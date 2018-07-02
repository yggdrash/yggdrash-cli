const { 
    getAccounts,
    createAccount,
} = require('./wallet')

const account = async (action, options = {}) => {
    switch(action) {
        case 'new':
        console.log(createAccount())
        break

        case 'list':
        console.log(getAccounts())
        break

        default:
        console.log('Not Found Command.')
        break;
    }
}

module.exports = (...args) => {
    return account(...args).catch(err => {
        console.log(err)
        process.exit(1)
    })
}