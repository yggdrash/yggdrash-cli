# YGGDRASH CLI
YGGDRASH CLI allows you to communicate with a remote or local node and carry out YGGDRASH-related functionality using an interactive or non-interactive command line tool.

## Requirements
- Node.js - version 10.12.0
- NPM
- [YGGDRASH Node](https://github.com/yggdrash/yggdrash)

## Installation
```sh
$ npm install -g @yggdrash/cli
```

## Method
### Wallet
- create - Generate account
- getAccounts - Account list
- getAccount - View specific account
- coinbase - admin account
- clear - clear account

### Node Control
- restart
- setConfig

### STEM
- plant - Generate branch.json file & Transactions that register a branch with the stem

### Branch
- transfer - Coin transfer
- transferFrom - Coin transfer
- getBalance - Account Balance Display


## Usage
### Interactive use
```
$ ygg console
                           __                __
    __  ______ _____ _____/ /________ ______/ /_
   / / / / __ `/ __ `/ __  / ___/ __ `/ ___/ __ \
  / /_/ / /_/ / /_/ / /_/ / /  / /_/ (__  ) / / /
  \__, /\__, /\__, /\__,_/_/   \__,_/____/_/ /_/
 /____//____//____/

ygg> 
```

## Wallet
### create
```
ygg> ygg.account.create()
```

#### Returns
```
Address - 0x4349f9965c6b488f2b17a62bfdd90aba6167a2f3
```

### coinbase
```
ygg> ygg.account.coinbase()
```

- option - owner update (address)
```
ygg> ygg.account.coinbase(owner)
```

#### Returns
```
Address - 0x09a73e44b8195d5057d05386527406dbb34a468b
```

### getAccounts
```
ygg> ygg.account.getAccounts()
```

#### Returns
```
0x09a73e44b8195d5057d05386527406dbb34a468b
0xc8d19bf9f999eae06a71da8c17000206ef463f39
0x2923379d13d6d56db59fc8b615218b023e634752
...
```

### getAccount
```
ygg> ygg.account.getAccount(0)
```

#### Returns
```
0x09a73e44b8195d5057d05386527406dbb34a468b
```

### clear
```
ygg> ygg.account.clear()
```

## Node Control
### restart
```
ygg> ygg.node.restart()
```
#### Returns
nonce
```
09a73e44b8195d50
```

#### setConfig
- default network - localhost
- option - port
         - log
```
ygg> ygg.node.setConfig(port,  log)
```
#### Returns
nonce
```
527406dbb34a468b
```
#### Example
```
ygg> ygg.node.setConfig(32191,  "info")
or
ygg> ygg.node.setConfig(32191,  "info", "testnet.yggdrash.io")
```




## STEM

### Transaction - plant
- default network - localhost
```
ygg> ygg.plant(ownerAddress, seedFile)
or
ygg> ygg.plant(ownerAddress, seedFile, network)
```

#### Returns
```
  /Users/homedir/yggdrash-cli/seed/tedy.branch.json saved.
  CREATOR - 0x09a73e44b8195d5057d05386527406dbb34a468b
  Branch Name - yeed
  Branch Symbol - YEED
  Branch type - immunity
  Branch Property- ecosystem
  Branch Description- The Basis of the YGGDRASH Ecosystem. It is also an aggregate and a blockchain containing information of all Branch Chains.
  ...
  Branch Version 0xcc9612ff91ff844938acdb6608e58506a2f21b8a5d77e88726c0897e8d1d02c0

  ==> Branch ID : 35128756b44e72b3a6144c13e9e252d05d7df30d
  ==> Transaction ID : 4a51d99f4700331850239f581810c83d9047595b8113494a260ffec14ca0fe7a
```
#### Example
```
ygg> ygg.plant("0x09a73e44b8195d5057d05386527406dbb34a468b", "/Users/homedir/yggdrash-cli/seed/yeed.seed.json")
or
ygg> ygg.plant("0x09a73e44b8195d5057d05386527406dbb34a468b", "/Users/homedir/yggdrash-cli/seed/yeed.seed.json", "testnet.yggdrash.io")
```


## Branch
### Transaction - transfer
- default network - localhost
- transfer default account - coinbase
```
ygg> ygg.transfer([branch id], [to address], [value])
```
#### Returns
```
TX ID : 4a51d99f4700331850239f581810c83d9047595b8113494a260ffec14ca0fe7a
```

#### Example
```
ygg> ygg.transfer('186c70234e90406ff94eebd32edb9789346104a0', ygg.getAccount(0), 1000)
or
ygg> ygg.transfer('186c70234e90406ff94eebd32edb9789346104a0', ygg.getAccount(0), 1000, "testnet.yggdrash.io")
```

### Transaction - transferFrom
- default network - localhost
```
ygg> ygg.transferFrom([branch id], [from address], [to address], [value])
or
ygg> ygg.transferFrom([branch id], [from address], [to address], [value], [network])
```

#### Returns
```
TX ID : 4a51d99f4700331850239f581810c83d9047595b8113494a260ffec14ca0fe7a
```

#### Example
```
ygg> ygg.transferFrom('186c70234e90406ff94eebd32edb9789346104a0', '0xaca4215631187ab5b3af0d4c251fdf45c79ad3c6', ygg.getAccount(0), 1000)
or
ygg> ygg.transferFrom('186c70234e90406ff94eebd32edb9789346104a0', '0xaca4215631187ab5b3af0d4c251fdf45c79ad3c6', ygg.getAccount(0), 1000, "testnet.yggdrash.io")
```

### getBalance
```
ygg> ygg.getBalance([branch id], [address])
```

#### Returns
```
Balance : 999000000
```

#### Example
```
ygg> ygg.getBalance('186c70234e90406ff94eebd32edb9789346104a0', '0xaca4215631187ab5b3af0d4c251fdf45c79ad3c6')
```


## Non-Interactive use
```
$ ygg <command> [options]
```

#### Example
## Wallet
### create account
```
$ ygg account new
```

### coinbase
```
$ ygg account coinbase
```

- option -o : owner (owner update - address)
```
$ ygg account coinbase -o 0x09a73e44b8195d5057d05386527406dbb34a468b
```

### Account list
```
$ ygg account list
```

### clear
```
$ ygg account clear
```

## Node Control
### Restart
- default network - localhost
- default sign account(admin account) - ygg.coinbase()
```
$ ygg node restart
```

### Set config
- default network - localhost
- default sign account(admin account) - ygg.coinbase()
- option - p : port
         - l : log
         - n : network

```
$ ygg node setconfig -p 32921 -l info
```

## Stem Transaction
### Generate branch.json file & Transaction that register a branch with the stem
- default network - localhost
- option - o : owner
         - s : seed.json file
         - n : network

```
$ ygg stem plant --owner 0xaca4215631187ab5b3af0d4c251fdf45c79ad3c6 --seed /Users/homedir/yggdrash-cli/seed/yeed.seed.json
or
$ ygg stem plant -o 0xaca4215631187ab5b3af0d4c251fdf45c79ad3c6 -s /Users/homedir/yggdrash-cli/seed/yeed.seed.json -n testnet.yggdrash.io
```

## Branch Transaction
### Transfer Branch
- default network - localhost
- option - b : branch id
         - f : from address
         - t : to address
         - v : value
         - n : network
         
```
$ ygg sendTransaction transferFrom --branch 3f5d7163fc703dee829f4a47640e8acedf0986ac --from 0x09a73e44b8195d5057d05386527406dbb34a468b --to 0x60212061e7bf6fba4b0607fc9c1f8bbb930d87d0 --value 1000
or
$ ygg sendTransaction transferFrom -b 3f5d7163fc703dee829f4a47640e8acedf0986ac -f 0x09a73e44b8195d5057d05386527406dbb34a468b -t 0x60212061e7bf6fba4b0607fc9c1f8bbb930d87d0 -v 1000 -n testnet.yggdrash.io
```

```
$ ygg sendTransaction transfer --branch 3f5d7163fc703dee829f4a47640e8acedf0986ac --to 0x60212061e7bf6fba4b0607fc9c1f8bbb930d87d0 --value 1000
```

### getBalance
- default network - localhost
- option - b : branch id
         - a : address
         - n : network
```
$ ygg balanceOf yeed -branch 0a39170899bd7e721730c7c312afc154d784034b -adress 0xaca4215631187ab5b3af0d4c251fdf45c79ad3c6
or
$ ygg balanceOf yeed -b 0a39170899bd7e721730c7c312afc154d784034b -a 0xaca4215631187ab5b3af0d4c251fdf45c79ad3c6 n testnet.yggdrash.io
```

## License
This project is licensed under the [MIT License](LICENSE).
