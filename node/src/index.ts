import { validateEnvironmentVariables } from './constants/vars';
import { fetchDataFromArweave, getStructuredEdges } from './utils/helper';
import { getDataQuery } from './constants/query';
import { getDataFromFile, saveDataToFile } from './utils/fileSystem';
import { fetchAndSendData } from './service/data.service';

(async () => {
    validateEnvironmentVariables();
    const file = (await getDataFromFile())
    const query = file.cursor ? getDataQuery(file.cursor) : getDataQuery();
    const { result, data, cursor } = await fetchDataFromArweave(query)
    if (!result) throw "No new Edges to process";
    if (file.cursor !== cursor) saveDataToFile({ cursor })
    const structuredEdges = getStructuredEdges(data)
    const msgIds: any[] = await fetchAndSendData(structuredEdges);

    console.info(msgIds);

})().catch(err => console.log(err))