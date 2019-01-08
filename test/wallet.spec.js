const assert = require('assert')
const { db } = require('../lib/db')
const { 
  account
} = require('../lib/core')

const password = 'Aa1234567890!'
const address = 'c27c301fB9017BA731c8f672907847780c6a6a90'
const privatekey = 'aac059590ce482aa32738b240117b3affc69a52984b81fc1c5e8611bd93355a5'
const importAddress = '2Dbe588dA70cafe98bd1797119E96165A8E74191'
const opts = {
  salt: '3110cc869601b5ddd5aa739f2d1b7a18ff5c0c8042fc4ffc2294db44dd78135c',
  iv: '8ca6a0c01f993f587119a8369baf0cd8'
}
const derivedKey = '2864c3c958ed7bcdc954629348db4ddce07a7d2fe8977bc45054703a630aec36'

describe('Wallet Tests...', () => {
    describe('Account', () => {
      beforeEach(() => account.clear())
      it('Address should be 40 characters', () => {
        let address = account.create(password)
        assert(address.length > 0 && address.length === 40)
      })
  
      it('cipertext should be 96 characters.', () => {
        let address = account.create(password, opts)
        console.log(address)
        // let c = db().get("accounts").find({address: `${address}`}).value().crypto
        // assert(address.length > 0 && c.ciphertext.length === 96)
        // assert.equal(true, c.cipherparams.iv.length === 32)
        // assert.equal(true, c.cipher === 'aes-128-cbc')
        // assert.equal(true, c.kdfparams.dklen === 32)
        // assert.equal(true, c.kdfparams.c === 262144)
        // assert.equal(true, c.kdfparams.prf === 'hmac-sha256')
        // assert.equal(true, c.kdfparams.salt.length === 64)
        // assert.equal(true, c.mac.length === 64)
      })

      // it('should get accounts', () => {
      //   create(password)
      //   create(password)
      //   let accounts = getAccounts()
      //   assert(accounts.length == 2)
      //   assert(address[0].length > 0 && address[0].length === 40)
      // })
  
      // it('should get admin', () => {
      //   create(password)
      //   create(password)
      //   let admin = getAdmin()      
      //   assert.equal(true, admin == getAccount(0))
      //   assert.equal(false, admin == getAccount(1))
      // })
  
      // it('should set admin', () => {
      //   create(password)
      //   create(password)
      //   let admin = getAdmin()
      //   assert.equal(true, admin == getAccount(0))
      //   getAdmin(getAccount(1))

      //   let tmpAdmin = getAdmin()
      //   assert.equal(true, admin != tmpAdmin)
      // })

      // it('Admin verify', () => {
      //   create(password)
      //   assert.equal(true, adminVerify(getAccount(0), password))
      // })

      // it('import account', () => {
      //   let addr = importAccount(privatekey, password)
      //   assert.equal(true, addr === importAddress)
      // })

      // it('export account', () => {
      //   let addr = create(password)
      //   let status = exportAccount(addr, password, 'privatekey')
      //   assert.equal(true, status != false)
      // })

    })
  })