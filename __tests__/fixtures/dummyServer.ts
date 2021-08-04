import express from 'express';
const app = express();
app.use(express.static('__tests__/fixtures'));

app.get('/TestFinraReport.txt', function (req, res) {
    res.sendFile('TestFinraReport.txt');
});

export const server = app.listen(5000);
