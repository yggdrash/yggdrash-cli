const assert = require('assert')
const { transfer, transferFrom } = require('../lib/tx/sendTransaction')

const { Ygg } = require("@yggdrash/sdk")
const ygg = new Ygg(new Ygg.providers.HttpProvider('http://localhost:8080'))
const privateKey = '310d08df73d4bc989ea82a7002ceb6f60896ebc80feeeb80c04b6a27f9b4985e'
const transferBodyData = []

const dummy = {
	chain: '0x91b29a1453258d72ca6fbbcabb8dca10cca944fb',
	version:`0x0000000000000000`,
	type:`0x0000000000000000`,
	timeStamp:`0x00000167cee55f1d`,
	bodyHash: `0x6ac15750baef0875fde93f93f02ff2acc70272139eb1acd0f2857fb972d3b838`,
	bodyLength:`0x0000000000000060`
}

describe('Transaction Tests...', () => {
  describe('Transction', () => {
		it('transfer body 검증', function () {
			let to = 'aca4215631187ab5b3af0d4c251fdf45c79ad3c6'
			let amount = 1001
			assert.equal(40, to.length)

			const body = ygg.client.transferBody(to, amount)
			assert(ygg.utils.isString(body) === true)
			transferBodyData.push(body)
		})

		it('transfer Data type 검증', function () {
			let body = JSON.parse(transferBodyData[0])
			assert.equal('transfer', body[0].method);
			assert(typeof body[0].params === "object");
			assert(typeof body[0].params.to=== "string");
			assert(typeof body[0].params.amount === "number");
		})

		it('new Transaction()', function () {
			let tx = new ygg.tx(dummy);
			assert(ygg.utils.isObject(tx) === true)
			tx.sign(privateKey)
			let serialize = tx.serialize(transferBodyData)
			assert(ygg.utils.isObject(serialize) === true)
			assert.equal(true, tx.verifySignature())
		})
  })
})

