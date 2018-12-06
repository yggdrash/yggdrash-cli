#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const exec = require('child_process').exec
const { db } = require('../lib/db')
const inquirer = require('inquirer')
const { account,
        getBalance,
        transferFrom,
        transfer,
        node,
        branch } = require('../lib/core')

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
    .command('branch <action>')
    .description('Manage branch')
    .action((action) => {
        if (!account.getAccount(0)) {
            console.log(`\n    ` + chalk.red(`You need an account to create a branch. Please create an account.\n`))
            return false
        }

        switch(action) {
            case 'init':
            exec("ls", (error, ls, stderr) => {
                if (ls) {
                    console.log(`\n    ` + chalk.red(`fatal: destination path is not an empty directory.\n`))
                } else {
                    exec("pwd", (error, pwd, stderr) => {
                        let folderName = pwd.split('/').slice(-1)[0].trim()
                        inquirer.prompt([{
                            name: 'name',
                            type: 'input',
                            message: `Branch name: ${chalk.grey(`(${folderName})`)}`,
                          }]).then((answers) => {
                            let symbol = folderName.length > 3 ? folderName.substring(0,3).toUpperCase() : folderName.toUpperCase()
                            inquirer.prompt([{
                                name: 'symbol',
                                type: 'input',
                                message: `Symbol: ${chalk.grey(`(${symbol})`)}`,
                              }, {
                                name: 'property',
                                type: 'list',
                                message: 'Property:',
                                choices: ['currency', 'exchange', 'dex'],
                                default: 0
                              }]).then((answers1) => {
                                  if (answers1.property === 'currency') {
                                    inquirer.prompt([{
                                        name: 'description',
                                        type: 'input',
                                        message: 'Description:'
                                      }, {
                                        name: 'frontier',
                                        type: 'list',
                                        message: 'Select frontier',
                                        choices: db().get("accounts").map("address").value(),
                                        default: 0
                                      }, {
                                        name: 'total_supply',
                                        type: 'input',
                                        message: 'Total Supply:'
                                      }]).then((answers2) => {
                                            var seed
                                            if(answers.name){
                                                let symbol = answers.name.length > 3 ? answers.name.substring(0,3).toUpperCase() : answers.name.toUpperCase()
                                                if (!answers1.symbol) {
                                                    seed = branch.seed(answers.name, 
                                                                        symbol,
                                                                        answers1.property, 
                                                                        answers2.description, 
                                                                        answers2.frontier, 
                                                                        answers2.total_supply)
                                                } else {
                                                    seed = branch.seed(answers.name, 
                                                                        answers1.symbol, 
                                                                        answers1.property, 
                                                                        answers2.description, 
                                                                        answers2.frontier, 
                                                                        answers2.total_supply)
                                                }
                                            } else {
                                                if (!answers1.symbol) {
                                                    seed = branch.seed(folderName, 
                                                                        symbol,
                                                                        answers1.property, 
                                                                        answers2.description, 
                                                                        answers2.frontier, 
                                                                        answers2.total_supply)
                                                } else {
                                                    seed = branch.seed(folderName, 
                                                                        answers1.symbol, 
                                                                        answers1.property, 
                                                                        answers2.description, 
                                                                        answers2.frontier, 
                                                                        answers2.total_supply)
                                                }
                                            }

                                            inquirer.prompt([{
                                                name: 'ok',
                                                type: 'confirm',
                                                message: 'Is this OK?'
                                              }]).then((answers3) => {
                                                  if (answers3.ok) {
                                                    console.log(`\n    ` + chalk.green(`✍️  Cloning into 'contract'...\n`))
                                                    branch.init(seed)
                                                  } else {
                                                    console.log('\nAborted.\n\n')
                                                  }
                                              })
                                      })
                                  } else {
                                    inquirer.prompt([{
                                        name: 'description',
                                        type: 'input',
                                        message: 'Description:',
                                      }]).then((answers2) => {
                                        const seed = branch.seed(answers.name ? answers.name : folderName, 
                                                                 answers1.symbol, 
                                                                 answers1.property, 
                                                                 answers2.description, 
                                                                 answers2.frontier, 
                                                                 answers2.total_supply)
                                        inquirer.prompt([{
                                            name: 'ok',
                                            type: 'confirm',
                                            message: 'Is this OK?',
                                          }]).then((answers3) => {
                                              if (answers3.ok) {
                                                console.log(`\n    ` + chalk.green(`✍️  Cloning into 'contract'...\n`))
                                                branch.init(seed)
                                              } else {
                                                console.log(`\n    ` + chalk.red(`Aborted.\n\n`))
                                              }
                                          })
                                      })
                                  }
                              })
                          })
                    })
                }
            })
            break

            case 'build':
            inquirer.prompt([{
                name: 'owner',
                type: 'list',
                message: 'Select branch owner',
                choices: db().get("accounts").map("address").value(),
                default: 0
              }, {
                name: 'password',
                type: 'password',
                message: 'Password:'
              }]).then((answers) => {
                branch.build(answers.owner, answers.password)
              })
            break

            case 'deploy':
            inquirer.prompt([{
                name: 'network',
                type: 'list',
                message: 'network',
                choices: ['local', 'testnet(not yet)', 'mainnet(not yet)'],
                default: 0
              }]).then((answers) => {
                switch(answers.network) {
                    case 'local':
                    branch.deploy('http://localhost:8080') 
                    break
            
                    case 'testnet':  
                    // branch.deploy('http://testnet.yggdrash.io') 
                    console.log('Not yet')
                    break
          
                    case 'mainnet':  
                    // branch.deploy('http://mainnet.yggdrash.io') 
                    console.log('Not yet')
                    break
        
                    default:
                    console.log(`\n  ` + chalk.red(`Unknown command\n`))
                    break
                }
              })
            break

            case 'list':
            inquirer.prompt([{
                name: 'network',
                type: 'list',
                message: 'network',
                choices: ['Local', 'All'],
                default: 0
              }]).then((answers) => {
                    branch.getBranch(answers.network)
              })
            break
              
            case 'set':
            inquirer.prompt([{
                name: 'network',
                type: 'list',
                message: 'network',
                choices: ['Local', 'Import'],
                default: 0
              }]).then((answers) => {
                if (answers.network === 'Local') {
                    let list = []
                    let symbol = db().get('branches').map('symbol').value()
                    let id = db().get('branches').map('id').value()
                    for (let i in id)  {
                        list[i] = `Symbol: ${symbol[i]}, ID: ${id[i]}`
                    }   
                    inquirer.prompt([{
                        name: 'branch',
                        type: 'list',
                        message: 'branch',
                        choices: list,
                        default: 0
                      }]).then((answers) => {
                            branch.setBranch(answers.branch)
                      })
                } else {
                    const Yggdrash = require("@yggdrash/sdk")
                    let ygg = new Yggdrash(new Yggdrash.providers.HttpProvider("http://localhost:8080"))
                    ygg.client.getBranchId().then(all => {
                        let allList = []
                        inquirer.prompt([{
                            name: 'branch',
                            type: 'list',
                            message: 'branch',
                            choices: [all],
                            default: 0
                          }]).then((answers) => {
                                branch.setBranch(answers.branch)
                          })

                    })
                }
                  
              })
            break
              
            case 'status':
            branch.status()
            break

            case 'help':
            console.log('\nCommands:')
            console.log(`  ` + 'init                      Initialize seed.json')
            console.log(`  ` + 'build                     Create a branch file with seed.json')
            console.log(`  ` + 'deploy                    Deploy to node')
            console.log(`  ` + 'list                      View branch list')
            console.log(`  ` + 'set                       Set branch')
            console.log(`  ` + 'status                    View current branch\n')
            break

            default:
            console.log(`\n  ` + chalk.red(`Unknown command\n`))
            console.log('  Options:')
            console.log(`\n  ` + 'ygg branch help                     output usage information\n')
            break
        }
    })

