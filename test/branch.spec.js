const assert = require('assert');
const { build } = require('../lib/branch/build')
const { config } = require('../lib/branch/config')
const { deploy } = require('../lib/branch/deploy')
const { init } = require('../lib/branch/init')

const Yggdrash = require("@yggdrash/sdk")
const ygg = new Yggdrash(new Yggdrash.providers.HttpProvider('http://localhost:8080'))
const password = 'Aa1234567890!'


describe('Branch Tests...', () => {
  describe('init', () => {


  })
})

