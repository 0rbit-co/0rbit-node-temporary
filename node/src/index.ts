import { PORT, validateEnvironmentVariables } from './constants/vars';
import { fetchDataFromArweave, getStructuredEdges } from './utils/helper';
import { getDataQuery } from './constants/query';
import { getDataFromFile, saveDataToFile } from './utils/fileSystem';
import { fetchAndSendData } from './service/data.service';
import cron from 'node-cron';


import express, { Request, Response } from 'express';
import { cronForDataFeed } from './service/cron.service';

// Create an Express application
const app = express();
const port = 3000;

// Define a route handler for the root path
app.get('/', (req: Request, res: Response) => {
    res.send('Orbit Node running');
});

if (validateEnvironmentVariables()) {
    app.listen(port, () => {
        console.info(`Server is running on http://localhost:${PORT}`);
    });
    cron.schedule('*/30 * * * * *', async () => {
        try {
            console.info("Cron job triggered")
            await cronForDataFeed();
            console.info("Cron job completed")
        } catch (error) {
            console.error('An error occurred in the cron job:', error)
        }
    })
}

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Perform any necessary cleanup or logging
    process.exit(1); // Exit the process with a non-zero exit code
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
    // Perform any necessary cleanup or logging
});