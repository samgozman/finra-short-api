import app from './app';
import './utils/updater';

import { getFilter, updateAllFilters } from './filter';

const port = process.env.PORT;

app.listen(port, async () => {
    console.log('Server is up on port ' + port);

    // await updateAllFilters();

    console.log('totalVolGrows3D', (await getFilter(['totalVolGrows3D'])).count);
});
