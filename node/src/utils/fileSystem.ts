import path from "path";
import fs from 'fs'

// Function to get the previous cursor value from a JSON file
export const getDataFromFile = () => {
    const filePath = path.join(__dirname, '../../db/data.json');
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If the file doesn't exist or there's an error reading it, return null
        return null;
    }
};

// Function to save the previous cursor value to a JSON file
export const saveDataToFile = async (data: Record<string, any>) => {
    try {
        const filePath = path.join(__dirname, '../../db/data.json');
        await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        throw error;
    }
};