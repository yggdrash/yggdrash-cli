const assert = require('assert')
const { db } = require('../lib/db')
const { 
  create,
  importAccount,
  exportAccount,
  getAccounts,
  getAccount,
  getAdmin,
  adminVerify,
  clear
} = require('../lib/wallet/account')

const password = 'Aa1234567890!'
const privatekey = '310d08df73d4bc989ea82a7002ceb6f60896ebc80feeeb80c04b6a27f9b4985e'
const importAddress = '2Dbe588dA70cafe98bd1797119E96165A8E74191'

describe('Wallet Tests...', () => {
    describe('Account', () => {
      beforeEach(() => clear())
      it('Address should be 40 characters', () => {
        let address = create(password)
        assert(address.length > 0 && address.length === 40)
      })
  
      it('cipertext should be 96 characters.', () => {        
        let address = create(password)
        let c = db().get("accounts").find({address: `${address}`}).value().crypto
        assert(address.length > 0 && c.ciphertext.length === 96)
        assert.equal(true, c.cipherparams.iv.length === 32)
        assert.equal(true, c.cipher === 'aes-128-cbc')
        assert.equal(true, c.kdfparams.dklen === 32)
        assert.equal(true, c.kdfparams.c === 262144)
        assert.equal(true, c.kdfparams.prf === 'hmac-sha256')
        assert.equal(true, c.kdfparams.salt.length === 64)
        assert.equal(true, c.mac.length === 64)
      })

      it('should get accounts', () => {
        create(password)
        create(password)
        let accounts = getAccounts()
        assert(accounts.length == 2)
        assert(address[0].length > 0 && address[0].length === 40)
      })
  
      it('should get admin', () => {
        create(password)
        create(password)
        let admin = getAdmin()      
        assert.equal(true, admin == getAccount(0))
        assert.equal(false, admin == getAccount(1))
      })
  
      it('should set admin', () => {
        create(password)
        create(password)
        let admin = getAdmin()
        assert.equal(true, admin == getAccount(0))
        getAdmin(getAccount(1))

        let tmpAdmin = getAdmin()
        assert.equal(true, admin != tmpAdmin)
      })

      it('Admin verify', () => {
        create(password)
        assert.equal(true, adminVerify(getAccount(0), password))
      })

      it('import account', () => {
        let addr = importAccount(privatekey, password)
        assert.equal(true, addr === importAddress)
      })

      it('export account', () => {
        let addr = create(password)
        let status = exportAccount(addr, password, 'privatekey')
        assert.equal(true, status != false)
      })

    })
  })