import { Stock } from '../models/Stock';
import { FinraReport } from '../models/Volume';
import { lastDateTime } from './lastDateTime';

// Calculate average volume
const avgVol = (arr: FinraReport[], key: keyof FinraReport & string): number => {
    let sum = 0;
    for (const i in arr) {
        sum += arr[i][key] as number;
    }
    return sum / arr.length;
};

export async function averages() {
    try {
        const allIds = await Stock.avalibleTickers();
        const latestDate = await lastDateTime();

        for (const _id of allIds) {
            const stock = (await Stock.findById(_id))!;
            const volume = (await stock.getVirtual('volume', 20, 'desc')).volume;

            // Check that the volume array is exists and stock was traded during last day
            if (volume && volume.length > 1 && volume[0].date.getTime() === latestDate) {
                // last day (copy just to be able to sort faster without population)
                stock.totalVolLast = volume[0].totalVolume;
                stock.shortVolRatioLast = (volume[0].shortVolume / volume[0].totalVolume) * 100;
                stock.shortExemptVolRatioLast = (volume[0].shortExemptVolume / volume[0].totalVolume) * 100;

                // 5 days
                const vol5 = volume.slice(0, 5);
                stock.totalVol5DAVG = avgVol(vol5, 'totalVolume');
                stock.shortVolRatio5DAVG = (avgVol(vol5, 'shortVolume') / stock.totalVol5DAVG) * 100;
                stock.shortExemptVolRatio5DAVG =
                    (avgVol(vol5, 'shortExemptVolume') / stock.totalVol5DAVG) * 100;

                // 20 days
                stock.totalVol20DAVG = avgVol(volume, 'totalVolume');
                stock.shortVolRatio20DAVG = (avgVol(volume, 'shortVolume') / stock.totalVol20DAVG) * 100;
                stock.shortExemptVolRatio20DAVG =
                    (avgVol(volume, 'shortExemptVolume') / stock.totalVol20DAVG) * 100;
            } else {
                // Clear statistics
                stock.totalVolLast = 0;
                stock.shortVolRatioLast = 0;
                stock.shortExemptVolRatioLast = 0;
                stock.totalVol5DAVG = 0;
                stock.shortVolRatio5DAVG = 0;
                stock.shortExemptVolRatio5DAVG = 0;
                stock.totalVol20DAVG = 0;
                stock.shortVolRatio20DAVG = 0;
                stock.shortExemptVolRatio20DAVG = 0;
            }
            await stock.save();
        }
    } catch (error) {
        console.error('Error in averages: ' + error);
    }
}
