import cron from 'node-cron';

import { updateLastTradingDay } from './parse';

// Run every day except Sunday at 6.30pm ET (01:30 Moscow time) ('30 18 * * 1-6)
cron.schedule(
    '30 18 * * 1-6',
    async () => {
        try {
            await updateLastTradingDay();
        } catch (error) {
            console.error('CRON FAILURE!');
        }
    },
    {
        scheduled: true,
        timezone: 'America/New_York',
    }
);

export default cron;
