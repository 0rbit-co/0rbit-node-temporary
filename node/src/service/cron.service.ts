import { getDataQuery } from "../constants/query";
import { getDataFromFile, saveDataToFile } from "../utils/fileSystem";
import { fetchDataFromArweave, getStructuredEdges, groupStructuredEdgesByTagName } from "../utils/helper";
import { fetchAndSendData } from "./data.service";

export const cronForDataFeed = async () => {
    try {
        const file = (await getDataFromFile())
        const prevId: string | undefined = file.id ? file.id : undefined
        const query = getDataQuery();
        const { result, data, id } = await fetchDataFromArweave(query, prevId)

        if (!result) throw "No new Edges to process";
        const structuredEdges = getStructuredEdges(data);
        const groupedEdges = groupStructuredEdgesByTagName(structuredEdges, "Action")
        console.log(groupedEdges)

        const msgIds: any[] = await fetchAndSendData(groupedEdges);
        if (file.id !== id) saveDataToFile({ id })

        console.info(msgIds);
    } catch (error) {
        throw error
    }
}