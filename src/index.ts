import app from './app';
import './utils/updater';

import { getFilter, updateAllFilters } from './filter';

const port = process.env.PORT;

app.listen(port, async () => {
    console.log('Server is up on port ' + port);

    await updateAllFilters();

    console.log('Tinkoff total', (await getFilter('onTinkoff')).length);
    console.log('shortVolGrows5D total', (await getFilter('shortVolGrows5D')).length);
    console.log('Union total #1:', (await getFilter('shortVolGrows5D', 'onTinkoff')).length);
    console.log('shortVolDecreases5D', (await getFilter('shortVolDecreases5D')).length);
    console.log('Union total #2:', (await getFilter('shortVolDecreases5D', 'onTinkoff')).length);
    console.log('shortVolRatioGrows5D', (await getFilter('shortVolRatioGrows5D')).length);
    console.log('shortVoRatiolDecreases5D', (await getFilter('shortVoRatiolDecreases5D')).length);
    console.log('totalVolGrows5D', (await getFilter('totalVolGrows5D')).length);
    console.log('totalVolDecreases5D', (await getFilter('totalVolDecreases5D')).length);
    console.log('shortExemptVolRatioGrows3D', (await getFilter('shortExemptVolRatioGrows3D')).length);
});
