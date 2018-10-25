#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const { account,
        getBalance,
        plant, 
        register,
        transferFrom,
        transfer,
        node } = require('../lib/core')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('account.json')
const db = low(adapter)

program
    .version(require('../package').version)
    .usage('<command> [options]')

program
    .command('init')
    .description('Initialize config.json')
    .action(() => {
        console.log('initialize config.json')
    })

program
    .command('account <action>')
    .option('-o, --owner <owner>', 'owner')
    .description('Manage accounts')
    .action((action, cmd) => {
        switch(action) {
            case 'new':
            account.create()
            break
    
            case 'list':  
            account.getAccounts()  
            break
  
            case 'coinbase':  
            cmd.owner ? account.coinbase(cmd.owner) : account.coinbase()
            break

            case 'clear':  
            account.clear()
            break

            default:
            console.log('Not Found Command.')
            break;
        }
    })

program
    .command('stem <action>')
    .option('-o, --owner <owner>', 'owner')
    .option('-s, --seed <seed>', 'seed')
    .option('-n, --net <net>', 'net')
    .option('-b, --branch <branch>', 'branch')
    .description('Plant branch to STEM')
    .action((action, cmd) => {
        if (action === "plant") {
            if(!cmd.owner || !cmd.seed){
                console.log()
                console.log(`  ` + chalk.red(`Unknown command`))
                console.log()
            } else {
                plant(cmd.owner, cmd.seed, cmd.net)
            }
        } else {
            console.log('Not Found Command.')
        }
    })

program
    .command('sendTransaction <action>')
    .option('-b, --branch <branch>', 'branch')
    .option('-f, --from <from>', 'from')
    .option('-t, --to <to>', 'to')
    .option('-v, --value <value>', 'value')
    .option('-n, --net <net>', 'net')
    .description('Manage transaction')
    .action((action, cmd) => {
        if(action === "transferFrom"){
            if (!cmd.branch || !cmd.from || !cmd.to || !cmd.value) {
                console.log()
                console.log(`  ` + chalk.red(`Unknown command`))
                console.log()
            } else {
                transferFrom(cmd.branch, cmd.from, cmd.to, cmd.value, cmd.net)
            }
        } else if(action === "transfer"){
            if (!cmd.branch || !cmd.to || !cmd.value) {
                console.log()
                console.log(`  ` + chalk.red(`Unknown command`))
                console.log()
            } else {
                transfer(cmd.branch, cmd.to, cmd.value, cmd.net)
            }
        }
    })

program
    .command('balanceOf <action>')
    .option('-b, --branch <branch>', 'branch')
    .option('-a, --address <address>', 'address')
    .option('-n, --net <net>', 'net')
    .description('Query Balance')
    .action((action, cmd) => {
        if(action === "yeed"){
            if (!cmd.branch || !cmd.address) {
                console.log()
                console.log(`  ` + chalk.red(`Unknown command`))
                console.log()
            } else {
                getBalance(cmd.branch, cmd.address, cmd.net)
            }
        }
    })

program
    .command('node <action>')
    .option('-p, --port <port>', 'port')
    .option('-l, --log <log>', 'log')
    .option('-n, --net <net>', 'net')
    .description('Node Admin Controller')
    .action((action, cmd) => {
        if(action === "restart"){
            node.restart(cmd.net)
        } else if(action === "setConfig"){
            if (!cmd.port || !cmd.log) {
                console.log()
                console.log(`  ` + chalk.red(`Unknown command`))
                console.log()
            } else {
                node.setConfig(cmd.port, cmd.log, cmd.net)
            }
        } else {
            console.log()
            console.log(`  ` + chalk.red(`Unknown command`))
            console.log()
        }
    })
program
    .command('console')
    .description('Run YGGDRASH console')
    .option('--url <url>', 'Node url')
    .action((cmd) => {
        require('../lib/repl')(cleanArgs(cmd))
    })

// output help information on unknown commands
program
    .arguments('<command>')
    .action(cmd => {
        program.outputHelp()
        console.log()
        console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}`))
        console.log()
    })

program.parse(process.argv)

if(!process.argv.slice(2).length) {
    program.outputHelp()
}

function cleanArgs (cmd) {
    const args = {}
    cmd.options.forEach(o => {
      const key = o.long.replace(/^--/, '')
      // if an option is not present and Command has a method with the same name
      // it should not be copied
      if (typeof cmd[key] !== 'function') {
        args[key] = cmd[key]
      }
    })
    return args
  }
  