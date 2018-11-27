#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const exec = require('child_process').exec
const { db } = require('../lib/db')
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
    .description('create branch')
    .action((action) => {
        if (!account.getAccount(0)) {
            console.log()
            console.log(`    ` + chalk.red(`You need an account to create a branch. Please create an account.`))
            console.log()
            return false
        }

        const inquirer = require('inquirer')
        switch(action) {
            case 'init':
            exec("ls", (error, ls, stderr) => {
                if (ls) {
                    console.log()
                    console.log(`    ` + chalk.red(`fatal: destination path is not an empty directory.`))
                    console.log()
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
                                                    console.log()
                                                    console.log(`    ` + chalk.green(`✍️  Cloning into 'contract'...`))
                                                    console.log()
                                                    branch.init(seed)
                                                  } else {
                                                    console.log()
                                                    console.log('Aborted.')
                                                    console.log()
                                                    console.log()
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
                                                console.log()
                                                console.log(`    ` + chalk.green(`✍️  Cloning into 'contract'...`))
                                                console.log()
                                                branch.init(seed)
                                              } else {
                                                console.log()
                                                console.log(`    ` + chalk.red(`Aborted.`))
                                                console.log()
                                                console.log()
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
                    console.log('Not Found Command.')
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
                    inquirer.prompt([{
                        name: 'branch',
                        type: 'input',
                        message: 'branch:'
                      }]).then((answers) => {
                            branch.setBranch(answers.branch)
                      })
                }
                  
              })
            break
              
            case 'status':
                branch.status()
            break

            default:
            console.log('Not Found Command.')
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
            const inquirer = require('inquirer')
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

            default:
            console.log('Not Found Command.')
            break
        }
    })

program
    .command('admin <action>')
    .description('Manage accounts')
    .action((action) => {
        switch(action) {
            case 'new':
            account.create()
            break
    
            case 'list':  
            account.getAccounts()  
            break
  
            default:
            console.log('Not Found Command.')
            break
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
    .option('-f, --from <from>', 'from')
    .option('-t, --to <to>', 'to')
    .option('-v, --value <value>', 'value')
    .option('-n, --net <net>', 'net')
    .description('Manage transaction')
    .action((action, cmd) => {
        if (!cmd.to || !cmd.value) {
            console.log()
            console.log(`  ` + chalk.red(`Unknown command`))
            console.log()
            return false
        } 
        if (!db().get('currentBranch').value()) {
            console.log()
            console.log(chalk.red(`The current branch is not set.`))
            console.log(`  ` + `use ${chalk.green('ygg branch set')}`)
            console.log()
            return false
        }
        const inquirer = require('inquirer')
        if(action === "transferFrom"){
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
        } else if(action === "transfer"){
            inquirer.prompt([{
                name: 'password',
                type: 'password',
                message: 'Password:'
            }]).then((answers) => {
                transfer(cmd.to, cmd.value, answers.password, cmd.net)
            })
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
            console.log()
            console.log(chalk.red(`The current branch is not set.`))
            console.log(`  ` + `use ${chalk.green('ygg branch set')}`)
            console.log()
            return false
        }     
        if (!ygg.utils.isAddress(action)) {
            console.log()
            console.log(`  ` + chalk.red(`Invalid address`))
            console.log()
            return false
        }   
        if (!action) {
            console.log()
            console.log(`  ` + chalk.red(`Please input address`))
            console.log()
            return false
        } 
        getBalance(action, cmd.net)
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
  