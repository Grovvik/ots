const Transaction = require('./Transaction.js');
const P2P = require('./P2P.js');
const fs = require('fs');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const crypto = require('crypto');

function hash(data) {
    return crypto.createHash('sha256').update(data).digest().toString('hex');
}

function getGenesis(stage) {
    const from = ["GENESIS", "048e19cbd6ce3be34cf349a925a7c59573aa022d21a0b762f53da51d64728c8e95ca04c4bb4676001a53e68a18096058dcebf13fb20450af7a2193cf07453de0af", "GENESIS", "04682f0661237f1d7cbb76ccb1400e9acdc3200f598e97b0ba5fe62e64e174682728e641bec92aba696baba10b36235058fb8f2d065670617514a06f2b561ae877", "GENESIS", "04b8e775b37fff1b4219fee19f087f50e9401cac59fe0b3ca5e270b2aa9eb9c4c67b3af3431cc1e06e90106adb6ef2fdbf3a156b6938c27a659249072a1d0555d3"];
    const to = ["048e19cbd6ce3be34cf349a925a7c59573aa022d21a0b762f53da51d64728c8e95ca04c4bb4676001a53e68a18096058dcebf13fb20450af7a2193cf07453de0af", "stake", "04682f0661237f1d7cbb76ccb1400e9acdc3200f598e97b0ba5fe62e64e174682728e641bec92aba696baba10b36235058fb8f2d065670617514a06f2b561ae877", "stake", "04b8e775b37fff1b4219fee19f087f50e9401cac59fe0b3ca5e270b2aa9eb9c4c67b3af3431cc1e06e90106adb6ef2fdbf3a156b6938c27a659249072a1d0555d3", "stake"];
    const amount = [10000010200, 1000010100, 10000010200, 1000010100, 10000010200, 1000010100];
    const transaction = new Transaction(from[stage], to[stage], amount[stage], "GENESIS", 0);

    return { transaction: JSON.parse(transaction.serialize()), validators: [], validatorsRoot: hash("") };
}

let chain;
if (!fs.existsSync(`./chain${process.env.PORT}.json`)) {
    chain = { transactions: [getGenesis(0), getGenesis(1), getGenesis(2), getGenesis(3), getGenesis(4), getGenesis(5)], accounts: {} };
    console.log("initialized new genesis transactions");
} else {
    chain = JSON.parse(fs.readFileSync(`./chain${process.env.PORT}.json`));
    console.log("loaded chain from " + `./chain${process.env.PORT}.json`)
}


const server = new P2P(chain, process.env.PORT, process.env.PEERS.split(','), process.env.KEY);
server.start()

process.stdin.on('data', (data) => {
    if (data.toString('ascii')[0] == "c") {
        console.log(server.validators.size);
        return;
    }
});

setInterval(() => fs.writeFileSync(`./chain${process.env.PORT}.json`, JSON.stringify(server.chain)), 15000)
