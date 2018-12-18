const assert = require('assert')
const { transfer, transferFrom } = require('../lib/tx/sendTransaction')

const { Ygg } = require("@yggdrash/sdk")
const ygg = new Ygg(new Ygg.providers.HttpProvider('http://localhost:8080'))
const password = 'Aa1234567890!'
const transferBodyData = []

describe('Transaction Tests...', () => {
  describe('Transction', () => {
    it('transfer body 검증', function () {
			let to = 'aca4215631187ab5b3af0d4c251fdf45c79ad3c6'
			let amount = 1001
      		assert.equal(40, to.length)

			const transfer = ygg.client.transfer(to, amount)
			assert(ygg.utils.isObject(transfer) === true)
			transferBodyData.push(transfer)
		})

		// it('transfer Data 검증', function () {
		// 	assert.equal('transfer', transferData[0].method);
		// 	assert(typeof transferData[0] === "object");
		// 	assert(typeof transferData[0].params === "object");
		// 	assert(transferData[0].params[0].address.length !== 0 && branchData[0].params[0].amount !== 0)
		// 	assert(typeof transferData[0].params[0].address=== "string");
		// 	assert(typeof transferData[0].params[0].amount === "number");
		// })

		// it('Branch Transaction 메서드', function () {
		// 	let timestamp = new Date().getTime();
		// 	let jsonBody = ygg.utils.dataToJson(transferData[0])

		// 	const txHeaderData = {
		// 		"chain":`0x${Buffer.from(branchData[0].params[0].branchId, 'hex').toString('hex')}`,
		// 		"version":`0x0000000000000000`,
		// 		"type":`0x0000000000000000`,
		// 		"timeStamp":`0x${ygg.utils.decimalToHex(timestamp)}`,
		// 		"bodyHash": `0x${ygg.utils.bodyHashHex(jsonBody)}`,
		// 		"bodyLength":`0x${ygg.utils.decimalToHex(jsonBody.length)}`
		// 	};
			
		// 	let tx = new ygg.tx(txHeaderData);
			
		// 	tx.sign(Buffer.from('3D8A58EA7FA6EF7E038791F3B837FA7BC62DC38CAAFE67AFC4D4567A64D4966E', 'hex'));
			
		// 	let serialize = tx.serialize(transferData[0], branchData[0].params[0].branchId);
		// 	assert(ygg.utils.isObject(serialize) === true);
		// 	assert.equal(true, tx.verifySignature());
		// })
  })
})

