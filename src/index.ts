import app from './app';
import { isNotGarbage } from './filter';
import './utils/updater';

const port = process.env.PORT;

app.listen(port, async () => {
    console.log('Server is up on port ' + port);
    await isNotGarbage.update();
});
