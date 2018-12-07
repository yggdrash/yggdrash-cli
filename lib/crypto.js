const { db } = require('./db')
const scrypt = require('scrypt-async')
const crypto = require('crypto')
const Yggdrash = require("@yggdrash/sdk")

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

    let c = db().get("accounts").find({address: `${address}`}).value().crypto
    let encryptedKey = c.ciphertext
    let iv = c.cipherparams.iv
    let kdfParams = c.kdfparams
    
    let ciphertext = Buffer.from(encryptedKey, 'hex')

    /* pbkdf2 */
    derivedKey = crypto.pbkdf2Sync(Buffer.from(password), Buffer.from(kdfParams.salt, 'hex'), kdfParams.c, kdfParams.dklen, 'sha256')
    let decipher = crypto.createDecipheriv('aes-128-cbc', derivedKey.slice(0, 16), Buffer.from(iv, 'hex'))

    /* scrypt */
    // scrypt(Buffer.from(password), Buffer.from(kdfParams.salt, 'hex'), {
    //     N: kdfParams.n,
    //     r: kdfParams.r,
    //     p: kdfParams.p,
    //     dkLen: kdfParams.dklen,
    //     encoding: 'binary'
    //   }, resultDerivedKey => {
    //       derivedKey= resultDerivedKey
    //   })

    // let decipher = crypto.createDecipheriv('aes-256-cbc', derivedKey, Buffer.from(iv, 'hex'))

    // TODO: mac 검증
    // let mac = ygg.utils.keccak(Buffer.concat([derivedKey.slice(16, 32), Buffer.from(ciphertext, 'hex')]))

    // if (mac.toString('hex') !== json.crypto.mac) {
    //     throw new Error('Key derivation failed - possibly wrong passphrase')
    // }

    let seed = Buffer.concat([decipher.update(ciphertext), decipher.final()])

    return seed
}

const derivation = (password, kdfParams) => {
    let derivedKey = crypto.pbkdf2Sync(Buffer.from(password), Buffer.from(kdfParams.salt, 'hex'), kdfParams.c, kdfParams.dklen, 'sha256')
    return derivedKey
}

module.exports = {
    decryption,
    derivation
}