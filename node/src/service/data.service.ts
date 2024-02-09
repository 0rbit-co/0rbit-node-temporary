import { createDataItemSigner } from "@permaweb/ao-connect";
import axios from "axios";
import { WALLET_FILE } from "./../constants/vars";
import { StructuredEdge } from "./../types/utils.types";
import { message } from "@permaweb/ao-connect";

function isValidUrl(url: string): boolean {
    const pattern: RegExp = /^(ftp|http|https):\/\/[^ "]+$/;
    return pattern.test(url);
}

export const fetchAndSendData = async (edges: StructuredEdge[]) => {
    try {
        const processData = async (item: { [key: string]: string }) => {
            const processId = item['Recipient'] || '';
            const url = item['Url'];

            if (!url) return;
            try {

                if (!isValidUrl(url)) {
                    return message({
                        process: processId || '4meJi6y2GrT1waJOfVIIonb23G72brFWYWevkSk1ipE',
                        signer: createDataItemSigner(WALLET_FILE),
                        tags: [{ name: "Action", value: "Receive-data-feed" }, { name: "Content-Type", value: "text/html" }],
                        data: "The url is no valid."
                    });
                }

                console.info("Fetching url: ", url)
                const { headers, data } = await axios.get(url);

                const messageData = {
                    process: processId || '4meJi6y2GrT1waJOfVIIonb23G72brFWYWevkSk1ipE',
                    signer: createDataItemSigner(WALLET_FILE),
                    tags: [{ name: "Action", value: "Receive-data-feed" }, { name: "Content-Type", value: headers['content-type'] || 'text/html' }],
                    data: headers['content-type'] && headers['content-type'].includes('application/json') ? JSON.stringify(data) : String(data)
                };
                return message(messageData);
            } catch (error) {
                throw error
            }
        };

        const res = await Promise.all(edges.map(async (item) => {
            return processData(item.tags)
        }));
        return res;
    } catch (error) {
        console.error("Error processing data:", error);
        throw error
    }
};
