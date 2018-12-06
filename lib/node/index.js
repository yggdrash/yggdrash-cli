const { db } = require('../db')
const Yggdrash = require("@yggdrash/sdk")
const Buffer = require('safe-buffer').Buffer
const chalk = require('chalk')
const mkdirp = require('mkdirp')
const getHomePath = require('home-path')
const fs = require('fs')
const { derivation } = require('../crypto')
const exec = require('child_process').exec

/**
 * Build node with admin account
 *
 * @method build
 * @param {String} node (option)
 * @returns {String} 
*/

const nodeBuild = node => {
    console.log('building..')
    console.log('Compiling JAR:$JARFILE')

    exec(`cd ${node};./gradlew -PspringProfiles=prod clean build`, (err, stdout, stderr) =>{
        console.log(err ? err : '')
        console.log(stdout)
    })
    // TODO: log 스트림데이터
}

/**
 * Start node with admin account
 *
 * @method start
 * @param {String} node (option)
 * @returns {String} 
*/

const start = (node, password) => {
    if (fs.existsSync(`${getHomePath}/.yggdrash/cli/pid`)) {
        let pid = fs.readFileSync(`${getHomePath}/.yggdrash/cli/pid`)
        console.log(`\nAlready started. PID: ${pid}`)
        return false
    }

    nodePath = node

    console.log('  YGGDARSH Start')
    console.log('  Started the YGGDRASH node.')
    nodePri(password)
    let adminPath = '/Users/haewonwoo/.yggdrash/cli/keystore/nodePri.key'
    // TODO: node password verify
    
    exec(`cd ${node};java -Dkey.path=${adminPath} -Dkey.password='${password}' -jar yggdrash-gateway/build/libs/yggdrash-gateway.jar & echo $! > ${getHomePath}/.yggdrash/cli/pid &`, (err, stdout, stderr) =>{
        
        // fail remove pid
        console.log(stdout)
    })
    // TODO: log 스트림데이터
    // console.log(test.stdout._events.data)
    
    // TODO: prod
    // exec(`cd ${node};SPRING_PROFILES_ACTIVE=prod ./gradlew`, (err, stdout, stderr) =>{ })
}

/**
 * Restart node with admin account
 *
 * @method restart
 * @param {String} node (option)
 * @returns {String} 
*/

const restart = (node, password) => {
    console.log('  YGGDARSH Restart')
    // let status = 'restart'
    // stop(node, password, status)
    // // start(node, password)
}

/**
 * status node
 *
 * @method status
 * @param {String} node (option)
 * @returns {String} 
*/

const nodeStatus = () => {
    console.log('  YGGDARSH Status')

    if (fs.existsSync(`${getHomePath}/.yggdrash/cli/pid`)) {
        let pid = fs.readFileSync(`${getHomePath}/.yggdrash/cli/pid`, 'utf8')
        console.log(`Pid file: ${Number(pid)} [${getHomePath}/.yggdrash/cli/pid]`)
    } else {
        console.log('  YGGDRASH node is not started.')
    }
}

/**
 * stop node
 *
 * @method stop
 * @param {String} node (option)
 * @returns {String} 
*/

const stop = (node, password, status) => {
    if (fs.existsSync(`${getHomePath}/.yggdrash/cli/pid`)) {
        let pid = fs.readFileSync(`${getHomePath}/.yggdrash/cli/pid`, 'utf8')

        console.log('\n  Stopping the YGGDRASH node.')

        exec(`kill -9 ${Number(pid)}`, () => {
            console.log('  YGGDRASH Stop')
            exec(`rm -rf ${getHomePath}/.yggdrash/cli/pid`, err => {
                console.log(err ? err : '')
                status === 'restart' ? start(node, password): ''
            })
        })
    } else {
        console.log('  No pid file. Already stopped?')
    }
}

/**
 * Change node configuration settings
 *
 * @method setConfig
 * @param {String} port
 * @param {String} log
 * @param {String} net (option)
 * @returns {String} 
*/

const setConfig = (port, log, node) => {
    // nodePri()
    console.log('Not yet')
}

const nodePri = password => {
    let ygg = new Yggdrash()
    mkdirp.sync(`${getHomePath}/.yggdrash/cli/keystore/`)
    let address = db().get("accounts").map("address").value()[0]
    let encryptedKey = db().get("accounts").find({address: `${address}`}).value().encryptedKey
    let iv = db().get("accounts").find({address: `${address}`}).value().iv
    let kdfParams = db().get("accounts").find({address: `${address}`}).value().kdfParams

    let priKey = {
                    address: address,
                    crypto: {
                        cipher: 'aes-128-cbc',
                        cipherparams: {
                            iv: iv
                        },
                        ciphertext: encryptedKey,
                        kdf: 'pbkdf2',
                        kdfparams: kdfParams,
                        mac: ygg.utils.keccak(Buffer.concat([derivation(password, kdfParams).slice(16, 32), Buffer.from(encryptedKey, 'hex')])).toString('hex')
                    }
                 }
                 
    if (fs.existsSync(`${getHomePath}/.yggdrash/cli/keystore/nodePri.key`)) {
        return
    }

    fs.writeFileSync(`${getHomePath}/.yggdrash/cli/keystore/nodePri.key`,
    JSON.stringify(priKey, undefined, '\t'), err => { if (err) throw err; })
    exec(`chmod 400 ${getHomePath}/.yggdrash/keystore/nodePri.key`, () =>{})
    
    return priKey
 }

 module.exports = {
    nodeBuild,
    start,
    restart,
    nodeStatus,
    stop,
    setConfig
}