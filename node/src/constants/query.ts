import { NODE_WALLET_ADDRESS } from "./vars";

export function getDataQuery(afterCursor?: string) {
    let afterClause = "";
    if (afterCursor) {
        afterClause = `after:"${afterCursor}",`;
    }

    return `query{
  transactions(recipients:["${NODE_WALLET_ADDRESS}"],
    tags:[
    {name: "Data-Protocol", values:["ao"]},
      {name: "Variant", values:["ao.TN.1"]},
      {name: "Action", values: ["Get-Data"]},
    ],first:100, ${afterClause}
    sort:HEIGHT_ASC) {
    pageInfo{
      hasNextPage
    }
    edges {
      cursor
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
}`;
}
