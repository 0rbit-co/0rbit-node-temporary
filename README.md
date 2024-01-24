# Simple Oracle Service

for `ao`

`ao` is a hyper parallel computer that provides decentralized compute. `ao` re Thinks decentralized compute by borrowing from the Unix Way Architecture with Erlang Actor Module boundaries. In Unix, everything is either a File or a Program, in `ao` everything is a Message or a Process. Just like files can be input and output to programs, Messages can be input and output to Processes in `ao`. This means there is no shared state or shared dependencies, `ao` uses a holographic state model. With this, `ao` makes it possible for Processes to connect to the outside world using messages, or as io. When an `ao` Process sends a message in which the Target is not a process, then it writes the message to Arweave a Permanent Storage Chain. The Simple Oracle service can query for those messages and process the requests, then send a message back to the Process, which it can process and manage.

## Run the Oracle Service

```sh
cd oracle
yarn
yarn start
```

## Load the Oracle Process

```sh
cd process
npm i -g https://get_ao.g8way.io
aos oracle --load oracle.lua
```