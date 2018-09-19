'use strict'

const bip39 = require('bip39');
const HDKey = require('../wallet/hdkey');

const HDpath = "m/44'/60'/0'/0/0";

const actionCreateAccount = () => {
    let mnemonic = bip39.generateMnemonic();
    const hdwallet = HDKey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
    const wallet = hdwallet.derivePath(HDpath).getWallet();
    const fromPrivateKeyBuffer = wallet.getPrivateKey();
    let address = wallet.getAddressString();
    return fromPrivateKeyBuffer;
}


module.exports = {
    actionCreateAccount
}