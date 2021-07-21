import { Stock } from '../models/Stock';
import { FinraReport } from '../models/Volume';

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

        // Find populate all stocks volumes
        for (const _id of allIds) {
            const stock = (await Stock.findById(_id))!;
            const volume = (await stock.getVirtual('volume', 20, 'desc')).volume;

            if (volume && volume.length > 1) {
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

                await stock.save();
            }
        }
    } catch (error) {
        console.error('Error in averages: ' + error);
    }
}
