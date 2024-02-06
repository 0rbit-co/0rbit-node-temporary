import axios from "axios";
import { Edge, StructuredEdge } from "../types/utils.types";
import { getDataQuery } from "../constants/query";


export const getStructuredEdges = (edges: Edge[]): StructuredEdge[] => {
    return edges.map(edge => {
        const newEdge: StructuredEdge = {
            id: edge.node.id,
            block: edge.node.block,
            tags: {} // Initialize an empty object to store the converted tags
        };

        if (Array.isArray(edge.node.tags)) {
            edge.node.tags.forEach(tag => {
                newEdge.tags[tag.name] = tag.value;
            });
        }

        return newEdge;
    });
}

export const fetchDataFromArweave = async (query: string) => {
    try {
        let res = await axios.post("https://arweave.net/graphql", {
            query: query
        })
        let { pageInfo, edges } = res.data.data.transactions
        while (pageInfo.hasNextPage) {
            const cursor = edges[edges.length - 1].cursor;
            const newQuery = getDataQuery(cursor)
            res = await axios.post("https://arweave.net/graphql", {
                query: newQuery
            })
            edges = [...edges, ...res.data.data.transactions.edges]
            pageInfo = res.data.data.transactions.pageInfo;
        }

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
                data: uniqueArray,
                cursor: edges[edges.length - 1].cursor
            }
        }

        return {
            result: false,
            data: uniqueArray,
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Handle axios error
            // console.error("An Axios error occurred:", error.response?.status, error.response?.data);
            throw {
                result: false,
                error: "Axios error: " + error.message,
                statusCode: error.response?.status, // Pass status code to caller
                data: error.response?.data.errors
            };
        } else {
            // Handle other types of errors
            throw {
                result: false,
                error // Pass error message to caller
            };
        }
    }

}