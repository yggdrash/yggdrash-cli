# YGGDRASH CLI

## Usage
1. Interactive use
2. Non-Interactive use

## 1. Interactive use
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

### Returns
```
Address - 4349f9965c6b488f2b17a62bfdd90aba6167a2f3
```
- - -

### admin
- An account that runs transactions and noe by default
- option - owner update (address)
```
ygg> ygg.account.admin([option])
```

### Returns
```
Admin - 09a73e44b8195d5057d05386527406dbb34a468b
```
- - -

### getAccounts
- Displays a list of all account accounts created by cli.
```
ygg> ygg.account.getAccounts()
```

### Returns
```
09a73e44b8195d5057d05386527406dbb34a468b
c8d19bf9f999eae06a71da8c17000206ef463f39
2923379d13d6d56db59fc8b615218b023e634752
...
```
- - -

### getAccount
- You can query the account of a specific account.
```
ygg> ygg.account.getAccount(0)
```

### Returns
```
09a73e44b8195d5057d05386527406dbb34a468b
```
- - -

### clear
- Delete all accounts created with cli.
```
ygg> ygg.account.clear()
```
- - -

## Transaction
- Sends a transaction to the network.

### Transaction - transferFrom
- This is the method that generates the transaction including the from address from which to generate the transaction.
- Set the branch chain to send the transaction before sending the transaction.
  - ygg branch set
- default network - localhost
- option - network
```
ygg> ygg.transferFrom([from address], [to address], [value], [option])
```

#### Returns
```
TX ID : 4a51d99f4700331850239f581810c83d9047595b8113494a260ffec14ca0fe7a
```

#### Example
```
ygg> ygg.transferFrom('aca4215631187ab5b3af0d4c251fdf45c79ad3c6', ygg.getAccount(0), 1000, ["testnet.yggdrash.io"])
```
- - -

### Transaction - transfer
- Unlike from transfer, from becomes an admin account and generates a transaction.
- Set the branch chain to send the transaction before sending the transaction.
  - ygg branch set
- default network - localhost
- option - network
- transfer default account - admin
```
ygg> ygg.transfer([to address], [value], [option])
```
#### Returns
```
TX ID : 4a51d99f4700331850239f581810c83d9047595b8113494a260ffec14ca0fe7a
```

#### Example
```
ygg> ygg.transfer(ygg.getAccount(0), 1000, ["testnet.yggdrash.io"])
```
- - -

## Query
### getBalance
- Before querying the balance, you should select the branch you want to query for balance.
  - ygg branch set
```
ygg> ygg.getBalance([address])
```

#### Returns
```
Balance : 999000000
```

#### Example
```
ygg> ygg.getBalance('aca4215631187ab5b3af0d4c251fdf45c79ad3c6')
```
- - -
- - -

## 2. Non-Interactive use
```
$ ygg <command> [options]
```
- - -

## Wallet

### create account

#### Example
```
$ ygg account new
```
- - -

### admin account
- An account that runs transactions by default
- option -o : admin (update admin - address)
#### Example
```
$ ygg account admin
```
- - -

### Account list
- Displays a list of all account accounts created by cli.
#### Example
```
$ ygg account list
```
- - -

### clear
- Delete all accounts created with cli.
#### Example
```
$ ygg account clear
```
- - -

## Node
- A collection of libraries that allows you to control nodes using an administrator account

### build
Build the node
- By default, the node is created in the .yggdrash folder under the home folder and is built to start the node.
```
$ ygg node build
```
- - -

### start
Start the node
- Nodes can only be controlled by the admin account, and you must enter the password for the admin account.
- Run the node with the admin account on cli.
- options - node path
```
$ ygg node start
```
- - -

### status
View status the node
- This is a method that can query the status of the currently executing node.
```
$ ygg node status
```
- - -

### stop
Stop the node
- This method stops the currently executing node.
```
$ ygg node stop
```
- - -

## Generate branch
- You can create an environment that allows you to do branch chain development.
### init
- Generate seed file information to create branch
  - The init command creates a contract and a seed.json file in that folder.
  - The folder must be empty.
#### Example
```
$ ygg branch init 
```
#### Returns
mco.seed.json
```
{
  "name":"metacoin",
  "symbol":"MCO",
  "property":"currency",
  "description":"meta coin",
  "contractId": "",
  "genesis": {
     "alloc": {
  		  	"c91e9d46dd4b7584f0b6348ee18277c10fd7cb94": {
    	  		"balance": "1000000000"
				}
	  }
  }
}
```
- - -

