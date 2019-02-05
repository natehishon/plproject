import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import config from './config';
import routes from './routes';

let app = express();
app.server = http.createServer(app);

app.use(bodyParser.json({
    limit: config.bodyLimit
}));

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/v1', routes);

app.server.listen(config.port);
console.log(`started on port ${app.server.address().port}`);

export default app;

