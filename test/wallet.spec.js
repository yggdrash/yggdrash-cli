const assert = require('assert');
const { 
  create,
  getAccounts,
  getAccount,
  adminAccount,
  adminVerify,
  clear
} = require('../lib/wallet/account')


const Yggdrash = require("@yggdrash/sdk")
const ygg = new Yggdrash()
const password = 'Aa1234567890!'

describe('Wallet Tests...', () => {
    describe('Account', () => {
      beforeEach(() => {
        clear()
      })
  
      it('should be 64 characters.', () => {
        let address = create(password)
        assert(address.length > 0 && address.length === 40)
      })
    
      it('should get accounts', () => {
        create(password)
        create(password)
        let accounts = getAccounts()
        assert(accounts.length == 2)
      })
  
      it('should get admin', () => {
        create(password)
        let admin = adminAccount()      
        assert.equal(true, admin == getAccount(0))
      })
  
      it('Admin verify', () => {
        create(password)
        let admin = adminAccount()      
        assert.equal(true, admin == getAccount(0))
      })
    })
  })