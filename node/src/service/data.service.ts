import { createDataItemSigner } from "@permaweb/ao-connect";
import axios from "axios";
import { WALLET_FILE } from "./../constants/vars";
import { StructuredEdge } from "./../types/utils.types";
import { message } from "@permaweb/ao-connect";

export const fetchAndSendData = async (edges: StructuredEdge[]) => {
    try {
        const processData = async (item: { [key: string]: string }) => {
            const processId = item['Recipient'] || '';
            const url = item['Url'];

            if (!url) return;

            try {
                const { headers, data } = await axios.get(url);

                const messageData = {
                    process: processId || '4meJi6y2GrT1waJOfVIIonb23G72brFWYWevkSk1ipE',
                    signer: createDataItemSigner(WALLET_FILE),
                    tags: [{ name: "Action", value: "Receive-data-feed" }, { name: "Content-Type", value: headers['content-type'] }],
                    data: headers['content-type'].includes('application/json') ? JSON.stringify(data) : data
                };
                return message(messageData);
            } catch (error) {
                throw error
            }
        };

        return await Promise.all(edges.map(async (item) => {
            return processData(item.tags)
        }));
    } catch (error) {
        console.error("Error processing data:", error);
        throw error
    }
};
