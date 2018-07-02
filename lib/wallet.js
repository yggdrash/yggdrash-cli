'use strict'

const EC = require('elliptic').ec

const ec = new EC('secp256k1')

let store = []

/**
 * Private
 */
const generateKeyPair = () => {
    let keys = ec.genKeyPair()
    store.push(keys)
    return keys
}

/**
 * Public
 */
const createAccount = () => {
    let keys = generateKeyPair()
    return keys.getPublic('hex')
}

const getAccounts = () => {
    return store.map(keys => {
        return keys.getPublic('hex')
    })
}

const clear = () => {
    store = []
}

module.exports = {
    createAccount,
    getAccounts,
    clear,
}