import { GroupedEdge, StructuredEdge } from "./../types/utils.types";
import { processData } from "./ao.service";


export const fetchAndSendData = async (edges: GroupedEdge) => {
    try {

        const res = await Promise.all([
            Promise.all(edges['Get-Data']?.map(async (item: StructuredEdge) => {
                return processData(item)
            })),
            Promise.all(edges['Post-Data']?.map(async (item: StructuredEdge) => {
                return processData(item)
            })),
        ]);
        return res;
    } catch (error) {
        console.error("Error processing data:", error);
        throw error
    }
};
