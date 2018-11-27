const { db } = require('./db')
const scrypt = require('scrypt-async')
const crypto = require('crypto')

const decryption = (address, password) => {
    let derivedKey

    let encryptedKey = db().get("accounts").find({address: `${address}`}).value().encryptedKey
    let nonce = db().get("accounts").find({address: `${address}`}).value().nonce
    let kdfParams = db().get("accounts").find({address: `${address}`}).value().kdfParams

    scrypt(Buffer.from(password), Buffer.from(kdfParams.salt, 'hex'), {
        N: kdfParams.n,
        r: kdfParams.r,
        p: kdfParams.p,
        dkLen: kdfParams.dklen,
        encoding: 'binary'
      }, resultDerivedKey => {
          derivedKey= resultDerivedKey
      })

    let ciphertext = Buffer.from(encryptedKey, 'hex')
    let decipher = crypto.createDecipheriv('aes-256-cbc', derivedKey, Buffer.from(nonce, 'hex'))
    let seed = Buffer.concat([decipher.update(ciphertext), decipher.final()])

    return seed
}

module.exports = {
    decryption
}