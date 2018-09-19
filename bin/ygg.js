#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const { actionCreateAccount, 
        actionPlant, 
        register } = require('../lib/core')
const { fromPrivateKey } = require('../lib/wallet')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('account.json')
const db = low(adapter)
db.defaults({ accounts: [], principals:[] })
  .write()

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
    .description('Manage accounts')
    .action((action) => {
        switch(action) {
            case 'new':
            const pk = actionCreateAccount();
            const account = fromPrivateKey(pk);
            const address = account.getAddressString();
            db.get('accounts').push({
                address: address
            }).write()
            db.get('principals').push({
                address:address,
                EncryptedKey:pk.toString('hex')
            }).write()
            console.log(`  ` + `Address - ${chalk.green(address)}`)
            break
    
            case 'list':  
            db.get("accounts").map("address").value().map(addr => {
                console.log(addr)            
            });    
            break
  
            default:
            console.log('Not Found Command.')
            break;
        }
    })

program
    .command('plant <action>')
    .arguments('<cmd> [env]')
    .description('Plant branch')
    .action((action, cmd) => {
        if (cmd) {
            var Break = new Error('Break')
            try {
                db.get("accounts").map("address").value().map(addr => {
                    if(addr === action){
                        let privatekeyEncryptedKey = db.get("principals").find({address:action}).value().EncryptedKey
                        actionPlant(privatekeyEncryptedKey, cmd)
                        throw Break;
                    }
                });
            } catch (e) {
                if (e!== Break) throw Break;
            }  
        } else {
            console.log('Not Found Command.')
        }
    })

program
    .command('register <action>')
    .description('Register branch')
    .action((action) => {
        register(action)
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
  