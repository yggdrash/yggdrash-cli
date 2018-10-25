const assert = require('assert');
const { 
  createAccount,
  getAccounts,
  accountClear,
} = require('../lib/wallet/account')

describe('Wallet Tests...', () => {
  describe('Account', () => {
    beforeEach(() => {
      clear()
    })

    it('should be 64 characters.', () => {
      let createdAccount = createAccount()
      assert(createdAccount.length > 0)
    })
  
    it('should get accounts', () => {
      createAccount()
      createAccount()
      let accounts = getAccounts()
      assert(accounts.length == 2)
    })
  })
})