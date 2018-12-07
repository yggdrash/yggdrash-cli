
const { 
  nodeBuild,
  start,
  nodeStatus,
  stop,
  nodePri
} = require('../lib/node')

const Yggdrash = require("@yggdrash/sdk")
const ygg = new Yggdrash(new Yggdrash.providers.HttpProvider('http://localhost:8080'))
const password = 'Aa1234567890!'


describe('Node Tests...', () => {
  describe('build', () => {
    
  })
})

