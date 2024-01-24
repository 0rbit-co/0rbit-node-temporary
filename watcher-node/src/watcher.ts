import axios from "axios"
import { readFileSync } from 'fs';
import * as cron from 'node-cron';
import { example, getPrice, COINIDS, getData } from "./utils/constant"
import { createDataItemSigner, message } from "@permaweb/ao-connect";

const wallet = JSON.parse(
    readFileSync("./wallet.json").toString(),
);

const getTokenData = async (tokenArr: string[]) => {
    try {
        const target = "usd"
        let ids: string = '';
        const tokenIds = await Promise.all(
            tokenArr.map((token: string) => {
                const tokenKey = token.toLowerCase();
                if (COINIDS[tokenKey]) return COINIDS[tokenKey]
            })
        )
        tokenIds.forEach((tokenId: string) => {
            ids += `${tokenId},`
        })
        if (ids === '') throw "No token found to get the rates"
        const exchangeRate = (await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${target}`)).data;


        const res: any = {}
        await Promise.all(
            tokenArr.map(token => {
                if (!exchangeRate[COINIDS[token.toLowerCase()]]) return res[token] = "NA"
                return res[token] = { USD: exchangeRate[COINIDS[token.toLowerCase()]].usd, timestamp: Math.floor(new Date().getTime() / 1000) };
            })
        )

        console.info("Exchange rates:", res)
        return res;

    } catch (error: any) {
        console.error(error);
    }
}

const fetchAndSendData = async (arr: any) => {
    let processId = '';
    arr.forEach((item: any) => {
        item.node.tags.forEach(async (tag: any) => {
            if (tag.name === 'From-Process') processId = tag.value
            if (tag.name === "Token") {
                // Parse the value as JSON array and add each token to the set
                try {
                    console.log(processId)
                    const { headers, data } = await axios.get(tag.value)
                    console.log(headers['content-type'])
                    if (headers['content-type'].includes('application/json')) {
                        console.info(
                            await message({
                                process: processId,
                                signer: createDataItemSigner(wallet),
                                tags: [{ name: "Action", value: "Recieve-data-feed" }, { name: "Content-Type", value: headers['content-type'] }],
                                data: JSON.stringify(data)
                            })
                        )
                    }
                    else {
                        console.info(
                            await message({
                                process: processId,
                                signer: createDataItemSigner(wallet),
                                tags: [{ name: "Action", value: "Recieve-data-feed" }, { name: "Content-Type", value: headers['content-type'] }],
                                data: data
                            })
                        )
                    }
                } catch (e) {
                    console.log("error for token:", e)
                }
            }
        });
    });
}

function extractUniqueTokens(arr: any): string[] {
    const uniqueTokensSet = new Set<string>();

    arr.forEach((item: any) => {
        item.node.tags.forEach((tag: any) => {
            if (tag.name === "Token") {
                // Parse the value as JSON array and add each token to the set
                try {
                    const tokens: string[] = JSON.parse(tag.value);
                    tokens.forEach(token => uniqueTokensSet.add(token));
                } catch (e) {
                    console.log("error for token:", tag.value)
                }
            }
        });
    });

    // Convert set to array
    const uniqueTokensArray = Array.from(uniqueTokensSet);

    return uniqueTokensArray;
}

function filterObjectsByTimestamp(arr: any, maxAgeInMinutes: number) {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const maxTimestamp = currentTime - (maxAgeInMinutes * 60);

    return arr.filter((item: any) => {
        const timestamp = item.node.block.timestamp;
        return timestamp >= maxTimestamp;
    });
}

const queryFromArweave = async (example: string) => {
    const res = await axios.post("https://arweave.net/graphql", {
        query: example
    })
    const edges = await res.data.data.transactions.edges

    const uniqueNodeIds = new Set<string>();

    // Use filter to get only objects with unique node IDs
    const uniqueArray = edges.filter((item: any) => {
        if (uniqueNodeIds.has(item.node.id)) {
            return false; // Duplicate, filter it out
        } else {
            uniqueNodeIds.add(item.node.id);
            return true; // Unique, keep it
        }
    });

    // const finalArray: any[] = filterObjectsByTimestamp(uniqueArray, 2) // 2 is maximum age in minutes
    const finalArray = uniqueArray

    if (finalArray.length) { // check if there is a new data
        return {
            result: true,
            data: uniqueArray
        }
    }

    return {
        result: false,
        data: uniqueArray
    }

}

const filterData = (data: any, priceFeed: any) => {

    const resultObject = data.reduce((acc: any, item: any) => {
        const fromProcess = item.node.tags.find((tag: any) => tag.name === "From-Process")?.value;
        const tokens = JSON.parse(item.node.tags.find((tag: any) => tag.name === "Token")?.value || "[]");

        if (fromProcess) {
            if (!acc[fromProcess]) {
                acc[fromProcess] = {};
            }

            tokens.forEach((token: any) => {
                if (priceFeed[token]) {
                    acc[fromProcess][token] = priceFeed[token];
                }
            });
        }

        return acc;
    }, {});

    return resultObject
}

const postDataToAos = async (processId: string, data: any) => {

    console.info(
        await message({
            process: processId,
            signer: createDataItemSigner(wallet),
            tags: [{ name: "Action", value: "Recieve-token-prices" }],
            data: JSON.stringify(data)
        })
    )
}

const postFetchedDataToAos = async (processId: string, data: any, headers: any) => {

    console.info(
        await message({
            process: processId,
            signer: createDataItemSigner(wallet),
            tags: [{ name: "Action", value: "Recieve-token-prices" }, { name: "Content-Type", value: headers['content-type'] }],
            data: data
        })
    )
}

const priceFeedOracle = async () => {
    const { result, data } = await queryFromArweave(getPrice)
    if (!result) throw "No data to get price feed"
    const tokens = extractUniqueTokens(data)
    const priceFeed = await getTokenData(tokens)
    const filteredData = filterData(data, priceFeed)
    const processIds = Object.keys(filteredData)
    await Promise.all(
        processIds.map(async (id: any) => {
            console.log(id, filteredData[id])
            await postDataToAos(id, filteredData[id])
        })
    )
}

const fetchDataOracle = async () => {
    const { result, data } = await queryFromArweave(getData)
    if (!result) throw "No data to fetch"
    await fetchAndSendData(data);
}
(async () => {
    await fetchDataOracle()
})()
// Schedule the task to run every 30 seconds
// cron.schedule('*/30 * * * * *', async () => {
//     try {
//         await priceFeedOracle();
//         await fetchDataOracle();
//     } catch (error) {
//         console.error("Error occured in cron:", error)
//     }
// });