program
    .command('account <action>')
    .description('Manage accounts')
    .action((action) => {
        switch(action) {
            case 'new':
            account.create()
            break
    
            case 'list':  
            account.getAccounts()  
            break

            case 'import':
            inquirer.prompt([{
                name: 'pk',
                type: 'input',
                message: 'private key(without 0x):'
              }, {
                name: 'password',
                type: 'password',
                message: 'Password:'
              }]).then((answers) => {
                    account.importAccount(answers.pk, answers.password)
              })
            break

            case 'clear':  
            account.clear()
            break

            case 'help':
            console.log('\nCommands:')
            console.log(`  ` + 'new                      Generate new account')
            console.log(`  ` + 'list                     Account list')
            console.log(`  ` + 'import                   Import account')
            console.log(`  ` + 'clear                    Delete all account\n')
            break

            default:
            console.log(`\n  ` + chalk.red(`Unknown command\n`))
            console.log('  Options:')
            console.log(`\n  ` + 'ygg account help                     output usage information\n')
            break
        }
    })

program
    .command('admin <action>')
    .description('Manage admin account')
    .action((action) => {
        switch(action) {
            case 'get':
            account.adminAccount()
            break
    
            case 'set':
            inquirer.prompt([{
                name: 'password',
                type: 'password',
                message: `${chalk.red('Admin password')}`,
              }]).then((answers) => {
                    account.adminVerify(db().get("accounts").map("address").value()[0], answers.password)

                    inquirer.prompt([{
                        name: 'owner',
                        type: 'list',
                        message: 'Candidate admin',
                        choices: db().get("accounts").map("address").value().slice(1),
                        default: 0
                      }, {
                        name: 'password',
                        type: 'password',
                        message: `${chalk.red('Candidate password')}`,
                      }]).then((answers) => {
                        account.adminVerify(answers.owner, answers.password)
                        account.adminAccount(answers.owner)
                      })
              })
            break

            case 'help':
            console.log('\nCommands:')
            console.log(`  ` + 'get                      Current admin account')
            console.log(`  ` + 'set                      Change admin account\n')
            break
  
            default:
            console.log('  Options:')
            console.log(`\n  ` + 'ygg admin help                     output usage information\n')
            break
        }
    })

