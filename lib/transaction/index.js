// 'use strict'
const yggUtil = require('../../utils')
const BN = yggUtil.BN
const { sha3 } = require('../../utils')

// secp256k1n/2
const N_DIV_2 = new BN('7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0', 16)
var headerHash = ""
/**
 * Creates a new transaction object.
 *
 * @example
 * let txHeaderData = {
      "chain":`0x${chain}`,
      "version":`0x${version}`,
      "type":`0x${type}`,
      "timeStamp":`0x${timestamp}`,
      "bodyHashHex":`0x${bodyHashHex}`,
      "bodyLength":`0x${bodyLengthHex}`
    };
 * var tx = new Transaction(rawTx);
 *
 * @class
 * @param {Buffer | Array | Object} data a transaction can be initiailized with either a buffer containing the RLP serialized transaction or an array of buffers relating to each of the tx Properties, listed in order below in the exmple.
 *
 * Or lastly an Object containing the Properties of the transaction like in the Usage example.
 *
 * For Object and Arrays each of the elements can either be a Buffer, a hex-prefixed (0x) String , Number, or an object with a toBuffer method such as Bignum
 *
 * @property {Buffer} raw The raw rlp encoded transaction
 * @param {Buffer} data.chain branch ID
 * @param {Buffer} data.version this brnach version
 * @param {Buffer} data.type this branch type
 * @param {Buffer} data.timeStamp timestamp
 * @param {Buffer} data.bodyHashHex body hash to sha3 
 * @param {Buffer} data.bodyLength body length
 * @param {Buffer} data.v EC signature parameter
 * @param {Buffer} data.r EC signature parameter
 * @param {Buffer} data.s EC recovery ID
 * */

class Transaction {
  constructor (data) {
    data = data || {}
    // Define Properties
    const fields = [{
      name: 'chain',
      allowZero: true,
      length: 20,
      default: new Buffer([])
    }, {
      name: 'version',
      length: 8,
      allowZero: true,
      default: new Buffer([])
    }, {
      name: 'type',
      length: 8,
      allowZero: true,
      default: new Buffer([])
    }, {
      name: 'timeStamp',
      length: 8,
      allowZero: true,
      default: new Buffer([])
    }, {
      name: 'bodyHashHex',
      length: 32,
      allowLess: true,
      default: new Buffer([])
    }, {
      name: 'bodyLength',
      length: 8,
      allowZero: true,
      default: new Buffer([])
    }, {
      name: 'v',
      allowZero: true,
      default: new Buffer([0x1c])
    }, {
      name: 'r',
      length: 32,
      allowZero: true,
      allowLess: true,
      default: new Buffer([])
    }, {
      name: 's',
      length: 32,
      allowZero: true,
      allowLess: true,
      default: new Buffer([])
    }]

    /**
     * Returns the rlp encoding of the transaction
     * @method serialize
     * @return {Buffer}
     * @memberof Transaction
     * @name serialize
     */
    // attached serialize
    yggUtil.defineProperties(this, fields, data)

    /**
     * @property {Buffer} from (read only) sender address of this transaction, mathematically derived from other parameters.
     * @name from
     * @memberof Transaction
     */
    Object.defineProperty(this, 'from', {
      enumerable: true,
      configurable: true,
      get: this.getSenderAddress.bind(this)
    })

    this._homestead = true
  }

  /**
   * Computes a sha3-256 hash of the serialized tx
   * @param {Boolean} [includeSignature=true] whether or not to inculde the signature
   * @return {Buffer}
   */
  hash (includeSignature) {
    if (includeSignature === undefined) includeSignature = true

    let items
    let item = ""

    if (includeSignature) {
      items = this.raw
    } else {
      items = this.raw.slice(0, 6)
    }
    for(let i=0; i<items.length; i++){
      item += items[i].toString("hex")
    }
    let itemResult = Buffer.from(item, 'hex')
    headerHash = item;
    return sha3(itemResult)
  }

  headerHash () {
    return headerHash
  }

  /**
   * serialize signature
   * @return {hex string}
   */
  vrs (signature) {
    return this.v.toString('hex')
            + signature.r.toString("hex") + signature.s.toString("hex");
   }

   /**
   * serialize signature
   * @return {hex string}
   */
  getTxHash (signature) {
    const txHash = this.headerHash() + this.vrs(signature)
    return sha3(Buffer.from(txHash, 'hex')).toString("hex");
   }
   

  /**
   * returns the sender's address
   * @return {Buffer}
   */
  getSenderAddress () {
    if (this._from) {
      return this._from
    }
    const pubkey = this.getSenderPublicKey()
    this._from = yggUtil.publicToAddress(pubkey)
    return this._from
  }

  /**
   * returns the public key of the sender
   * @return {Buffer}
   */
  getSenderPublicKey () {
    if (!this._senderPubKey || !this._senderPubKey.length) {
      if (!this.verifySignature()) throw new Error('Invalid Signature')
    }
    return this._senderPubKey
  }

  /**
   * Determines if the signature is valid
   * @return {Boolean}
   */
  verifySignature () {
    const msgHash = this.hash(false)
    // All transaction signatures whose s-value is greater than secp256k1n/2 are considered invalid.
    if (this._homestead && new BN(this.s).cmp(N_DIV_2) === 1) {
      return false
    }

    try {
      let v = yggUtil.bufferToInt(this.v)
      this._senderPubKey = yggUtil.ecrecover(msgHash, v, this.r, this.s)
    } catch (e) {
      return false
    }

    return !!this._senderPubKey
  }

  /**
   * sign a transaction with a given a private key
   * @param {Buffer} privateKey
   */
  sign (privateKey) {
    const msgHash = this.hash(false)
    const sig = yggUtil.ecsign(msgHash, privateKey)
    Object.assign(this, sig)
    return sig
  }
  /**
   * the up front amount that an account must have for this transaction to be valid
   * @return {BN}
   */
  getUpfrontCost () {
    return new BN(this.value)
  }

  /**
   * validates the signature and checks to see if it has enough gas
   * @param {Boolean} [stringError=false] whether to return a string with a dscription of why the validation failed or return a Bloolean
   * @return {Boolean|String}
   */
  validate (stringError) {
    const errors = []
    if (!this.verifySignature()) {
      errors.push('Invalid Signature')
    }

    if (stringError === undefined || stringError === false) {
      return errors.length === 0
    } else {
      return errors.join(' ')
    }
  }
}

module.exports = Transaction