### build
- Build a contract (Java file) to create a branch chain and create a branch file using the seed file.
- You can add frontiers to your pre-build seed file to build the branch, and the contract id can be any pre-built contract id.
``` warning
The branch.json file is a signature file of the seed.json file, which acts as a generic for each branch chain. All data must be serialized and signed, so no blanks should be modified.
```
#### Example
```
$ ygg branch build
```
#### Returns
mco.branch.json
```
{
      "name":"metacoin",
      "symbol":"MCO",
      "property":"currency",
      "description":"Meta coin sample",
      "contractId": "1600949e1473163ed3918bc3c12f421b3fbd18c3",
      "genesis": {
        "alloc": {
      		  	"3282791d6fd713f1e94f4bfd565eaa78b3a0599d": {
        	  		"balance": "1000000000"
    			},
        		"17961d633bcf20a7b029a7d94b7df4da2ec5427f": {
          			"balance": "1000000000"
    			}
    	  }
      },
      "timestamp": "00000166c837f0c9",
      "owner":"c91e9d46dd4b7584f0b6348ee18277c10fd7cb94",
      "signature":"1b7727aceca367f230591fc9c08a21142b95b8d88bbc97ad06a384b0946c23e4373cedb505b66fdf138e8431132ac034f62cb14d44c2ecde8b99c4a0f90e08bc5c",
}
```
- - -

### deploy
- Branch deployment to nodes
  - default network - localhost
- deploy location
```
$HOME/.yggdrash/branch/[branchId]/branch.json
$HOME/.yggdrash/contract/[2charOfContractId]/[ContractId].class
```
```
$HOME/.yggdrash/branch/27d5e39f2bddfc0afa4f617546bc12327b2e546b/branch.json
$HOME/.yggdrash/contract/13/13aab675b514a29e39611eda2b5563cfd9e92932.class
```
#### Example
```
$ ygg branch deploy
```
- - -

### list
- Get the branch list.
#### Example
```
$ ygg branch list
```
- - -

### set
- Set the transaction or branch when querying.
#### Example
```
$ ygg branch set
```
- - -

### status
- Retrieves branch information currently set.
#### Example
```
$ ygg branch status
```
- - -

## Transaction
### transferFrom
- This is the method that generates the transaction including the from address from which to generate the transaction.
- Set the branch chain to send the transaction before sending the transaction.
  - ygg branch set
- default network - localhost
- option - f : from address
         - t : to address
         - v : value
         - n : network

#### Example         
```
$ ygg transaction transferFrom -t 60212061e7bf6fba4b0607fc9c1f8bbb930d87d0 -v 1000 [-n testnet.yggdrash.io]
```
#### Returns
transaction hash
```
ebbe3d2ae42f7fdf0d6f81bca7aec9cac79d58ee688d34ac75ef3a03cfc4d56b
```
- - -

### transfer
- Unlike from transfer, from becomes an admin account and generates a transaction.
- Set the branch chain to send the transaction before sending the transaction.
  - ygg branch set
- default network - localhost
- option - t : to address
         - v : value
         - n : network
         
#### Example
```
$ ygg transaction transfer --to 60212061e7bf6fba4b0607fc9c1f8bbb930d87d0 --value 1000 [-n testnet.yggdrash.io]
```
#### Returns
transaction hash
```
ebbe3d2ae42f7fdf0d6f81bca7aec9cac79d58ee688d34ac75ef3a03cfc4d56b
```
- - -

### approve
- In my account, grant some rights to the amount of money available to a particular account.
- Set the branch chain to send the transaction before sending the transaction.
- The address of from is the admin account by default.
  - ygg branch set
- default network - localhost
- option - s : spender address
         - v : value
         - n : network
         
#### Example
```
$ ygg transaction approve --spender 60212061e7bf6fba4b0607fc9c1f8bbb930d87d0 --value 1000 [-n testnet.yggdrash.io]
```
#### Returns
transaction hash
```
ebbe3d2ae42f7fdf0d6f81bca7aec9cac79d58ee688d34ac75ef3a03cfc4d56b
```
- - -

## Query
### getBalance
- default network - localhost
- option - a : address
         - n : network

#### Example
```
$ ygg query balanceOf -a aca4215631187ab5b3af0d4c251fdf45c79ad3c6 [-n testnet.yggdrash.io]
```
#### Returns
bignumber
```
1000000000
```