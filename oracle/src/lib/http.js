import Arweave from 'arweave'

const GQL_HOST = process.env.GQL_HOST || "arweave.net"

const arweave = Arweave.init({ host: GQL_HOST, port: 443, protocol: 'https' })

export async function http(addr, send) {
  // call graphql
  return arweave.api.post({
    query: query(),
    variables: {
      recipients: [addr]
    }
  })
    .then(todo) // TODO: parse edges
    .then(todo) // TODO: fetch and send data

}

function query() {
  return `
query ($recipients: [String!]) {
  transactions(recipients:$recipients,
    tags:[
    {name: "Data-Protocol", values:["ao"]},
      {name: "Variant", values:["ao.TN.1"]},
      {name: "Action", values: ["Get-Data"]},
  ],first:100,
    sort:HEIGHT_DESC) {
    edges {
      node {
        id
        block {
          timestamp
        }
        tags {
          name
          value
        }
      }
    }
  }
}   
  `
}

function todo(x) {
  return x
}