program
    .command('node <action>')
    .option('-p, --port <port>', 'port')
    .option('-l, --log <log>', 'log')
    .option('-n, --node <node>', 'node')
    .description('Node Admin Controller')
    .action((action, cmd) => {

        if (db().get("accounts").map("address").value()[0] == null) {
            console.log(`\n  ` + `${chalk.red("Please create a admin account.\n")}`)
            return false
        }
        if (action != 'start' 
            && action != 'set' && action != 'build' 
            && action != 'stop' && action != 'status') {
            console.log(`\n  ` + chalk.red(`Unknown command\n`))
            console.log('  Options:')
            console.log(`\n  ` + 'ygg node help                     output usage information')
            return false
        }

        switch (action) {
            case 'status':
            node.status()
            return

            case 'stop':
            node.stop()
            return
        }

        if (!cmd.node) {
            console.log(`\n  ` + chalk.red(`Please enter the node path.`))
            console.log(`  ` + 'ex) ygg node start -n [node path]\n')
            return
        }

        inquirer.prompt([{
            name: 'password',
            type: 'password',
            message: `${chalk.red('Admin password')}`,
          }]).then((answers) => {
                account.adminVerify(db().get("accounts").map("address").value()[0], answers.password)
                switch(action) {
                    case 'start':
                    node.start(cmd.node, answers.password)
                    break
                    
                    case 'set':
                    node.setConfig(cmd.node)
                    break

                    case 'build':
                    node.build(cmd.node)
                    break

                    case 'help':
                    console.log('\nCommands:')
                    console.log(`  ` + 'build                      Node build with admin account')
                    console.log(`  ` + 'start                      Node start with admin account')
                    console.log(`  ` + 'restart                    Node restart with admin account')
                    console.log(`  ` + 'set                        Configutation settings for node\n')
                    break
                }
          })
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
                console.log(`\n  ` + chalk.red(`Unknown command\n`))
                console.log('  Options:')
                console.log(`\n  ` + 'ygg sendTransaction help                     output usage information\n')
            } else {
                plant(cmd.owner, cmd.seed, cmd.net)
            }
        } else {
            console.log(`\n  ` + chalk.red(`Unknown command\n`))
            console.log('  Options:')
            console.log(`\n  ` + 'ygg sendTransaction help                     output usage information\n')
        }
    })

