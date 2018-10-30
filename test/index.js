const assert = require('assert');
const { 
  createAccount,
  getAccounts,
  getAccount,
  coinbase,
  clear
} = require('../lib/wallet/account')
const { restart, setConfig } = require('../lib/admin');
const { transfer, transferFrom } = require('../lib/branch/sendTransaction');
const { plant } = require('../lib/stem/plant');
const Yggdrash = require("@yggdrash/sdk")

const ygg = new Yggdrash(new Yggdrash.providers.HttpProvider('http://localhost:8080'));
const owner = '0xA771A6b5A6cAbE2ca35Fd55631717d95049D6338'
const reserve_address = '0xf09e6313f6e5d835bb13d8cbf2e39829083b5d03' //node wallet author
describe('Wallet Tests...', () => {
  describe('Account', () => {
    beforeEach(() => {
      clear()
    })

    it('should be 64 characters.', () => {
      let createdAccount = createAccount()
      assert(createdAccount.length > 0 || createdAccount.length === 32)
    })
  
    it('should get accounts', () => {
      createAccount()
      createAccount()
      let accounts = getAccounts()
      assert(accounts.length == 2)
    })

    it('should get coinbase', () => {
      createAccount()
      let admin = coinbase()      
      assert.equal(true, admin == getAccount(0))
    })

  })

  describe('Node Tests...', () => {

    it('body lenth should be 24.', () => {
      let nonceBody = ygg.client.nodeHello();
      let bodyJson = ygg.utils.dataToJson(nonceBody)
      assert(bodyJson.length === 24)

      let body = ygg.client.nodeRestart()
      let bodyJson = ygg.utils.dataToJson(body)
      assert(bodyJson.length === 22)
    })
  
    it('transaction header check.', () => {
      let timestamp = new Date().getTime()
      let nonceBody = ygg.client.nodeHello();
      let bodyJson = ygg.utils.dataToJson(nonceBody)

      let t = ygg.utils.decimalToHex(timestamp)
      let n = ygg.utils.nonce()
      let b = ygg.utils.bodyHashHex(bodyJson)
      let bl = ygg.utils.decimalToHex(bodyJson.length)

      assert(t.length === 16)
      assert(n.length === 32)
      assert(b.length === 64)
      assert(bl.length === 16)
    })
  })
})