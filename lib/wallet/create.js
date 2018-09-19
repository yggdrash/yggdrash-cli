'use strict'

const bip39 = require('bip39');
const HDKey = require('./hdkey');

const HDpath = "m/44'/60'/0'/0/0";

var yggAddress =[]
var privateKeyBuffer = []

const createAccount = () => {
    let mnemonic = bip39.generateMnemonic();
    const hdwallet = HDKey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
    const wallet = hdwallet.derivePath(HDpath).getWallet();
    const fromPrivateKeyBuffer = wallet.getPrivateKey();
    let address = wallet.getAddressString();
    yggAddress.push(address);
    privateKeyBuffer.push(fromPrivateKeyBuffer);
    return address;
}

const getAccounts = () => {
    return yggAddress.map(keys => {
        return keys
    })
}

const getAccount = index => {
    return yggAddress[index]
}

const clear = () => {
    yggAddress = []
    privateKeyBuffer = []
}

module.exports = {
    createAccount,
    getAccounts,
    getAccount,
    clear,
    yggAddress,
    privateKeyBuffer
}