program
    .command('sendTransaction <action>')
    .option('-f, --from <from>', 'from')
    .option('-t, --to <to>', 'to')
    .option('-v, --value <value>', 'value')
    .option('-n, --net <net>', 'net')
    .description('Manage transaction')
    .action((action, cmd) => {

        if (action === 'help') {
            console.log('\nCommands:')
            console.log(` ` + 'transferFrom                   Send the transaction after specifying the account to send')
            console.log(` ` + 'transfer                       Send transaction to default admin account')
            console.log(` ` + 'ex) ygg sendTransaction transfer -t 757649D90145e30b567A1f1B97267198Cde5e96c -v 1000\n')
            return false
        }

        if (!cmd.to || !cmd.value) {
            console.log(`\n  ` + chalk.red(`Unknown command\n`))
            console.log('  Options:')
            console.log(`\n  ` + 'ygg sendTransaction help                     output usage information\n')
            return false
        } 
        
        if (!db().get('currentBranch').value()) {
            console.log(chalk.red(`\nThe current branch is not set.`))
            console.log(`  ` + `use ${chalk.green('ygg branch set')}\n`)
            return false
        }

        switch(action) {
            case 'transferFrom':
            inquirer.prompt([{
                name: 'from',
                type: 'list',
                message: 'Select from address',
                choices: db().get("accounts").map("address").value(),
                default: 0,
                }, {
                name: 'password',
                type: 'password',
                message: 'Password:'
            }]).then((answers) => {
                transferFrom(answers.from, cmd.to, cmd.value, answers.password, cmd.net)
            })
            break

            case 'transfer':
            inquirer.prompt([{
                name: 'password',
                type: 'password',
                message: `${chalk.red('Admin password')}`
            }]).then((answers) => {
                transfer(cmd.to, cmd.value, answers.password, cmd.net)
            })
            break

            default:
            console.log(`\n  ` + chalk.red(`Unknown command\n`))
            console.log(`\n  ` + 'ygg sendTransaction help                     output usage information\n')
            break
        }
    })

program
    .command('balanceOf <action>')
    .option('-n, --net <net>', 'net')
    .description('Query Balance')
    .action((action, cmd) => {
        const Yggdrash = require("@yggdrash/sdk")
        const ygg = new Yggdrash()

        if (!db().get('currentBranch').value()) {
            console.log(chalk.red(`\n  The current branch is not set.`))
            console.log(`\n  ` + `use ${chalk.green('ygg branch set')}\n`)
            return false
        }     
        if (!ygg.utils.isAddress(action)) {
            console.log(`\n  ` + chalk.red(`Invalid address\n`))
            return false
        }   
        if (!action) {
            console.log(`\n  ` + chalk.red(`Please input address\n`))
            console.log('  Commands:')
            console.log(` ` + 'address                   Enter balance address iquired account')
            console.log(` ` + 'ex) ygg balanceOf 757649D90145e30b567A1f1B97267198Cde5e96c\n')
            return false
        } 
        getBalance(action, cmd.net)
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
        console.log(`\n  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}\n`))
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
