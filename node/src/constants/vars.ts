import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import path from 'path';

dotenv.config();

export const NODE_WALLET_ADDRESS = process.env.NODE_WALLET_ADDRESS as string;
export const WALLET_FILE = JSON.parse(
    readFileSync(path.join(__dirname, '../../wallet.json')).toString(),
);



export const validateEnvironmentVariables = (): void => {
    const missingVariables = [];

    if (!NODE_WALLET_ADDRESS) missingVariables.push('NODE_WALLET_ADDRESS');
    if (!WALLET_FILE) missingVariables.push('WALLET_FILE');

    if (missingVariables.length > 0) {
        throw new Error(
            `Missing environment variables: ${missingVariables.join(', ')}`,
        );
    }
};