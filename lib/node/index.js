const { db } = require('../db')
const mkdirp = require('mkdirp')
const getHomePath = require('home-path')
const fs = require('fs')
const exec = require('child_process').exec
const { adminVerify } = require('../wallet/account')
const { Transaction, Ygg } = require('@yggdrash/sdk')

/**
 * Build node with admin account
 *
 * @method build
 * @param {String} node (option)
 * @returns {String} 
*/

const nodeBuild = nodePath => {
    // TODO: log 스트림데이터
    if (nodePath) {
        db().defaults({ node: [] }).write()
        let tmp = db().get("node").map("path").value()[0]
        if (!tmp) {
            db().get('node').push({
                path: nodePath
            }).write()
        } else if (tmp !== nodePath) {
            db().get("node").find({path: tmp}).assign({path: nodePath}).write()
        }
    }

    console.log('building..')

    if (nodePath) {
        console.log(`Compiling ${nodePath} JAR:$JARFILE`)
        exec(`cd ${nodePath};./gradlew -PspringProfiles=prod clean build`, (err, stdout, stderr) =>{
            console.log(err ? err : 'Succecc Build')
            console.log(stdout)
        })
        return
    }

    console.log(`Compiling ${getHomePath}/.yggdrash/cli/yggdrash JAR:$JARFILE`)
    if (fs.existsSync(`${getHomePath}/.yggdrash/cli/yggdrash`)) {
        exec(`cd ~/.yggdrash/cli/yggdrash;./gradlew -PspringProfiles=prod clean build`, (err, stdout, stderr) =>{
            console.log(err ? err : 'Succecc Build')
            console.log(stdout)
        })
        return
    }

    exec("cd ~/.yggdrash/cli;git clone git@github.com:yggdrash/yggdrash.git", (error, stdout, stderr) => {
        console.log(stderr)
        if (!error) {
            exec(`cd ~/.yggdrash/cli/yggdrash;./gradlew -PspringProfiles=prod clean build`, (err, stdout, stderr) =>{
                console.log(stdout)
                console.log(err ? err : 'Succecc Build')
            })
        }
    })
}
/**
 * Start node with admin account
 *
 * @method start
 * @param {String} node (option)
 * @returns {String} 
*/

const start = (password, node, ygg) => {
    adminVerify(db().get("accounts").map("address").value()[0], password, ygg)
    // TODO: log 스트림데이터
    // exec(`cd ${node};SPRING_PROFILES_ACTIVE=prod ./gradlew`, (err, stdout, stderr) =>{ })
    let defaultPath = `${getHomePath}/.yggdrash/cli/keystore/nodePri.key`

    if (fs.existsSync(`${getHomePath}/.yggdrash/cli/pid`)) {
        let pid = fs.readFileSync(`${getHomePath}/.yggdrash/cli/pid`)
        console.log(`\nAlready started. PID: ${pid}`)
        return false
    }

    console.log('  YGGDARSH Start')
    console.log('  Started the YGGDRASH node.')
    nodePri()
    
    if (node) {
        exec(`cd ${node};java --spring.profiles.active=prod  -Dkey.path=${defaultPath} -Dkey.password='${password}' -jar yggdrash-gateway/build/libs/yggdrash-gateway.jar & echo $! > ${getHomePath}/.yggdrash/cli/pid &`, (err, stdout, stderr) =>{
            console.log(stdout)
        })
    } else {
        exec(`cd ~/.yggdrash/cli/yggdrash;java --spring.profiles.active=prod  -Dkey.path=${defaultPath} -Dkey.password='${password}' -jar yggdrash-gateway/build/libs/yggdrash-gateway.jar & echo $! > ${getHomePath}/.yggdrash/cli/pid &`, (err, stdout, stderr) =>{
            console.log(stdout)
        })
    }
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
    console.log('\n  YGGDARSH Status')

    let path = db().get("node").map("path").value()[0]
    let defaltpath = `${getHomePath}/.yggdrash/cli/yggdrash`

    if (fs.existsSync(`${getHomePath}/.yggdrash/cli/pid`)) {
        let pid = fs.readFileSync(`${getHomePath}/.yggdrash/cli/pid`, 'utf8')
        console.log(`\n  Pid file: ${Number(pid)} ${getHomePath}/.yggdrash/cli/pid`)
        console.log(`  node path: ${path ? path : defaltpath}\n`)
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
        let path = db().get("node").map("path").value()[0]
        db().get("node").remove({path:path}).write()

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

const nodePri = () => {
    mkdirp.sync(`${getHomePath}/.yggdrash/cli/keystore/`)
    let address = db().get("accounts").map("address").value()[0]
    let crypto = db().get("accounts").find({address: `${address}`}).value().crypto

    let priKey = { address: address, crypto: crypto }

    if (fs.existsSync(`${getHomePath}/.yggdrash/cli/keystore/nodePri.key`)) {
        let admin = JSON.parse(fs.readFileSync(`${getHomePath}/.yggdrash/cli/keystore/nodePri.key`, 'utf8'))
        if (admin.address === address) {
            return
        }
    }
    exec(`rm -rf ${getHomePath}/.yggdrash/cli/keystore/nodePri.key`, () =>{
        fs.writeFileSync(`${getHomePath}/.yggdrash/cli/keystore/nodePri.key`,
        JSON.stringify(priKey, undefined, '\t'), err => { if (err) throw err; })
        exec(`chmod 400 ${getHomePath}/.yggdrash/cli/keystore/nodePri.key`, () =>{})
    })

    return priKey
 }

const remoteSet = async(url) => {
    db().defaults({remote:{address:"",branch:""}}).write()
    db().get('remote').set("address",url).write()
    let ygg = new Ygg(new Ygg.providers.HttpProvider(url))
    let response = await ygg.client.getBranches()
    db().get('remote').set("branch",response).write()
    console.log("remote Address is "+url)
    return
}

const remoteStatus = async () => {
    let remote = db().get('remote').value()
    console.log(remote)
    return
}

 module.exports = {
    nodeBuild,
    start,
    restart,
    nodeStatus,
    stop,
    setConfig,
    remoteSet,
    remoteStatus
}