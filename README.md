# YGGDRASH CLI
YGGDRASH CLI allows you to communicate with a remote or local node and carry out YGGDRASH-related functionality using an interactive or non-interactive command line tool.

## Requirements
- Node.js
- NPM
- [YGGDRASH Node](https://github.com/yggdrash/yggdrash)

## Installation
```sh
$ npm install -g @yggdrash/cli
```

## Method
### Wallet
- createAccount - Generate account
- getAccounts - Account list
- getAccount - View specific account

### STEM
- plant - Generate branch.json file
- register - Transactions that register a branch with the stem

### Coin
- fromTransfer - Coin transfer
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
### createAccount
```
ygg> ygg.createAccount()
```

#### Returns
```
Address - 0x4349f9965c6b488f2b17a62bfdd90aba6167a2f3
```

### getAccounts
```
ygg> ygg.getAccounts()
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
ygg> ygg.getAccount(0)
```

#### Returns
```
0x09a73e44b8195d5057d05386527406dbb34a468b
```


## STEM

### plant
```
ygg> ygg.plant(ownerAddress, seedFile)
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
```
#### Example
```
ygg> ygg.plant("0x09a73e44b8195d5057d05386527406dbb34a468b", "/Users/homedir/yggdrash-cli/seed/yeed.seed.json")
```

### register
- defalt network - localhost
```
ygg> ygg.register(branch.json file)
or
ygg> ygg.register(branch.json file, network option)
```

#### Returns
```
TX ID : 4a51d99f4700331850239f581810c83d9047595b8113494a260ffec14ca0fe7a
```

#### Example
```
ygg> ygg.register("/Users/haewonwoo/woohae/yggdrash-cli/seed/seed1.json")
or
ygg> ygg.register("/Users/haewonwoo/woohae/yggdrash-cli/seed/seed1.json", "10.10.10.100:8080")
```


## Coin
### fromTransfer
- defalt network - localhost
```
ygg> ygg.fromTransfer([branch id], [from address], [to address], [value])
or
ygg> ygg.fromTransfer([branch id], [from address], [to address], [value], [network])
```

#### Returns
```
TX ID : 4a51d99f4700331850239f581810c83d9047595b8113494a260ffec14ca0fe7a
```

#### Example
```
ygg> ygg.fromTransfer('186c70234e90406ff94eebd32edb9789346104a0', '0xaca4215631187ab5b3af0d4c251fdf45c79ad3c6', ygg.getAccount(0), 1000)
or
ygg> ygg.fromTransfer('186c70234e90406ff94eebd32edb9789346104a0', '0xaca4215631187ab5b3af0d4c251fdf45c79ad3c6', ygg.getAccount(0), 1000, "10.10.10.100:8080")
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
create account
```
$ ygg account new
```

Account list
```
$ ygg account list
```

Generate branch.json file
- option - o : owner
         - s : seed.json file
         - n : network

```
$ ygg stem plant --owner 0xaca4215631187ab5b3af0d4c251fdf45c79ad3c6 --seed /Users/homedir/yggdrash-cli/seed/yeed.branch.json
or
$ ygg stem plant -o 0xaca4215631187ab5b3af0d4c251fdf45c79ad3c6 -s /Users/homedir/yggdrash-cli/seed/yeed.branch.json
```

Transactions that register a branch with the stem
- defalt network - localhost
- option - b : branch file
         - n : network

```
$ ygg stem register --branch /Users/homedir/yggdrash-cli/seed/yeed.branch.json 
or
$ ygg stem register -b /Users/homedir/yggdrash-cli/seed/yeed.branch.json -n 10.10.10.10:8080
```

Transfer coin
- defalt network - localhost
- option - b : branch id
         - f : from address
         - t : to address
         - v : value
         - n : network
         
```
$ ygg transfer yeed --branch 3f5d7163fc703dee829f4a47640e8acedf0986ac --from 0x09a73e44b8195d5057d05386527406dbb34a468b --to 0x60212061e7bf6fba4b0607fc9c1f8bbb930d87d0 --value 1000
or
$ ygg transfer yeed -b 3f5d7163fc703dee829f4a47640e8acedf0986ac -f 0x09a73e44b8195d5057d05386527406dbb34a468b -t 0x60212061e7bf6fba4b0607fc9c1f8bbb930d87d0 -v 1000 -n 10.10.10.10:8080
```

## License
This project is licensed under the [MIT License](LICENSE).
