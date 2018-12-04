const { db } = require('./db')
const scrypt = require('scrypt-async')
const crypto = require('crypto')

/**
 * Decrypt the encrypted private key
 *
 * @method decryption
 * @param {String} address Address to decrypt
 * @param {String} password The password used to dencrypt the account private key
 * @returns {String} 
*/
const decryption = (address, password) => {
    let derivedKey

    let encryptedKey = db().get("accounts").find({address: `${address}`}).value().encryptedKey
    let iv = db().get("accounts").find({address: `${address}`}).value().iv
    let kdfParams = db().get("accounts").find({address: `${address}`}).value().kdfParams

    // scrypt(Buffer.from(password), Buffer.from(kdfParams.salt, 'hex'), {
    //     N: kdfParams.n,
    //     r: kdfParams.r,
    //     p: kdfParams.p,
    //     dkLen: kdfParams.dklen,
    //     encoding: 'binary'
    //   }, resultDerivedKey => {
    //       derivedKey= resultDerivedKey
    //   })
    
    // pbkdf2
    derivedKey = crypto.pbkdf2Sync(Buffer.from(password), kdfParams.salt, kdfParams.c, kdfParams.dklen, 'sha256');

    let ciphertext = Buffer.from(encryptedKey, 'hex')
    
    // scrypt
    // let decipher = crypto.createDecipheriv('aes-256-ctr', derivedKey, Buffer.from(iv, 'hex'))

    // pbkdf2
    let decipher = crypto.createDecipheriv('aes-128-ctr', derivedKey.slice(0, 16), Buffer.from(iv, 'hex'))
    let seed = Buffer.concat([decipher.update(ciphertext), decipher.final()])

    return seed
}

module.exports = {
    decryption
}