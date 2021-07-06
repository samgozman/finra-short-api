import app from './app';
import './utils/updater';

import { getFilter } from './filter';

const port = process.env.PORT;

app.listen(port, async () => {
    console.log('Server is up on port ' + port);
    console.log('Tinkoff total', (await getFilter('onTinkoff')).length);
    console.log('shortVolGrows5D total', (await getFilter('shortVolGrows5D')).length);
});
